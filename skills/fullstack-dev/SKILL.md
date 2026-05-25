---
name: fullstack-dev
description: Meta-skill activating frontend-design, supabase, and deployment-manager
depends-on:
  - frontend-design
  - supabase
  - deployment-manager
expects:
  - key: framework
    type: string
    description: Frontend framework to use
    default: next
  - key: database
    type: string
    description: Database provider (e.g. postgres, sqlite)
provides:
  - key: deploy_url
    type: url
    description: Deployment URL after build
instructions: false
---

# fullstack-dev

Meta-skill that activates three core development skills together.

When invoked, the following sub-skills are available:
- `@frontend-design` — Component and UI design
- `@supabase` — Backend, auth, and database
- `@deployment-manager` — CI/CD and deployment

Each sub-skill should be invoked individually by the user or orchestrator.
