#!/usr/bin/env python3
"""
deploy.py — One-command deployment for the portfolio website.

Usage:
    python deploy.py                          # interactive prompts
    python deploy.py --region us-east-1       # specify region
    python deploy.py --github-token ghp_xxx   # skip token prompt
"""

import argparse
import getpass
import subprocess
import sys
from pathlib import Path

# ── Auto-install missing dependencies ────────────────────────────────────────

REQUIRED = ["boto3"]

def ensure_dependencies():
    missing = []
    for pkg in REQUIRED:
        try:
            __import__(pkg)
        except ImportError:
            missing.append(pkg)

    if missing:
        print(f"\n  Installing missing packages: {', '.join(missing)}")
        try:
            subprocess.check_call(
                [sys.executable, "-m", "pip", "install", *missing],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            print(f"  [OK]  Installed: {', '.join(missing)}")
        except subprocess.CalledProcessError:
            print(f"\n  [FAIL] Could not install {', '.join(missing)}.")
            print(f"         Try manually:  pip install {' '.join(missing)}\n")
            sys.exit(1)

ensure_dependencies()

import boto3  # type: ignore
from botocore.exceptions import ClientError, WaiterError  # type: ignore

# ── Config ────────────────────────────────────────────────────────────────────

STACK_NAME    = "portfolio-website"
TEMPLATE_FILE = Path(__file__).parent / "deployment.yml"
ENV_FILE      = Path(__file__).parent / ".env.local"
GITHUB_OWNER  = "Samukelo-Mkhonza"
GITHUB_REPO   = "my-profile-website"
GITHUB_BRANCH = "main"

# env var name → (SSM parameter path, prompt label)
CREDENTIAL_KEYS = {
    "REACT_APP_EMAILJS_SERVICE_ID":  (
        "/portfolio/emailjs/service_id",
        "EmailJS Service ID            (e.g. service_xxxxxxx)",
    ),
    "REACT_APP_EMAILJS_TEMPLATE_ID": (
        "/portfolio/emailjs/template_id",
        "EmailJS Notification Template (e.g. template_xxxxxxx)",
    ),
    "REACT_APP_EMAILJS_AUTOREPLY_TEMPLATE_ID": (
        "/portfolio/emailjs/autoreply_template_id",
        "EmailJS Auto-Reply Template   (e.g. template_xxxxxxx)",
    ),
    "REACT_APP_EMAILJS_PUBLIC_KEY":  (
        "/portfolio/emailjs/public_key",
        "EmailJS Public Key",
    ),
}

# Values that mean "not yet filled in"
PLACEHOLDERS = {"your_service_id", "your_template_id", "your_public_key", ""}

# ── Helpers ───────────────────────────────────────────────────────────────────

def banner(msg):
    width = 58
    print(f"\n{'─' * width}")
    print(f"  {msg}")
    print(f"{'─' * width}")

def ok(msg):   print(f"  [OK]  {msg}")
def info(msg): print(f"  ...   {msg}")
def fail(msg):
    print(f"\n  [FAIL] {msg}\n", file=sys.stderr)
    sys.exit(1)

# ── Steps ─────────────────────────────────────────────────────────────────────

def check_template():
    if not TEMPLATE_FILE.exists():
        fail(f"deployment.yml not found at {TEMPLATE_FILE}")
    ok(f"Found {TEMPLATE_FILE.name}")


def parse_env_file(path: Path) -> dict:
    """Parse a .env file into a dict, skipping comments and blank lines."""
    result = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        result[key.strip()] = value.strip()
    return result


def resolve_credentials() -> dict:
    """
    Returns {ssm_path: value} for all EmailJS credentials.
    Reads .env.local when present; prompts for any value that is
    missing or still a placeholder, then writes them back to .env.local.
    """
    banner("Step 1/4 — Resolving EmailJS credentials")

    existing = {}
    if ENV_FILE.exists():
        existing = parse_env_file(ENV_FILE)
        ok(f"Found {ENV_FILE.name} — reading values")
    else:
        info(f"{ENV_FILE.name} not found — will prompt for values and create it")

    resolved  = {}   # env_key → value
    prompted  = False

    for env_key, (ssm_path, label) in CREDENTIAL_KEYS.items():
        value = existing.get(env_key, "").strip()

        if value in PLACEHOLDERS:
            value = ""

        if value:
            ok(f"Read    {env_key}")
        else:
            prompted = True
            print(f"\n  {label}")
            value = input(f"  {env_key}: ").strip()
            if not value:
                fail(f"{env_key} is required.")

        resolved[env_key] = value

    # Write/update .env.local whenever we had to prompt
    if prompted:
        lines = [
            "# EmailJS credentials — managed by deploy.py\n",
            "# Get these from https://www.emailjs.com/\n",
            "\n",
        ]
        for env_key, value in resolved.items():
            lines.append(f"{env_key}={value}\n")
        ENV_FILE.write_text("".join(lines), encoding="utf-8")
        ok(f"Saved credentials to {ENV_FILE.name}")

    # Return as SSM path → value
    return {
        ssm_path: resolved[env_key]
        for env_key, (ssm_path, _) in CREDENTIAL_KEYS.items()
    }


def put_ssm_params(region: str, ssm_params: dict):
    banner("Step 2/4 — Storing credentials in SSM Parameter Store")
    ssm = boto3.client("ssm", region_name=region)
    for name, value in ssm_params.items():
        try:
            ssm.put_parameter(Name=name, Value=value, Type="SecureString", Overwrite=True)
            ok(f"Stored  {name}")
        except ClientError as e:
            fail(f"Could not write SSM param {name}: {e}")


def deploy_stack(region: str, github_token: str):
    banner("Step 3/4 — Deploying CloudFormation stack")
    cfn = boto3.client("cloudformation", region_name=region)
    template_body = TEMPLATE_FILE.read_text(encoding="utf-8")

    params = [
        {"ParameterKey": "GitHubOwner",  "ParameterValue": GITHUB_OWNER},
        {"ParameterKey": "GitHubRepo",   "ParameterValue": GITHUB_REPO},
        {"ParameterKey": "GitHubBranch", "ParameterValue": GITHUB_BRANCH},
        {"ParameterKey": "GitHubToken",  "ParameterValue": github_token},
    ]
    capabilities = ["CAPABILITY_IAM"]

    # Check existing stack state
    stack_exists = False
    try:
        resp   = cfn.describe_stacks(StackName=STACK_NAME)
        status = resp["Stacks"][0]["StackStatus"]

        if status in ("ROLLBACK_COMPLETE", "CREATE_FAILED"):
            info(f"Stack is in {status} — removing it first for a clean redeploy")
            cfn.delete_stack(StackName=STACK_NAME)
            info("Waiting for deletion to finish…")
            cfn.get_waiter("stack_delete_complete").wait(
                StackName=STACK_NAME,
                WaiterConfig={"Delay": 10, "MaxAttempts": 60},
            )
            ok("Old stack removed")
        else:
            stack_exists = True
    except ClientError:
        pass  # stack does not exist yet

    if stack_exists:
        info(f"Updating existing stack '{STACK_NAME}'")
        try:
            cfn.update_stack(
                StackName=STACK_NAME,
                TemplateBody=template_body,
                Parameters=params,
                Capabilities=capabilities,
            )
            waiter_name = "stack_update_complete"
        except ClientError as e:
            if "No updates are to be performed" in str(e):
                ok("Stack is already up to date — no changes needed")
                return
            fail(f"Update failed: {e}")
    else:
        info(f"Creating new stack '{STACK_NAME}'")
        try:
            cfn.create_stack(
                StackName=STACK_NAME,
                TemplateBody=template_body,
                Parameters=params,
                Capabilities=capabilities,
            )
        except ClientError as e:
            fail(f"Create failed: {e}")
        waiter_name = "stack_create_complete"

    info("Waiting for stack to finish (usually 3-5 minutes)…")
    try:
        cfn.get_waiter(waiter_name).wait(
            StackName=STACK_NAME,
            WaiterConfig={"Delay": 15, "MaxAttempts": 80},
        )
        ok("Stack operation completed successfully")
    except WaiterError:
        events = cfn.describe_stack_events(StackName=STACK_NAME)["StackEvents"]
        print("\n  Recent failure events:")
        for ev in events[:10]:
            if "FAILED" in ev.get("ResourceStatus", ""):
                print(f"    {ev.get('LogicalResourceId')}: {ev.get('ResourceStatusReason')}")
        fail("Stack operation failed. See events above.")


def show_outputs(region: str):
    banner("Step 4/4 — Deployment complete")
    cfn = boto3.client("cloudformation", region_name=region)
    try:
        outputs = cfn.describe_stacks(StackName=STACK_NAME)["Stacks"][0].get("Outputs", [])
        if outputs:
            print()
            for o in outputs:
                print(f"  {o['OutputKey']:<28} {o['OutputValue']}")
    except ClientError as e:
        fail(f"Could not read stack outputs: {e}")


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Deploy portfolio website to AWS")
    parser.add_argument("--region",       default=None, help="AWS region (e.g. af-south-1)")
    parser.add_argument("--github-token", default=None, help="GitHub Personal Access Token")
    args = parser.parse_args()

    print("\n  Portfolio Website — AWS Deployment Script")

    check_template()

    # Region
    region = args.region or input("\n  AWS region [af-south-1]: ").strip() or "af-south-1"

    # GitHub token — never echoed to terminal
    github_token = args.github_token
    if not github_token:
        print("\n  GitHub Personal Access Token (needs repo + admin:repo_hook scopes)")
        print("  Create one at: https://github.com/settings/tokens")
        github_token = getpass.getpass("  Token: ").strip()
    if not github_token:
        fail("GitHub token is required.")

    print(f"\n  Region:      {region}")
    print(f"  Stack name:  {STACK_NAME}")
    print(f"  Repository:  {GITHUB_OWNER}/{GITHUB_REPO}  (@{GITHUB_BRANCH})")

    ssm_params = resolve_credentials()
    put_ssm_params(region, ssm_params)
    deploy_stack(region, github_token)
    show_outputs(region)

    banner("All done")
    print("  Your site is live at the CloudFrontDomain URL shown above.")
    print("  Every push to 'main' will trigger an automatic rebuild.\n")


if __name__ == "__main__":
    main()
