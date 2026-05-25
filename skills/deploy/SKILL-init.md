---
name: deploy.init
description: Initialize deployment configuration — scaffold deploy configs, CI/CD templates, and platform-specific setup files. Use when setting up a new deployment pipeline for a project.

expects:
- key: project_path
  type: path
  description: Path to the project to deploy
- key: platform
  type: string
  description: Deployment platform
  default: auto
provides:
- key: deploy_config
  type: path
  description: Generated deployment configuration path
---

# Deploy: Init

Initialize deployment configuration for a project.

## Tasks

1. Identify target platform: static hosting, serverless, or container
2. Create `.deploy/config.yml` with platform, build command, publish directory
3. Scaffold CI/CD workflow file if applicable
4. Verify configuration is valid

## config.yml Template

```yaml
platform: github-pages     # or: vercel, netlify, docker
build_command: npm run build
publish_dir: dist/
branch: main
environment: production
```

## Platform Detection

| If project has...            | Likely platform |
|------------------------------|-----------------|
| `next.config.js` / `next.config.ts` | Vercel |
| `netlify.toml`              | Netlify |
| `Dockerfile`                | Docker / container |
| Static HTML / docs folder   | GitHub Pages |
| `amplify.yml`               | AWS Amplify |
