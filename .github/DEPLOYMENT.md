# CI/CD with GitHub Actions

This repo has three workflows in [`.github/workflows/`](workflows/):

```
push / PR to main
      │
      ▼
┌─────────────────────────────┐
│ CI (ci.yml)                 │
│  1. lint  (eslint, strict)  │
│  2. test  (jest + coverage) │
│  3. build (CRA production)  │──── uploads build/ artifact
└─────────────────────────────┘
      │  success on main only
      ├──────────────────────────────┐
      ▼                              ▼
┌─────────────────────────────┐  ┌─────────────────────────────┐
│ Deploy (deploy.yml)         │  │ Pages (pages.yml)           │
│  1. rebuild at the exact    │  │  1. rebuild with            │
│     commit CI validated     │  │     PUBLIC_URL set for      │
│  2. assume AWS role (OIDC)  │  │     the /my-profile-website │
│  3. aws s3 sync → bucket    │  │     subpath                 │
│  4. CloudFront invalidation │  │  2. deploy to GitHub Pages  │
└─────────────────────────────┘  └─────────────────────────────┘
```

Both deploy workflows are gated and **skip themselves until you flip their
switch** — `AWS_DEPLOY_ROLE_ARN` for AWS, `PAGES_ENABLED` for Pages — so
everything can be merged safely before either target is wired up.

The two targets serve the same site from different roots (CloudFront from `/`,
Pages from `/my-profile-website/`), which is why `package.json` has **no
`homepage` field**: each deploy workflow sets its own `PUBLIC_URL` instead.
Don't add one — it would break the other target's asset paths.

---

## 1. Repository secrets

`Settings → Secrets and variables → Actions → Secrets`. These are baked into
the JS bundle at build time (Create React App inlines `REACT_APP_*` vars) —
the same values `deploy.py` stores in SSM Parameter Store.

| Secret | Example |
|---|---|
| `REACT_APP_EMAILJS_SERVICE_ID` | `service_xxxxxxx` |
| `REACT_APP_EMAILJS_TEMPLATE_ID` | `template_xxxxxxx` |
| `REACT_APP_EMAILJS_AUTOREPLY_TEMPLATE_ID` | `template_xxxxxxx` |
| `REACT_APP_EMAILJS_PUBLIC_KEY` | (EmailJS → Account → Public Key) |

## 2. Repository variables

`Settings → Secrets and variables → Actions → Variables`. The first three come
from the existing CloudFormation stack:

```bash
aws cloudformation describe-stacks --stack-name portfolio-website \
  --query "Stacks[0].Outputs" --output table
```

| Variable | Value |
|---|---|
| `S3_BUCKET` | `WebsiteBucketName` stack output |
| `CLOUDFRONT_DISTRIBUTION_ID` | ID of the distribution behind `CloudFrontDomain` (`aws cloudfront list-distributions`) |
| `AWS_REGION` | e.g. `us-east-1` |
| `AWS_DEPLOY_ROLE_ARN` | ARN of the IAM role from step 3 — **setting this turns AWS deploys on** |
| `PAGES_ENABLED` | `true` — **setting this turns GitHub Pages deploys on** (see the GitHub Pages section) |

## 3. AWS IAM role for OIDC (no stored AWS keys)

GitHub's OIDC provider lets the workflow exchange a short-lived token for AWS
credentials. One-time setup:

**a. Create the OIDC identity provider** (skip if your account already has it):

```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com
```

**b. Create the role** with this trust policy (`trust-policy.json`) — it only
trusts this repo's `production` environment:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:Samukelo-Mkhonza/my-profile-website:environment:production"
        }
      }
    }
  ]
}
```

```bash
aws iam create-role --role-name github-actions-portfolio-deploy \
  --assume-role-policy-document file://trust-policy.json
```

**c. Attach the permissions policy** (`permissions-policy.json`) — least
privilege: sync the site bucket and invalidate the distribution, nothing else:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::<WEBSITE_BUCKET>"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::<WEBSITE_BUCKET>/*"
    },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation"],
      "Resource": "arn:aws:cloudfront::<ACCOUNT_ID>:distribution/<DISTRIBUTION_ID>"
    }
  ]
}
```

```bash
aws iam put-role-policy --role-name github-actions-portfolio-deploy \
  --policy-name deploy-portfolio \
  --policy-document file://permissions-policy.json
```

**d.** Put the role ARN into the `AWS_DEPLOY_ROLE_ARN` repository variable.

## 4. The `production` environment

`Settings → Environments → New environment → production`. Optional but
recommended: add yourself as a *required reviewer* so production deploys wait
for a one-click approval, and restrict the environment to the `main` branch.

## 5. GitHub Pages (second deploy target)

The Pages workflow publishes the same site to
**https://samukelo-mkhonza.github.io/my-profile-website/**, alongside the AWS
deploy. One-time setup:

1. **Repo visibility.** GitHub Pages on a *private* repo requires GitHub Pro.
   On the free plan the repo must be **public**. Before flipping it public,
   remember the *entire git history* becomes visible — this repo's history has
   been scanned for AWS keys/tokens (clean; the EmailJS IDs are public by
   design since they ship in the browser bundle anyway), but re-check anything
   you've committed since.
   `Settings → General → Danger Zone → Change visibility → Public`.
2. **Enable Pages from Actions.**
   `Settings → Pages → Build and deployment → Source: "GitHub Actions"`.
3. **Flip the switch.** Add the repository variable `PAGES_ENABLED` = `true`
   (`Settings → Secrets and variables → Actions → Variables`).
4. Trigger it: either push to `main` or run the *Pages* workflow manually from
   the Actions tab.

Notes:
- The Pages build sets `PUBLIC_URL=/my-profile-website` so assets resolve
  under the project subpath. The in-page anchor navigation (`#hero`,
  `#about`, …) is path-independent and works unchanged.
- If you later restrict your EmailJS public key to specific domains, add
  `samukelo-mkhonza.github.io` alongside the CloudFront/custom domain.

## 6. Retiring the old CodePipeline (recommended)

The CloudFormation stack in [`deployment.yml`](../deployment.yml) also deploys
on every push to `main` via a GitHub webhook. Once GitHub Actions deploys are
working, run both in parallel for a deploy or two, then delete the pipeline
pieces so you don't double-deploy (S3 bucket and CloudFront distribution have
`DeletionPolicy: Retain`, but delete the pipeline resources individually if
you want to be extra safe — or simply disable the webhook):

```bash
# Option A: just disconnect the trigger (keeps everything else)
aws codepipeline list-webhooks           # find the webhook name
aws codepipeline deregister-webhook-with-third-party --webhook-name <name>
aws codepipeline delete-webhook --webhook-name <name>

# Option B: delete the whole stack later, once you trust the new pipeline
# (bucket + distribution are retained by policy)
aws cloudformation delete-stack --stack-name portfolio-website
```

## 7. Day-to-day

- **PR to `main`** → CI runs lint + tests + build; merge is safe when green.
- **Push/merge to `main`** → CI, then automatic deploys to every enabled
  target (AWS and/or Pages).
- **Re-deploy without a new commit** → Actions tab → Deploy or Pages →
  *Run workflow*.
- **Rotate EmailJS keys** → update the four secrets, then run manual deploys.
