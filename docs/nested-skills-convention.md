# Nested Skills Convention

> **Full documentation:** See [`.config/opencode/README.md`](../README.md) for the complete reference including scanner, resolver, dependencies, I/O contracts, and registry format.
>
> This file covers the **variant naming convention** only.

## Overview

Skills can be organized hierarchically using a **variant naming convention**. This allows related skills to share a namespace without requiring deep subdirectory nesting.

## The `SKILL-<name>.md` Pattern

Instead of creating subdirectories for every related sub-skill, use a single directory with multiple files:

```
skills/auth/
  SKILL.md           ← main "auth" skill
  SKILL-oauth.md     ← "auth.oauth" variant
  SKILL-jwt.md       ← "auth.jwt" variant
  SKILL-session.md   ← "auth.session" variant
```

The system derives the name from the file path:
- `SKILL.md` → parent name (directory name)
- `SKILL-<name>.md` → `parent.<name>` (dot-separated)

## Subdirectory Nesting

For more complex hierarchies, use subdirectories:

```
skills/deploy/
  SKILL.md               ← "deploy" (orchestrator)
  static/
    SKILL.md             ← "deploy.static" (sub-orchestrator)
    SKILL-github-pages.md ← "deploy.static.github-pages"
    SKILL-vercel.md      ← "deploy.static.vercel"
```

## Name Derivation Priority

1. **Frontmatter `name:` field** — explicit, highest priority. Overrides everything.
2. **Path-derived from `SKILL-<name>.md`** — filename suffix becomes the variant name.
3. **Path-derived from subdirectory** — subdirectory path joined with dots.

## Frontmatter Override Example

```markdown
---
name: deploy.static.github-pages
description: Deploy a static site to GitHub Pages
---
```

## Collision Rules

| Condition | Behavior |
|-----------|----------|
| Two files produce same dot-path in same parent | **Error** — must be unique |
| Same dot-path from different parent trees | **Valid** — full path disambiguates |
| Frontmatter name matches existing entry | **Valid** — frontmatter wins |

## Variants vs. Subdirectories

| Pattern | Best For |
|---------|----------|
| `SKILL-<name>.md` (variant) | Small sub-functions sharing parent context (3-5 variants) |
| `subdir/SKILL.md` (sub-skill) | Complex sub-skills needing their own reference material |
| `subdir/SKILL-<name>.md` (both) | Deep hierarchies with layered orchestration |

## Running the Scanner

After creating or modifying variant files, update the registry:

```bash
# From /home/x1/.config/opencode

# Dry run (see what would change)
node scripts/scan-nested-skills.js --dry-run

# Apply changes
node scripts/scan-nested-skills.js

# Or via npm
npm run skills:scan:dry
npm run skills:scan
```

## Registry Entries

Nested skills inherit their parent's category and triggers by default. Manual entries in `skill-registry.json` always take precedence over auto-detected values.

## Example: Auth Skill Variants

```
/home/x1/.agents/skills/auth/
├── SKILL.md           → "auth"
├── SKILL-oauth.md     → "auth.oauth" (OAuth 2.0 / OIDC flows)
├── SKILL-jwt.md       → "auth.jwt" (JWT creation and validation)
└── SKILL-session.md   → "auth.session" (session management)
```

Each variant is independently loadable:
- `@auth` loads the parent (general auth guidance)
- `@auth.jwt` loads only the JWT-specific instructions
- `@auth.oauth` loads only the OAuth-specific instructions

## Example: Deploy Skill Variants

```
/home/x1/.agents/skills/deploy/
├── SKILL.md           → "deploy" (orchestrator)
├── SKILL-init.md      → "deploy.init" (initialize deployment config)
├── SKILL-status.md    → "deploy.status" (check deployment status)
└── SKILL-rollback.md  → "deploy.rollback" (rollback deployment)
```

## Benefits Over Flat Structure

- **Discoverability**: Related skills grouped in one directory
- **Composability**: Parent can orchestrate, children handle specifics
- **Progressive disclosure**: Start with the parent, drill into variants as needed
- **No naming collisions**: Dot-path ensures uniqueness
- **Migration friendly**: Existing skills unchanged, new variants add on
