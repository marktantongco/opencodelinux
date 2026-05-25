---
name: fullstack-pro
description: Advanced meta-skill with transitive dependencies
depends-on:
  - fullstack-dev
  - deploy
  - diagnose
expects:
  - key: environment
    type: string
    description: Target environment
    default: staging
  - key: auto_rollback
    type: boolean
    description: Rollback on failure
    default: true
provides:
  - key: health_report
    type: string
    description: Post-deploy health check report
  - key: deploy_url
    type: url
    description: Production deployment URL
---

# fullstack-pro

Advanced meta-skill that extends fullstack-dev with deploy and diagnose capabilities.
