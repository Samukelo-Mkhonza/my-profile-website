#!/usr/bin/env python3
"""
deploy.py — One-command deployment for the portfolio website.

Usage:
    python deploy.py                          # interactive prompts
    python deploy.py --region us-east-1       # specify region
    python deploy.py --github-token ghp_xxx   # skip token prompt

Requires:
    pip install boto3
"""

import argparse
import getpass
import sys
from pathlib import Path

try:
    import boto3
    from botocore.exceptions import ClientError, WaiterError
except ImportError:
    print("\n  boto3 is not installed. Run:  pip install boto3\n")
    sys.exit(1)

# ── Config ─────────────────────────────────────────────────────────────────

STACK_NAME    = "portfolio-website"
TEMPLATE_FILE = Path(__file__).parent / "deployment.yml"
GITHUB_OWNER  = "Samukelo-Mkhonza"
GITHUB_REPO   = "my-profile-website"
GITHUB_BRANCH = "main"

SSM_PARAMS = {
    "/portfolio/emailjs/service_id":  "service_rwrv352",
    "/portfolio/emailjs/template_id": "template_r6hdtsv",
    "/portfolio/emailjs/public_key":  "4LBcXdEwko_IHgCwG",
}

# ── Helpers ─────────────────────────────────────────────────────────────────

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

# ── Steps ────────────────────────────────────────────────────────────────────

def check_template():
    if not TEMPLATE_FILE.exists():
        fail(f"deployment.yml not found at {TEMPLATE_FILE}")
    ok(f"Found {TEMPLATE_FILE.name}")


def put_ssm_params(region):
    banner("Step 1/3 — Storing credentials in SSM Parameter Store")
    ssm = boto3.client("ssm", region_name=region)
    for name, value in SSM_PARAMS.items():
        try:
            ssm.put_parameter(Name=name, Value=value, Type="SecureString", Overwrite=True)
            ok(f"Stored  {name}")
        except ClientError as e:
            fail(f"Could not write SSM param {name}: {e}")


def deploy_stack(region, github_token):
    banner("Step 2/3 — Deploying CloudFormation stack")
    cfn = boto3.client("cloudformation", region_name=region)
    template_body = TEMPLATE_FILE.read_text(encoding="utf-8")

    params = [
        {"ParameterKey": "GitHubOwner",  "ParameterValue": GITHUB_OWNER},
        {"ParameterKey": "GitHubRepo",   "ParameterValue": GITHUB_REPO},
        {"ParameterKey": "GitHubBranch", "ParameterValue": GITHUB_BRANCH},
        {"ParameterKey": "GitHubToken",  "ParameterValue": github_token},
    ]
    capabilities = ["CAPABILITY_IAM"]

    # Determine create vs update
    stack_exists = False
    try:
        resp = cfn.describe_stacks(StackName=STACK_NAME)
        status = resp["Stacks"][0]["StackStatus"]
        # If a previous attempt left the stack in a broken state, offer to delete it
        if status in ("ROLLBACK_COMPLETE", "CREATE_FAILED"):
            info(f"Stack is in {status} state — deleting it first so we can redeploy cleanly")
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

    info("Waiting for stack to finish (this usually takes 3-5 minutes)…")
    try:
        cfn.get_waiter(waiter_name).wait(
            StackName=STACK_NAME,
            WaiterConfig={"Delay": 15, "MaxAttempts": 80},
        )
        ok("Stack operation completed successfully")
    except WaiterError:
        # Print the failure events so the user knows what went wrong
        events = cfn.describe_stack_events(StackName=STACK_NAME)["StackEvents"]
        print("\n  Recent stack events:")
        for ev in events[:8]:
            status = ev.get("ResourceStatus", "")
            reason = ev.get("ResourceStatusReason", "")
            resource = ev.get("LogicalResourceId", "")
            if "FAILED" in status:
                print(f"    {resource}: {status} — {reason}")
        fail("Stack operation failed. See events above.")


def show_outputs(region):
    banner("Step 3/3 — Deployment complete")
    cfn = boto3.client("cloudformation", region_name=region)
    try:
        outputs = cfn.describe_stacks(StackName=STACK_NAME)["Stacks"][0].get("Outputs", [])
        if outputs:
            print()
            for o in outputs:
                print(f"  {o['OutputKey']:<28} {o['OutputValue']}")
    except ClientError as e:
        fail(f"Could not read stack outputs: {e}")


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Deploy portfolio website to AWS")
    parser.add_argument("--region",        default=None, help="AWS region (e.g. af-south-1)")
    parser.add_argument("--github-token",  default=None, help="GitHub Personal Access Token")
    args = parser.parse_args()

    print("\n  Portfolio Website — AWS Deployment Script")

    check_template()

    # Region
    region = args.region or input("\n  AWS region [af-south-1]: ").strip() or "af-south-1"

    # GitHub token — never echoed to terminal
    github_token = args.github_token
    if not github_token:
        print("\n  GitHub Personal Access Token needs repo + admin:repo_hook scopes.")
        print("  Create one at: https://github.com/settings/tokens")
        github_token = getpass.getpass("  Token: ").strip()
    if not github_token:
        fail("GitHub token is required.")

    print(f"\n  Region:      {region}")
    print(f"  Stack name:  {STACK_NAME}")
    print(f"  Repository:  {GITHUB_OWNER}/{GITHUB_REPO}  (@{GITHUB_BRANCH})")

    put_ssm_params(region)
    deploy_stack(region, github_token)
    show_outputs(region)

    banner("All done")
    print("  Your site is live at the CloudFrontDomain URL shown above.")
    print("  Every push to 'main' will trigger an automatic rebuild.\n")


if __name__ == "__main__":
    main()
