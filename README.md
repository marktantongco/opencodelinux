# opencodelinux

**The portable, ready-to-run OpenCode ecosystem — 217 AI agent skills, 17 agent profiles, 6 custom MCP servers, and a 78-server curated registry.**

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-success?logo=github)](https://marktantongco.github.io/opencodelinux/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Skills](https://img.shields.io/badge/skills-217-blueviolet)](#skills-overview)
[![MCP Servers](https://img.shields.io/badge/MCP%20servers-78%20curated-blue)](#mcp-stack-recommendations)
[![OpenCode](https://img.shields.io/badge/OpenCode-v3.0-000?logo=openai)](#)

This repository is a **complete, portable OpenCode Linux configuration** — the result of merging and deduplicating three independent OpenCode setups into a single, self-contained ecosystem. Clone it anywhere, and you have an entire AI agent development environment ready to use.

> **Live showcase:** https://marktantongco.github.io/opencodelinux/

---

## Table of Contents

- [Quick Start](#quick-start)
- [What's Inside](#whats-inside)
- [Skills Overview](#skills-overview)
- [Agent Profiles](#agent-profiles)
- [MCP Stack Recommendations](#mcp-stack-recommendations)
- [Custom MCP Servers](#custom-mcp-servers)
- [Repository Structure](#repository-structure)
- [Usage Guide](#usage-guide)
- [Merge & Dedup Strategy](#merge--dedup-strategy)
- [Contributing](#contributing)
- [License](#license)

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/marktantongco/opencodelinux.git
cd opencodelinux

# 2. (Optional) Install MCP server dependencies if you want local MCP servers
cd mcp-servers && for d in */; do (cd "$d" && npm install); done && cd ..

# 3. Point OpenCode to this config
#    Either symlink it or copy opencode.jsonc to your project root
ln -s "$PWD/opencode.jsonc" /path/to/your/project/.opencode.jsonc

# 4. Use the AGENTS.md as your system prompt
#    This is the master system prompt v3.0 (725 lines) with:
#    - Silent Protocol (alignment-first routing)
#    - Quality Gates (verification-before-completion)
#    - Depth-Seeking Mode (first-principles reasoning)
#    - The Compounding System philosophy (NO ONE-OFF WORK)
```

**Prerequisites:** OpenCode CLI, Node.js 18+ (for MCP servers), npm.

---

## What's Inside

This repo is the union of three OpenCode configurations, merged with a capability-first strategy:

| Source | Skills | Contributor |
|--------|--------|-------------|
| `.config/opencode/` | 35 | Operational config — agent profiles, MCP servers, skill registry |
| `.agents/skills/` | 172 | Agent-bundled skills — AI generation, dev tools, infrastructure |
| `opencode-accomplishments/` | ~51 | Showcase — curated skills, MCP registry, stacks, website |

**Total after deduplication: 217 unique skills** (no skill lost — duplicates resolved by richer content wins).

### What you get

| Asset | Count | Description |
|-------|-------|-------------|
| **Skills** | 217 | Standalone skill directories with SKILL.md documentation |
| **Agent profiles** | 17 | Pre-configured agent roles (orchestrator, plan, oracle, council, etc.) |
| **Custom MCP servers** | 6 | TypeScript MCP servers for catalog, registry, search, security, stacks, image gen |
| **MCP registry** | 78 | Curated free MCP servers across 14 categories |
| **MCP stacks** | 8 | Pre-built 4-server stacks with synergy analysis |
| **Workflows** | 4 | Team, quality, org-chart, and revenue workflows |
| **Profiles** | 3 | Thinking profiles for depth, protocol, and routing |
| **Sessions** | 4 | Agent system config, interconnectivity, OAuth, installer |
| **Showcase website** | 2 pages | Skill showcase + accomplishments (auto-deploys to GitHub Pages) |
| **Docs** | 3 | Architecture decisions, skill conventions, superpowers plans |

---

## Skills Overview

All 217 skills — each a self-contained directory with `SKILL.md`. See [SKILLS.md](./SKILLS.md) for the full inventory.

### AI Content Creation (~40 skills)

**Image Generation:** `ai-image-generation`, `flux-image`, `gpt-image`, `nano-banana`, `nano-banana-2`, `p-image`, `qwen-image-2`, `qwen-image-2-pro`, `photography-ai`, `ai-product-photography`, `background-removal`, `image-upscaling`

**Video Generation:** `ai-video-generation`, `ai-avatar-video`, `ai-marketing-videos`, `google-veo`, `happyhorse`, `seedance`, `p-video`, `p-video-avatar`, `image-to-video`, `talking-head-production`, `video-prompting-guide`, `remotion`, `remotion-render`

**Audio & Speech:** `elevenlabs-tts`, `elevenlabs-stt`, `elevenlabs-music`, `elevenlabs-dialogue`, `elevenlabs-dubbing`, `elevenlabs-voice-changer`, `elevenlabs-voice-isolator`, `elevenlabs-sound-effects`, `ai-voice-cloning`, `ai-music-generation`, `ai-podcast-creation`, `text-to-speech`, `speech-to-text`, `dialogue-audio`

**AI Pipelines:** `ai-automation-workflows`, `ai-content-pipeline`, `ai-rag-pipeline`, `ai-social-media-content`

### Development & Engineering (~45 skills)

**Core Dev:** `supabase`, `supabase-postgres-best-practices`, `claude-api`, `mcp-builder`, `python-executor`, `python-sdk`, `javascript-sdk`, `browser-use`, `web-search`

**React & UI Engineering:** `frontend-design`, `design-taste-frontend`, `high-end-visual-design`, `minimalist-ui`, `vercel-react-best-practices`, `vercel-composition-patterns`, `shadcn`, `shadcn-ui`, `react-components`

**Animation:** `gsap-animation-engineer`, `gsap-animations`, `motion-animation-engineer`, `animation-hybrid-architect`

**Quality & Debugging:** `systematic-debugging`, `diagnose`, `verification-before-completion`, `webapp-testing`

### Workflow & Process (~30 skills)

**Planning:** `brainstorming`, `writing-plans`, `executing-plans`, `prototype`, `grill-me`, `grill-with-docs`, `devils-advocate`

**Execution:** `chain-of-thought`, `subagent-driven-development`, `tdd`, `test-driven-development`, `dispatching-parallel-agents`, `using-git-worktrees`

**Review & Complete:** `requesting-code-review`, `receiving-code-review`, `finishing-a-development-branch`, `zoom-out`, `simplify`, `improve-codebase-architecture`

### UI & Design (~25 skills)

`app-store-screenshots`, `book-cover-design`, `brand-guidelines`, `canvas-design`, `critique`, `data-visualization`, `email-design`, `enhance-prompt`, `landing-page-design`, `logo-design-guide`, `og-image-design`, `pitch-deck-visuals`, `polish`, `product-photography`, `social-media-carousel`, `stitch-design`, `stitch-loop`, `taste-design`, `theme-factory`, `ui-ux-pro-max-v7`, `youtube-thumbnail-design`, `impeccable`

### Marketing & Communications (~15 skills)

`case-study-writing`, `content-repurposing`, `explainer-video-guide`, `internal-comms`, `linkedin-content`, `newsletter-curation`, `press-release-writing`, `product-changelog`, `product-hunt-launch`, `seo-content-brief`, `seo-content-writer`, `seo-audit`, `technical-blog-writing`, `twitter-thread-creation`, `social-content-pillars`

### Research & Knowledge (~15 skills)

`code-research`, `explore`, `feature-research`, `web-reader`, `clonedeps`, `codemap`, `competitor-teardown`, `customer-persona`, `jtbd-research`, `ai-rag-pipeline`, `web-search`, `triage`, `to-issues`, `to-prd`

### Meta & System (~20 skills)

`context-compressor`, `persistent-memory`, `persistent-memory-manager`, `skill-creator`, `skill-finder`, `skills-cli`, `find-skills`, `related-skill`, `write-a-skill`, `writing-skills`, `template-skill`

### Universal Router Subsystem

Four skills form a coherent routing system for agent mode selection: `universal-agentic`, `universal-code`, `universal-design`, `universal-system`.

### Infrastructure & DevOps (~10 skills)

`building-inferencesh-apps`, `infsh-cli`, `agent-tools`, `llm-models`, `deploy`, `deployment-manager`, `github-actions-docs`, `secure-linux-web-hosting`, `openclaw-secure-linux-cloud`, `platform-guides`

---

## Agent Profiles

17 pre-configured agent profiles that can be used with OpenCode. Each has a specific role, model assignment, and permission model.

| Agent | Role | Model | Mode |
|-------|------|-------|------|
| **orchestrator** | Multi-agent task coordinator | DeepSeek V4 Flash | Primary |
| **blueprint** | Strategic planning & architecture | Nemotron 3 Super | Primary |
| **explorer** | Codebase search & pattern discovery | DeepSeek V4 Flash | Subagent |
| **librarian** | Documentation & API reference | DeepSeek V4 Flash | Subagent |
| **oracle** | Strategic technical advisor | Claude Opus 4.7 | Subagent |
| **oracle-lite** | Lightweight oracle (fallback) | Qwen 3.6 Plus | Subagent |
| **designer** | UI/UX design specialist | GPT 5.5 | Subagent |
| **designer-lite** | Lightweight designer (fallback) | Qwen 3.6 Plus | Subagent |
| **fixer** | Code refinement & optimization | DeepSeek V4 Flash | Subagent |
| **observer** | System monitoring & reporting | GPT 5.5 | Subagent |
| **observer-lite** | Lightweight observer (fallback) | Qwen 3.6 Plus | Subagent |
| **council** | Multi-perspective deliberation | Claude Sonnet 4.6 | Subagent |
| **council-lite** | Lightweight council (fallback) | Qwen 3.6 Plus | Subagent |
| **brainstorming** | Creative ideation | DeepSeek V4 Flash | Subagent |
| **researcher** | Web research & analysis | DeepSeek V4 Flash | Subagent |
| **compaction** | Context compression | DeepSeek V4 Flash | Subagent |
| **plan** | Plan grammar enforcement | DeepSeek V4 Flash | Subagent |

Agents are defined in `agents/` (markdown prompts) and configured in `opencode.jsonc`.

---

## MCP Stack Recommendations

From [stacks.json](./stacks.json) — 8 pre-built 4-server stacks optimized for specific workflows, with synergy analysis for each combination.

| Stack | Servers | Best For |
|-------|---------|----------|
| **Creative Studio** | PictoFlux + Figma + Filesystem + Memory | Design agencies, content creators |
| **Research Engine** | Brave Search + Web Fetch + Arxiv + Memory | Deep research, competitive analysis |
| **Full-Stack Dev** | GitHub + Postgres + Filesystem + Sequential Thinking | Application developers |
| **Agent OS** | Memory + Sequential Thinking + Filesystem + Brave Search | Autonomous agent workflows |
| **Product Launch** | Brave Search + PictoFlux + GitHub + Memory | Founders, product teams |
| **DevOps** | GitHub + Docker + Filesystem + Memory | Infrastructure engineers |
| **Writing Suite** | Brave Search + Filesystem + Memory + Sequential Thinking | Technical writers, content teams |
| **Data Analyst** | Postgres + Filesystem + Memory + Brave Search | Data scientists, analysts |

The full [mcp-registry.json](./mcp-registry.json) catalogs **78 free MCP servers** across 14 categories (Browser Automation, Cloud Platforms, Communication, Data & Analytics, Database, Developer Tools, Knowledge & Memory, Maps & Location, Media, Search, Security, Monitoring & Observability, and more).

---

## Custom MCP Servers

Six custom TypeScript MCP servers included in `mcp-servers/`:

| Server | Description | Entry Point |
|--------|-------------|-------------|
| **mcp-catalog** | MCP server registry catalog — search, browse, and discover MCP servers | `node ./mcp-servers/mcp-catalog/dist/index.js` |
| **mcp-registry** | MCP server registry management — CRUD operations for server entries | `node ./mcp-servers/mcp-registry/dist/index.js` |
| **mcp-search** | Web search via DuckDuckGo — returns titles, URLs, snippets | `node ./mcp-servers/mcp-search/dist/index.js` |
| **mcp-security-scanner** | Code security scanning — secrets, vulnerabilities, misconfigurations | `node ./mcp-servers/mcp-security-scanner/dist/index.js` |
| **mcp-stack-curator** | MCP server stack curation — build, validate, and recommend server stacks | `node ./mcp-servers/mcp-stack-curator/dist/index.js` |
| **pictoflux-ai** | AI image generation and editing — Pollinations.ai + inference.sh | `node ./mcp-servers/pictoflux-ai/dist/index.js` |

All servers are pre-built (`dist/`) and ready to run. To rebuild: `cd mcp-servers/<name> && npm run build`.

---

## Repository Structure

```
opencodelinux/
├── AGENTS.md                # Master system prompt v3.0 — 725 lines
├── opencode.jsonc           # OpenCode configuration (agents, MCP, plugins, providers)
├── SKILLS.md                # Full merged skill inventory (217 skills categorized)
├── PLUGINS.md               # Terminal & dev plugin installation guide
├── mcp-registry.json        # 78 free MCP servers across 14 categories
├── stacks.json              # 8 pre-built MCP stacks with synergy analysis
├── skill-registry.json      # Canonical skill registry with categories & descriptions
├── package.json             # Root package with utility scripts
│
├── skills/                  # 217 deduplicated skill directories
│   ├── <skill-name>/
│   │   ├── SKILL.md         # Skill documentation & instructions
│   │   └── references/      # Optional: examples, guides, resources
│   └── ...
│
├── agents/                  # 17 agent profile markdown configs
│   ├── orchestrator.md
│   ├── blueprint.md
│   ├── oracle.md
│   └── ...
│
├── mcp-servers/             # 6 custom TypeScript MCP servers (pre-built)
│   ├── mcp-catalog/
│   ├── mcp-search/
│   ├── mcp-security-scanner/
│   ├── mcp-registry/
│   ├── mcp-stack-curator/
│   └── pictoflux-ai/
│
├── profiles/                # Agent thinking profiles
├── workflows/               # Workflow definitions (team, quality, revenue)
├── sessions/                # Session configurations
├── docs/                    # Architecture & convention documentation
├── scripts/                 # Utility scripts (skill scanning, resolution)
│
├── index.html               # Skills showcase website (standalone)
├── accomplishments.html     # Accomplishments page (standalone)
├── vercel.json              # Vercel deployment config
└── .github/workflows/       # GitHub Actions deploy to Pages
```

---

## Usage Guide

### Using a skill in OpenCode

Skills are loaded on-demand in OpenCode. To use a skill:

1. Browse `skills/` or [SKILLS.md](./SKILLS.md) to find what you need
2. Reference the skill by name — OpenCode's skill loader finds it automatically
3. The `SKILL.md` in each skill directory contains the full instructions

### Using MCP servers

The MCP servers are pre-configured in `opencode.jsonc` with relative paths:

```jsonc
{
  "mcp": {
    "mcp-search": {
      "type": "local",
      "command": ["node", "./mcp-servers/mcp-search/dist/index.js"],
      "enabled": true
    },
    "pictoflux-ai": {
      "type": "local",
      "command": ["node", "./mcp-servers/pictoflux-ai/dist/index.js"],
      "enabled": true
    }
    // ... 4 more servers
  }
}
```

To enable a server, set `"enabled": true`. To disable, set `"enabled": false`.

### Adding a new skill

1. Create a directory in `skills/<skill-name>/`
2. Write a `SKILL.md` with sections: context, instructions, constraints, examples
3. Update `skill-registry.json` with the new entry
4. Submit a PR

### Customizing the config

Edit `opencode.jsonc` to:
- Add new MCP servers (remote or local)
- Change agent models or permissions
- Add/remove plugins
- Change default agents

---

## Merge & Dedup Strategy

This repository was created by merging three independent OpenCode setups. The merge followed these rules:

1. **Capability-first**: Every skill from all sources is preserved — zero deletions
2. **Deduplication by version**: When the same skill name existed in multiple sources, the version with the larger `SKILL.md` file wins (indicating richer content / more recent version)
3. **Priority tiebreaker**: For same-size skills, priority is `agents > config > showcase` (agent-bundled skills are actively maintained)
4. **Manual overrides**: Two skills force the showcase version despite smaller size — `vercel-react-best-practices` and `web-design-guidelines` (the showcase versions are known to contain richer content)
5. **Philosophy merge**: The AGENTS.md combines the local v3.0 system prompt (Silent Protocol, Quality Gates, Depth-Seeking) with the showcase's "NO ONE-OFF WORK / Compounding System" philosophy — both operate without conflict
6. **Portable paths**: All MCP server command paths in `opencode.jsonc` use relative paths (`./mcp-servers/...`) instead of absolute paths

### What was deduplicated

| Skill | Sources | Winner | Reason |
|-------|---------|--------|--------|
| `mcp-builder` | agents + config | agents | Larger SKILL.md |
| `vercel-react-best-practices` | config + showcase | showcase | Manual override |
| `web-design-guidelines` | config + showcase | showcase | Manual override |

---

## Contributing

Contributions are welcome! This repo is designed to be a community resource for OpenCode users.

### How to contribute

1. **Fix a skill**: Found a bug or outdated info in a `SKILL.md`? Submit a PR.
2. **Add a skill**: Have a useful agent skill? Add it under `skills/<name>/SKILL.md`.
3. **Add an MCP server**: Built a useful MCP server? Add it to `mcp-servers/` and update `opencode.jsonc`.
4. **Curate the registry**: Found a great MCP server not in `mcp-registry.json`? Add it.
5. **Improve docs**: README, SKILLS.md, or workflow docs improvements are always appreciated.

### Guidelines

- Skills should be MECE (Mutually Exclusive, Collectively Exhaustive) — no overlap, no gaps
- Each skill needs a clear trigger context in its `SKILL.md`
- MCP servers must be self-contained with `package.json`, `tsconfig.json`, and `src/index.ts`
- Test builds before submitting: `cd mcp-servers/<name> && npm run build`

---

## License

MIT — free to use, modify, and distribute. See [LICENSE](LICENSE) for details.

---

**Built from:** `.config/opencode/` + `.agents/skills/` + `opencode-accomplishments/`  
**Last updated:** 2026-05-25
