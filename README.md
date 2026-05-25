# opencodelinux

**Unified OpenCode System — 217 AI Agent Skills + 17 Agent Configs + 9 MCP Servers + 78-Server Registry + 8 Pre-Built MCP Stacks**

The complete, portable OpenCode Linux configuration — merged and deduplicated from three sources:

| Source | Skills | Content |
|--------|--------|---------|
| `.config/opencode/` | 35 | Operational config, agent profiles, MCP servers, skill registry |
| `.agents/skills/` | 172 | Agent-bundled inference.sh, content creation, dev tool skills |
| `opencode-accomplishments/` | ~51 | Showcase skills, MCP registry, stacks, profiles, workflows |

---

## Quick Start

```bash
# Clone
git clone https://github.com/marktantongco/opencodelinux.git
cd opencodelinux

# The AGENTS.md is your system prompt
# The opencode.jsonc is your config
# Skills live in skills/
```

---

## Repository Structure

```
opencodelinux/
├── AGENTS.md                # Master system prompt v3.0 (725 lines)
├── opencode.jsonc           # OpenCode configuration (agents, MCP, plugins)
├── skill-registry.json      # Canonical skill registry with categories
├── mcp-registry.json        # 78 free MCP servers across 14 categories
├── stacks.json              # 8 pre-built MCP stacks with synergy analysis
├── PLUGINS.md               # Terminal & dev plugin installation guide
├── SKILLS.md                # Full merged skill inventory
│
├── skills/                  # 217 deduplicated skills
│   ├── <skill-name>/SKILL.md
│   └── ...
│
├── agents/                  # 17 agent profile configs
├── profiles/                # Agent thinking profiles
├── sessions/                # Session configurations
├── workflows/               # Workflow definitions
├── mcp-servers/             # Custom MCP server implementations
├── docs/                    # Architecture and convention docs
├── scripts/                 # Utility scripts
│
├── index.html               # Skills showcase website (standalone)
├── accomplishments.html     # Accomplishments page (standalone)
├── vercel.json              # Vercel deployment config
└── .github/workflows/       # GitHub Actions deployment
```

---

## Skills Overview

**217 unique skills** across these domains:

| Category | Count | Examples |
|----------|-------|----------|
| **AI Content** | ~40 | ai-image-generation, ai-video-generation, ai-voice-cloning, flux-image, elevenlabs-* |
| **Dev Engineering** | ~45 | supabase, browser-use, claude-api, mcp-builder, deployment-manager |
| **UI & Design** | ~25 | frontend-design, ui-ux-pro-max-v7, gsap-animations, animation-hybrid-architect |
| **Workflow & Process** | ~30 | chain-of-thought, superpowers, diagnose, tdd, systematic-debugging |
| **Marketing & Comms** | ~15 | case-study-writing, seo-content-writer, social-media-manager, linkedin-content |
| **Research & Knowledge** | ~15 | web-search, code-research, explore, ai-rag-pipeline, feature-research |
| **Meta & System** | ~20 | context-compressor, persistent-memory, skill-finder, zoom-out |
| **Infrastructure** | ~10 | building-inferencesh-apps, secure-linux-web-hosting, deploy |
| **Specialized** | ~17 | auth (jwt/oauth/session), universal-{agentic,code,design,system}, humanizer |

---

## MCP Stack Recommendations

From `stacks.json` — 8 pre-built 4-server stacks:

| Stack | Servers | Best For |
|-------|---------|----------|
| **Creative Studio** | PictoFlux + Figma + Filesystem + Memory | Design agencies |
| **Research Engine** | Brave Search + Fetch + Arxiv + Memory | Deep research |
| **Full-Stack Dev** | GitHub + Postgres + Filesystem + Sequential Thinking | Developers |
| **Agent OS** | Memory + Sequential Thinking + Filesystem + Brave Search | Autonomous agents |
| **Product Launch** | Brave Search + PictoFlux + GitHub + Memory | Founders |

---

## Merge Rules Applied

1. **Capability-first**: All 217 skills from all sources kept — no deletions
2. **Deduplication by version**: Same-named skills compared by size, larger wins
3. **Priority tiers**: agents > config > showcase for same-size ties
4. **Manual overrides**: `vercel-react-best-practices` and `web-design-guidelines` take showcase versions (richer content)
5. **Philosophy merge**: Local AGENTS.md v3.0 as base + showcase "NO ONE-OFF WORK" principles appended

---

## License

MIT
