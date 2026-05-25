---
name: deploy
description: Deployment orchestrator. Manages deployment init, status checks, and rollbacks across platforms. Routes to platform-specific sub-skills based on project config.

expects:
- key: config
  type: string
  description: Configuration or settings to apply
- key: environment
  type: string
  description: Target environment
  default: production
provides:
- key: status
  type: string
  description: Operation status or result
- key: deployment_url
  type: url
  description: URL of the deployed resource
---

# Deploy

Deployment management for your project. This is the parent orchestrator — it dispatches to sub-skills based on what you need.

## Usage

- `@deploy.init` — Set up deployment configuration for a new project
- `@deploy.status` — Check current deployment status
- `@deploy.rollback` — Rollback to a previous deployment

Invoked directly:
```
User: "Initialize deploy config"
System: → @deploy.init

User: "Check my deploy status"
System: → @deploy.status

User: "Rollback the last deploy"
System: → @deploy.rollback
```
