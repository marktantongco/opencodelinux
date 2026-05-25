---
name: deploy.status
description: Check deployment status — read deploy config, fetch current deployment state, and report. Use when checking if a deployment is live or verifying deployment health.

expects:
- key: deployment_id
  type: string
  description: ID of the deployment to check
provides:
- key: status
  type: string
  description: Current deployment status and details
- key: history
  type: array
  description: Recent deployment history
---

# Deploy: Status

Check the current deployment status.

## Tasks

1. Read `.deploy/config.yml` to identify platform
2. Fetch latest deployment state from platform
3. Report: deploy URL, build status, last updated timestamp
4. Alert on failures or expired deployments

## Status Report Template

```
Deployment Status
─────────────────
Platform:   {platform}
URL:        {deploy_url}
Status:     {building | live | failed}
Updated:    {timestamp}
Build:      {commit_sha} ({branch})
```
