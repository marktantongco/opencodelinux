# OpenCode Atlas — Design Specification

**Date:** 2026-05-22
**Status:** Approved Design — Ready for Implementation
**Audience:** Both (product teams + developers), tiered experience
**Platform:** Static Site + API Layer (Next.js ISR + separate API for news)

---

## 1. Architecture Overview

### Tech Stack
| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 15 | ISR, API routes, App Router |
| 3D | React Three Fiber (R3F) | Agent cosmos visualization |
| Motion | GSAP ScrollTrigger + Framer Motion | Cinematic animations, page transitions |
| Styling | Tailwind CSS v4 | Utility-first CSS, responsive |
| Content | MDX + next-mdx-remote | Wiki pages versioned in git |
| Search | Pagefind (build-time) or Fuse.js (client) | Full-text search |
| News API | Next.js API routes + Vercel Cron | Realtime AI news scraper |
| Deploy | Vercel | ISR cache, edge distribution |
| Sources | Tavily Search + Exa Search (via inference.sh MCPs) | AI news aggregation |

### Site Structure
```
/                          ← Immersive 3D landing (agent cosmos)
├── /playbook              ← OpenCode methodology & patterns
│   ├── /routing-logic
│   ├── /plan-grammar
│   ├── /fallback-chains
│   ├── /secret-sauce      ← Design philosophy
│   └── /best-practices    ← Verified patterns
├── /agents                ← Agent directory
│   └── /[name]            ← Individual agent detail pages
├── /skills                ← Skill registry
├── /system                ← System internals
│   ├── /agents-hierarchy
│   ├── /prompts-atlas
│   └── /mcp-catalog
├── /highlights            ← Visual showcase
├── /news                  ← Realtime AI news feed
└── /cta                   ← Call-to-action hub
```

### Content Directory Structure
```
content/
├── agents/                ← One MDX file per agent (17+)
├── playbook/              ← Methodology, patterns, philosophy
├── skills/                ← Skill registry entries
├── system/                ← Config reference, hierarchy, MCPs
├── highlights/            ← Showcase content
└── news/                  ← Cached news data
```

### Three-Tier Page Architecture
Every page serves three audiences on one URL:
- **Tier 1 (Overview)** — 2-3 paragraphs for product teams
- **Tier 2 (Reference)** — Details for practitioners
- **Tier 3 (Source)** — Links to actual config files for builders

### MDX Frontmatter Schema
```yaml
---
title: Blueprint (Primary Planner)
role: Strategic architect. Defines plans, enforces grammar, validates.
tier: primary
fallback: oracle-lite
consumes: [user-requests, brainstorming-output]
produces: [plans, architectures, design-specs]
dependencies: [orchestrator, plan]
related_skills: [writing-plans, brainstorming]
---
```

---

## 2. 3D Agent Cosmos (Showroom)

### Concept
Interactive 3D node graph where agents are celestial bodies. Hierarchy is spatial:
- **Center (x:0, y:0, z:0):** blueprint, orchestrator (twin primaries)
- **Inner orbit:** plan, explore, fixer, researcher, designer, oracle
- **Outer orbit:** council, librarian, observer, brainstorming, general
- **Dim adjacent nodes:** -lite fallback agents
- **Periphery:** Skills as star clusters

### Visual Design
- Deep space background with particle field
- Agents = glowing spheres with orbital rings
- Color-coded by role: primary (purple), subagent (green), specialist (amber)
- Pulse animations on interaction
- Connection lines glow when hovered

### Interaction Model
- OrbitControls — drag to rotate
- Scroll to zoom
- Click agent → camera fly-to → detail card overlay
- Card shows: name, role, prompt summary, link to wiki page
- Search filters visible nodes
- Perspective toggle: "Hierarchy View" vs "Free Explore"

### Landing Page Scene Sequence (GSAP-timed)
1. Fade from black — particles appear
2. Nodes materialize staggered by hierarchy level
3. Connection lines draw themselves
4. Agent labels float beside nodes
5. User can interact freely

---

## 3. Navigation & User Journey

### Dual Navigation Modes

**Guided Tour** (8 cinematic scroll chapters):
1. **Hero** — 3D cosmos landing, camera orbit
2. **What is OpenCode?** — animated explainer
3. **Agent Hierarchy** — 3D interaction zone
4. **Skills Showcase** — visual card grid
5. **Secret Sauce** — design philosophy
6. **Best Practices** — proven patterns
7. **Live News** — AI developments ticker
8. **CTA** — try/build/contribute

**Explorer Mode:**
- Left sidebar with full content tree
- Breadcrumb trail on every page
- Quick jump (⌘K) — search agents, skills, concepts
- Related links at page bottom
- Backlinks — "This agent is used by..."
- "View source" links to actual config files
- Version history on content blocks

### Page Transitions
- **Between pages:** GSAP Flip — current page scales down, new page slides up
- **Agent to agent:** Camera flies through 3D space between node positions
- **Section scroll:** Snap-scroll for guided tour, free scroll for deep content

### Persistent Header
```
◈ OpenCode Atlas | Cosmos · Playbook · Agents · Skills · System · News | Search ⌘K
```

---

## 4. Content Structure

### Agent Page Layout
```
┌──────────────────────────────────┬──────────────────┐
│ Agent Name & Role                │ Quick Facts      │
│ (Tier 1: Overview)               │ Tier · Consumes  │
│                                  │ Produces · Skills│
│ (Tier 2: Reference)              ├──────────────────┤
│                                  │ Diagram          │
│ (Tier 3: Source)                 │ [Flow chart]     │
│ → Link to prompt file            │                  │
│                                  │ Related Agents   │
│ Related: orchestrator · plan     │ Related Skills   │
└──────────────────────────────────┴──────────────────┘
```

### Cross-Reference System
- **Related agents** — from `dependencies` frontmatter
- **Related skills** — from `related_skills` frontmatter
- **Backlinks** — auto-generated at build
- **Flow pipeline** — "consumes → agent → produces" mini visualization

---

## 5. Realtime AI News Scraper

### Data Flow
```
Vercel Cron (every 30min)
  → /api/news/fetch
    → Tavily Search + Exa Search queries AI news
      → Deduplicate & rank by relevance
        → Cache via ISR (stale-while-revalidate)
          → /news page renders static, updates on revalidation
```

### Sources
- Hacker News, TechCrunch, ArXiv, The Verge
- Company blogs (Anthropic, OpenAI, Google, Meta)
- Queries: "AI agent development", "LLM release", "agent framework"

### Fallback Chain
1. Serve ISR cached news (with "updated X min ago" banner)
2. If cache empty + fetch fails → curated placeholder
3. If no new results → keep previous batch
4. Never show blank/empty state

### Surface Integration
- **Landing page:** Horizontal scrolling ticker — top 5 stories, auto-scroll every 8s, pause on hover
- **/news page:** Full feed with cards, filters, relevance tags

---

## 6. Secret Sauce & Unique Proposition

### Five Pillars
1. **The Living Diagram** — 3D cosmos IS the navigation, not decoration
2. **Dual-Audience, Same URL** — Three scroll tiers on every page
3. **Live + Static, No Tradeoff** — ISR speed with background-refreshed news
4. **Config Is Content** — Every page links to real prompt files
5. **Cinematic Browsing** — GSAP kinetic typography makes config pages feel alive

### UVP
> "The first wiki where the architecture diagram is the navigation, the config is the content, and every page serves three audiences without compromise."

---

## 7. CTA, Highlights & Best Practices

### CTA Hub — Three Paths
| Path | Action | Links To |
|---|---|---|
| 🚀 Try It | "Deploy in 5 minutes" | Quickstart, inference.sh |
| 🛠️ Build With It | "Integrate into workflow" | API docs, SDK |
| 🤝 Contribute | "Join the ecosystem" | GitHub, issues, community |

### Highlights
- Animated GIF demos of capabilities
- Before/after config comparisons
- Agent speed benchmarks
- Skill capability matrix heatmap
- GSAP number animation counters

### Best Practices
- Flip-to-reveal cards (GSAP 3D flip animation)
- Categories: Planning, Coding, Design, Workflow
- Front: title + icon + one-liner
- Back: full explanation + code example

### Conversion Ladder
```
Showroom (wow) → Playbook + Agents (understand) → Highlights + Practices (prove)
→ News (relevance) → CTA (act)
```

---

## 8. Design System Notes

### Color Palette (Approved)
- Background: Deep space (#0a0a1a to #1a1a2e)
- Primary: Violet (#a78bfa)
- Accent: Emerald (#34d399)
- Amber: Highlight/CTA (#fbbf24)
- Text: White/off-white with opacity variants
- For brand-guidelines compliance if needed

### Typography
- Display: Inter tight or Satoshi (headings)
- Body: Inter (readability)
- Code: JetBrains Mono or Fira Code
- Scale: Fluid type (clamp()) for responsiveness

### Animation Constants
- Page transitions: 600ms ease-in-out
- GSAP ScrollTrigger: start "top 80%", end "bottom 20%"
- 3D camera orbit: default 0.5 speed
- News ticker: 8s per headline
- Stagger delays: 0.05-0.15s between items

---

## 9. Implementation Order

### Phase 1: Foundation (do first)
1. Next.js 15 project init with App Router + Tailwind
2. R3F canvas component + basic 3D scene
3. MDX content pipeline with next-mdx-remote
4. Page layouts (agent page, playbook page, news page)
5. Header + sidebar + search

### Phase 2: Showroom
6. Agent cosmos 3D node graph (positioning, connections, interaction)
7. Landing page with scroll narrative
8. GSAP ScrollTrigger choreography
9. Camera fly-to on agent click

### Phase 3: Content & Integration
10. Agent MDX files (all 17+ agents)
11. Playbook, best practices, secret sauce content
12. News scraper API route + cron + ISR cache
13. News page + landing ticker

### Phase 4: Polish
14. Page transitions (GSAP Flip)
15. CTA hub
16. Highlights page with animated demos
17. Performance optimization (bundle, 3D LOD, image loading)
18. Responsive + mobile fallback for 3D

---

## 10. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| R3F performance on low-end devices | Medium | Medium | LOD system, fallback to static diagram |
| ISR cache staleness for news | Low | Low | Stale-while-revalidate, "updated X ago" banner |
| MDX complexity slows content creation | Medium | Medium | Template system, frontmatter validation |
| 3D + animation bundle size large | Medium | Medium | Dynamic imports, code splitting, lazy R3F load |

---

**Approved:** All 7 design sections signed off
**Next:** Load writing-plans skill → Generate implementation plan → Execute
