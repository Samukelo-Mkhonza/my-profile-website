# Backend-Dependent Features — Status & Plan

This site is **static-only** (GitHub Pages + S3/CloudFront). Several requested
features need server-side code, secrets, or both. Per the project guardrails —
*never fake live data* and *warn before provisioning anything with a standing
monthly cost* — these are **deliberately not shipped** yet. No dead UI was
added; each feature below turns on only once its backend exists.

## What's blocked and why

| Feature | Blocker | Standing cost if built |
|---|---|---|
| AI chatbot (Bedrock + RAG) | Needs an AWS API + Bedrock access; no AWS credentials were available in this session | Lambda/API Gateway ~free at portfolio traffic; Bedrock is per-token (pennies at low volume) |
| Live status/metrics panel | Needs `/status` + `/metrics` endpoints reading CloudWatch; real data only | CloudWatch API calls — negligible, but non-zero |
| Spotify now-playing | Needs `CLIENT_ID` / `CLIENT_SECRET` / `REFRESH_TOKEN` kept **server-side** (a static bundle would leak them) | Effectively zero on Lambda |
| Live project demo (4.4) | Needs a decision: **which** project to embed, and whether it can run client-side. The code playground (`#/playground`) already demonstrates sandboxed client-side execution | Depends on the project |

## Recommended architecture (when ready)

One minimal, Terraform-managed HTTP API — **do not migrate the site**:

```
Browser (static site)
   │  HTTPS (CORS locked to the two site origins)
   ▼
API Gateway HTTP API  ──►  Lambda (Node 20)
   /chat        → Bedrock (Claude) + RAG over src/content/ (streamed, per-IP rate limit)
   /now-playing → Spotify Web API (refresh token from SSM SecureString)
   /status      → uptime/region/latency snapshot
   /metrics     → CloudWatch queries (p50/p95, request count, MTD cost via Cost Explorer)
```

Ground rules already agreed:
- IaC only (Terraform), tagged `project=personal-site`, least-privilege IAM,
  `af-south-1` primary.
- Secrets in SSM Parameter Store / Secrets Manager — never in the repo or the
  JS bundle.
- `terraform plan` reviewed before any `apply`; `terraform destroy` must tear
  everything down cleanly.
- Frontend integration goes behind `REACT_APP_API_BASE_URL`; components render
  nothing when it is unset, so the static site never shows placeholder data.

## What already works without a backend

- **Build-in-public feed** (`#/changelog`) — real commit history via the
  public GitHub API.
- **Projects** — already live from the GitHub API.
- **Code playground** (`#/playground`) — fully client-side, sandboxed iframe
  (`sandbox="allow-scripts"` + `default-src 'none'` CSP, watchdog timeout).
  A server-side `/run` endpoint was considered and rejected as an unnecessary
  attack surface.

## Next step when you want these

Provide AWS credentials (or run locally with your profile) and the Spotify
secrets in a secrets store, confirm the ~$0–2/month standing cost, and the
API can be built feature-by-feature in the order: status/metrics → Spotify →
chatbot.
