---
name: deploy.rollback
description: Rollback a deployment to a previous version — list recent deployments, select target, execute rollback, verify. Use when a deployment needs to be reverted.

expects:
- key: deployment_id
  type: string
  description: ID of the deployment to rollback
- key: version
  type: string
  description: Target version to rollback to
provides:
- key: status
  type: string
  description: Rollback operation status
---

# Deploy: Rollback

Rollback a deployment to a previous version.

## Tasks

1. Read `.deploy/config.yml` for platform context
2. List recent N deployments
3. Prompt user to select target version
4. Execute rollback
5. Verify rollback succeeded
6. Confirm with user

## Rollback Checklist

- [ ] Confirm which version to rollback to
- [ ] Check if rollback affects database migrations
- [ ] Verify rollback completes successfully
- [ ] Confirm site is serving expected content
- [ ] Notify team if production deployment
