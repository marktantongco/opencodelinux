# Session: Agent System Configuration

**Date:** 2026-05-21
**Status:** SAVED — current system snapshot

## Files Modified

| File | Change |
|------|--------|
| `agents/plan.md` | **Created** — plan grammar, constraints, lifecycle, validation |
| `agents/blueprint.md` | **Updated** — added plan constraint enforcement (3-gate system), @plan delegation |
| `opencode.jsonc` | **Updated** — registered `plan` subagent in agent list |
| `AGENTS_HIERARCHY.md` | **Updated** — added plan to hierarchy diagram, routing table, quick reference; fixed ASCII art |
| `agent-system.svg` | **Added** — rendered Graphviz architecture diagram (24KB) |

## System Architecture Summary

```
          Incoming Work
               │
          Dispatcher/Router
          ┌─────┴─────┐
     Orchestrator   Blueprint
     (execution)    (planning)
          │              │
     ┌────┼────┐    ┌────┼──────┐
     │    │    │    │    │      │
  Explorer  Fixer   Oracle  Council
  Librarian  ...   Brainstorming
                    Researcher
                       Plan
          └──────────────┘
          Approved Plan → Orchestrator
```

## Agents (13 total)

### Primaries (2)
- **orchestrator** — deepseek-v4, execution & general work
- **blueprint** — nemotron-3-sf, planning & strategy (constrained by @plan grammar)

### Core Subagents (7)
- explorer, librarian, fixer, researcher, brainstorming, plan, compaction — all deepseek-v4

### Premium Subagents (4 with -lite fallbacks)
- oracle (opus-4.7 → qwen3.6), designer (gpt-5.5 → qwen3.6)
- observer (gpt-5.5 → qwen3.6), council (sonnet-4.6 → qwen3.6)

## Key Features

- **Plan grammar**: 7-section required structure with 7 hard constraints
- **3-gate validation**: Self-check → Hard audit → @plan delegation
- **Fallback chain**: Premium → -lite (qwen3.6 via 9router)
- **MCPs enabled**: context7, sequential-thinking, memory, podman, mcp-search, pictoflux-ai, mcp-catalog, mcp-security-scanner

## Diagram Rendered

`agent-system.svg` — full architecture diagram with all agents, delegation paths, and fallback chains.
