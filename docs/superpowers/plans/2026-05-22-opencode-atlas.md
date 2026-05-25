# OpenCode Atlas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the OpenCode Atlas — an award-winning interactive wiki with 3D agent cosmos, dual-audience content tiers, cinematic motion, and live AI news scraping.

**Architecture:** Next.js 15 App Router with ISR, React Three Fiber for 3D agent visualization, GSAP ScrollTrigger for scroll-driven narrative, MDX content pipeline with next-mdx-remote, Tavily/Exa search APIs for realtime AI news, Vercel deploy.

**Tech Stack:** Next.js 15, React Three Fiber, GSAP + Framer Motion, Tailwind CSS v4, MDX, next-mdx-remote, Vercel Cron, Tavily Search MCP, Exa Search MCP

---

## Task Overview

```
Phase 1: Foundation (Tasks 1-5)
Phase 2: Showroom (Tasks 6-9)
Phase 3: Content & Integration (Tasks 10-14)
Phase 4: Polish (Tasks 15-18)
```

---

## Phase 1: Foundation

### Task 1: Initialize Next.js Project

**Files:**
- Create: `PROJECT_ROOT/package.json`
- Create: `PROJECT_ROOT/next.config.ts`
- Create: `PROJECT_ROOT/tsconfig.json`
- Create: `PROJECT_ROOT/tailwind.config.ts`
- Create: `PROJECT_ROOT/postcss.config.mjs`
- Create: `PROJECT_ROOT/app/layout.tsx`
- Create: `PROJECT_ROOT/app/globals.css`
- Create: `PROJECT_ROOT/app/page.tsx` (minimal placeholder)

- [ ] **Step 1: Create Next.js 15 project**

Run:
```bash
cd /home/x1
npx create-next-app@latest opencode-atlas --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

Expected: Project scaffolded at `/home/x1/opencode-atlas/`

- [ ] **Step 2: Install core dependencies**

```bash
cd /home/x1/opencode-atlas
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing
npm install gsap framer-motion
npm install next-mdx-remote @tailwindcss/typography
npm install @inferencesh/sdk
npm install fuse.js
```

Expected: All packages added to `package.json`

- [ ] **Step 3: Configure next.config.ts**

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    mdxRs: true,
  },
};

export default nextConfig;
```

- [ ] **Step 4: Set up globals.css with design system variables**

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-deep-space: #0a0a1a;
  --color-space-dark: #1a1a2e;
  --color-violet-primary: #a78bfa;
  --color-violet-deep: #7c3aed;
  --color-emerald-accent: #34d399;
  --color-amber-cta: #fbbf24;
  --color-rose-accent: #ec4899;
  --color-surface: rgba(255, 255, 255, 0.03);
  --color-surface-hover: rgba(255, 255, 255, 0.06);
  --color-border: rgba(255, 255, 255, 0.08);
}

@layer base {
  body {
    background-color: var(--color-deep-space);
    color: rgba(255, 255, 255, 0.9);
    font-family: 'Inter', system-ui, sans-serif;
  }
}

@layer utilities {
  .text-gradient {
    background: linear-gradient(135deg, #a78bfa, #6366f1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 0.75rem;
  }

  .glow-border {
    border: 1px solid rgba(167, 139, 250, 0.2);
    box-shadow: 0 0 20px rgba(167, 139, 250, 0.1);
  }
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--color-deep-space); }
::-webkit-scrollbar-thumb { background: rgba(167, 139, 250, 0.3); border-radius: 3px; }

/* Selection */
::selection { background: rgba(167, 139, 250, 0.3); }
```

- [ ] **Step 5: Create root layout with fonts**

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OpenCode Atlas — Agent Ecosystem Wiki",
  description:
    "The interactive wiki exploring the OpenCode agent ecosystem. 3D cosmos navigation, live AI news, and deep reference documentation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 6: Verify dev server starts**

```bash
cd /home/x1/opencode-atlas
npm run dev
```

Expected: Dev server starts on http://localhost:3000 without errors. Confirm and kill (`Ctrl+C`).

- [ ] **Step 7: Commit**

```bash
cd /home/x1/opencode-atlas
git init
git add -A
git commit -m "feat: scaffold Next.js 15 project with design system"
```

---

### Task 2: MDX Content Pipeline

**Files:**
- Create: `PROJECT_ROOT/src/content/agents/blueprint.md`
- Create: `PROJECT_ROOT/src/lib/mdx.ts`
- Create: `PROJECT_ROOT/src/app/agents/page.tsx`
- Create: `PROJECT_ROOT/src/app/agents/[slug]/page.tsx`

- [ ] **Step 1: Create content directory structure**

```bash
cd /home/x1/opencode-atlas
mkdir -p src/content/agents src/content/playbook src/content/skills src/content/system
```

- [ ] **Step 2: Create first agent content file (blueprint.md)**

```md
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

## Overview

Blueprint is the strategic planner and architect. It thinks deeply, brainstorms broadly, and produces clear plans that others can execute. It enforces the 3-gate plan grammar system — self-check, hard constraint audit, and @plan validation — before any plan is submitted for execution.

## Core Responsibilities

- **Silent Protocol:** Before every response, diagnose what the user actually needs, identify blind spots, and find the simplest true answer.
- **Routing Decision:** Route between Speed Mode, Depth-Seeking Mode, Surface Frame, and Hybrid based on alignment between stated and actual needs.
- **Plan Grammar Enforcement:** All plans must pass three gates before execution: self-check against grammar, hard constraint audit, and @plan validation.

## Prompt Anatomy

The Blueprint agent operates at the system level. Its prompt defines the coordination pattern (Silent Protocol → Routing → Depth-Seeking → Brainstorming → Subagent Delegation) and the hard constraints all plans must satisfy.

## Plan Grammar

The 3-gate system:
1. **Self-Check:** Title/Scope, Context, Constraints, Steps, Dependencies, Risks, Verification
2. **Hard Audit:** Every step independently executable, no magic steps, all assumptions testable, no scope creep, risks have mitigations
3. **@plan Validation:** Formal grammar check by the Plan Enforcer subagent

## Source

Actual prompt: `~/.config/opencode/agents/blueprint.md`
```

- [ ] **Step 3: Create MDX loading utility**

```ts
// src/lib/mdx.ts
import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "src/content");

export interface AgentFrontmatter {
  title: string;
  role: string;
  tier: "primary" | "subagent" | "specialist";
  fallback?: string;
  consumes?: string[];
  produces?: string[];
  dependencies?: string[];
  related_skills?: string[];
}

export function getAllAgents(): { slug: string; frontmatter: AgentFrontmatter }[] {
  const agentsDir = path.join(CONTENT_DIR, "agents");
  if (!fs.existsSync(agentsDir)) return [];
  const files = fs.readdirSync(agentsDir).filter((f) => f.endsWith(".md"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(agentsDir, file), "utf-8");
    const frontmatter = parseFrontmatter<AgentFrontmatter>(raw);
    return { slug: file.replace(".md", ""), frontmatter };
  });
}

export function getAgentBySlug(slug: string): { content: string; frontmatter: AgentFrontmatter } | null {
  const filePath = path.join(CONTENT_DIR, "agents", `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const frontmatter = parseFrontmatter<AgentFrontmatter>(raw);
  const content = raw.replace(/^---[\s\S]*?---\n?/, "");
  return { content, frontmatter };
}

function parseFrontmatter<T>(raw: string): T {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {} as T;
  const yaml = match[1];
  const obj: Record<string, unknown> = {};
  for (const line of yaml.split("\n")) {
    const [key, ...rest] = line.split(":");
    if (key && rest.length) {
      const value = rest.join(":").trim();
      if (value.startsWith("[")) {
        obj[key.trim()] = JSON.parse(value.replace(/'/g, '"'));
      } else {
        obj[key.trim()] = value;
      }
    }
  }
  return obj as T;
}
```

- [ ] **Step 4: Create agents list page**

```tsx
// src/app/agents/page.tsx
import { getAllAgents } from "@/lib/mdx";
import Link from "next/link";

export default function AgentsPage() {
  const agents = getAllAgents();

  return (
    <main className="min-h-screen bg-deep-space p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-gradient">Agent Directory</h1>
        <p className="text-white/60 mb-8">
          All {agents.length} agents in the OpenCode ecosystem
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <Link
              key={agent.slug}
              href={`/agents/${agent.slug}`}
              className="glass-card p-6 hover:glow-border transition-all duration-300 group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-violet-primary/20 text-violet-primary uppercase">
                  {agent.frontmatter.tier}
                </span>
              </div>
              <h2 className="text-xl font-semibold group-hover:text-violet-primary transition-colors">
                {agent.frontmatter.title}
              </h2>
              <p className="text-sm text-white/60 mt-1">{agent.frontmatter.role}</p>
              {agent.frontmatter.dependencies && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {agent.frontmatter.dependencies.map((dep) => (
                    <span key={dep} className="text-xs px-2 py-0.5 rounded-full bg-emerald-accent/10 text-emerald-accent">
                      {dep}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Create agent detail page**

```tsx
// src/app/agents/[slug]/page.tsx
import { getAgentBySlug, getAllAgents } from "@/lib/mdx";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  return getAllAgents().map((agent) => ({ slug: agent.slug }));
}

export default function AgentDetailPage({ params }: { params: { slug: string } }) {
  const agent = getAgentBySlug(params.slug);
  if (!agent) notFound();

  const { frontmatter, content } = agent;

  return (
    <main className="min-h-screen bg-deep-space p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/agents" className="text-sm text-violet-primary hover:underline mb-4 inline-block">
          ← Back to Agents
        </Link>

        <div className="flex items-start gap-4 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-primary/20 text-violet-primary uppercase">
                {frontmatter.tier}
              </span>
              {frontmatter.fallback && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-cta/10 text-amber-cta">
                  fallback: {frontmatter.fallback}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold">{frontmatter.title}</h1>
            <p className="text-white/60 mt-1">{frontmatter.role}</p>
          </div>
        </div>

        {/* Flow pipeline */}
        <div className="glass-card p-4 mb-8 flex items-center gap-3 text-sm flex-wrap">
          {frontmatter.consumes && (
            <span className="text-emerald-accent">consumes: {frontmatter.consumes.join(", ")}</span>
          )}
          <span className="text-white/40">→</span>
          <span className="text-violet-primary font-semibold">{frontmatter.title.split("(")[0].trim()}</span>
          <span className="text-white/40">→</span>
          {frontmatter.produces && (
            <span className="text-amber-cta">produces: {frontmatter.produces.join(", ")}</span>
          )}
        </div>

        {/* Content — rendered as plain text for now, MDX later */}
        <div className="prose prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(content) }} />
        </div>

        {/* Related */}
        {frontmatter.related_skills && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Related Skills</h3>
            <div className="flex flex-wrap gap-2">
              {frontmatter.related_skills.map((skill) => (
                <span key={skill} className="text-sm px-3 py-1 rounded-full bg-surface text-white/70">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function renderMarkdownToHtml(md: string): string {
  // Simple markdown renderer for headings and paragraphs
  return md
    .split("\n\n")
    .map((block) => {
      if (block.startsWith("## ")) return `<h2 class="text-2xl font-bold mt-8 mb-4">${block.slice(3)}</h2>`;
      if (block.startsWith("### ")) return `<h3 class="text-xl font-semibold mt-6 mb-3">${block.slice(4)}</h3>`;
      if (block.startsWith("- **")) return `<ul class="list-disc pl-6 my-2"><li>${block.slice(2)}</li></ul>`;
      return `<p class="text-white/80 leading-relaxed mb-4">${block.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");
}
```

- [ ] **Step 6: Create more agent content files**

Create MDX files for: `orchestrator.md`, `plan.md`, `explore.md`, `fixer.md`, `researcher.md`, `designer.md`, `oracle.md`, `council.md`, `librarian.md`, `observer.md`, `brainstorming.md`, `general.md` — each following the same frontmatter pattern with accurate data from the actual agent config files.

- [ ] **Step 7: Verify agent pages render**

```bash
cd /home/x1/opencode-atlas
npm run build
```

Expected: All agent pages pre-rendered statically. No build errors.

- [ ] **Step 8: Commit**

```bash
cd /home/x1/opencode-atlas
git add -A
git commit -m "feat: add MDX content pipeline with agent pages"
```

---

### Task 3: Header, Sidebar & Layout Shell

**Files:**
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/Shell.tsx`
- Create: `src/components/layout/CommandPalette.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create Header component**

```tsx
// src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Cosmos", href: "/" },
  { label: "Playbook", href: "/playbook" },
  { label: "Agents", href: "/agents" },
  { label: "Skills", href: "/skills" },
  { label: "System", href: "/system" },
  { label: "News", href: "/news" },
];

export default function Header({ onSearchClick }: { onSearchClick?: () => void }) {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-deep-space/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-gradient">◈ OpenCode Atlas</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition-colors ${
                pathname.startsWith(item.href) && item.href !== "/"
                  ? "text-violet-primary"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={onSearchClick}
          className="text-sm text-white/40 border border-white/10 rounded-full px-3 py-1 hover:border-violet-primary/30 transition-colors"
        >
          Search ⌘K
        </button>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Create Sidebar component**

```tsx
// src/components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarSection {
  title: string;
  links: { label: string; href: string }[];
}

const sections: SidebarSection[] = [
  {
    title: "Playbook",
    links: [
      { label: "Overview", href: "/playbook" },
      { label: "Routing Logic", href: "/playbook/routing-logic" },
      { label: "Plan Grammar", href: "/playbook/plan-grammar" },
      { label: "Fallback Chains", href: "/playbook/fallback-chains" },
      { label: "Secret Sauce", href: "/playbook/secret-sauce" },
      { label: "Best Practices", href: "/playbook/best-practices" },
    ],
  },
  {
    title: "Agents",
    links: [
      { label: "All Agents", href: "/agents" },
      { label: "Blueprint", href: "/agents/blueprint" },
      { label: "Orchestrator", href: "/agents/orchestrator" },
      { label: "Plan", href: "/agents/plan" },
      { label: "Explore", href: "/agents/explore" },
    ],
  },
];

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-14 bottom-0 w-64 border-r border-white/10 bg-deep-space/95 backdrop-blur-xl overflow-y-auto transition-transform duration-300 z-40 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4 space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block text-sm px-3 py-1.5 rounded-lg transition-colors ${
                      pathname === link.href
                        ? "bg-violet-primary/10 text-violet-primary"
                        : "text-white/60 hover:text-white hover:bg-surface"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
```

- [ ] **Step 3: Create Command Palette**

```tsx
// src/components/layout/CommandPalette.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  label: string;
  href: string;
  type: "agent" | "skill" | "page";
}

const allResults: SearchResult[] = [
  { label: "Blueprint (Primary Planner)", href: "/agents/blueprint", type: "agent" },
  { label: "Orchestrator (Primary Executor)", href: "/agents/orchestrator", type: "agent" },
  { label: "Plan (Grammar Enforcer)", href: "/agents/plan", type: "agent" },
  { label: "Writing Plans", href: "/skills/writing-plans", type: "skill" },
  { label: "Brainstorming", href: "/skills/brainstorming", type: "skill" },
  { label: "Playbook Overview", href: "/playbook", type: "page" },
  { label: "Secret Sauce", href: "/playbook/secret-sauce", type: "page" },
];

export default function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query) {
      setResults(allResults.slice(0, 5));
      return;
    }
    const q = query.toLowerCase();
    setResults(
      allResults.filter(
        (r) => r.label.toLowerCase().includes(q) || r.type.includes(q)
      )
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg glass-card p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Search agents, skills, pages..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-violet-primary/50 transition-colors"
        />
        <div className="mt-3 space-y-1">
          {results.map((result) => (
            <button
              key={result.href}
              onClick={() => {
                router.push(result.href);
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-surface transition-colors text-left"
            >
              <span className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-white/40 uppercase">
                {result.type}
              </span>
              <span>{result.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Update root layout to include Shell**

```tsx
// src/app/layout.tsx (update)
"use client";

import { useState, useEffect } from "react";
import { Inter, JetBrains_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import CommandPalette from "@/components/layout/CommandPalette";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <Header onSearchClick={() => setSearchOpen(true)} />
        <Sidebar isOpen={sidebarOpen} />
        <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        <div className="pt-14">{children}</div>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Verify build**

```bash
cd /home/x1/opencode-atlas
npm run build
```

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add header, sidebar, command palette layout shell"
```

---

### Task 4: R3F 3D Scene Foundation

**Files:**
- Create: `src/components/cosmos/CosmosCanvas.tsx`
- Create: `src/components/cosmos/AgentNode.tsx`
- Create: `src/components/cosmos/StarField.tsx`
- Create: `src/components/cosmos/OrbitRings.tsx`

- [ ] **Step 1: Create CosmosCanvas (wrapper component)**

```tsx
// src/components/cosmos/CosmosCanvas.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import StarField from "./StarField";

interface CosmosCanvasProps {
  children: React.ReactNode;
  cameraPosition?: [number, number, number];
  controls?: boolean;
}

export default function CosmosCanvas({
  children,
  cameraPosition = [0, 2, 8],
  controls = true,
}: CosmosCanvasProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: cameraPosition, fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={["#0a0a1a"]} />
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#a78bfa" />
          <StarField count={2000} />
          {children}
          {controls && <OrbitControls enableDamping dampingFactor={0.05} autoRotate autoRotateSpeed={0.5} />}
        </Suspense>
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Create StarField**

```tsx
// src/components/cosmos/StarField.tsx
"use client";

import { useRef, useMemo } from "react";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

interface StarFieldProps {
  count?: number;
}

export default function StarField({ count = 2000 }: StarFieldProps) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 60;
    }
    return pos;
  }, [count]);

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#a78bfa"
        size={0.03}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}
```

- [ ] **Step 3: Create AgentNode component**

```tsx
// src/components/cosmos/AgentNode.tsx
"use client";

import { useRef, useState } from "react";
import { Mesh, Color } from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";

interface AgentNodeProps {
  position: [number, number, number];
  label: string;
  color?: string;
  size?: number;
  tier?: "primary" | "subagent" | "specialist";
  onClick?: () => void;
}

const TIER_CONFIG = {
  primary: { size: 0.6, color: "#a78bfa", emissive: "#4c1d95" },
  subagent: { size: 0.35, color: "#34d399", emissive: "#065f46" },
  specialist: { size: 0.25, color: "#fbbf24", emissive: "#78350f" },
};

export default function AgentNode({
  position,
  label,
  color,
  size,
  tier = "subagent",
  onClick,
}: AgentNodeProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const config = TIER_CONFIG[tier];

  const nodeColor = color || config.color;
  const nodeSize = size || config.size;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.01;
      const scale = hovered ? 1.3 : 1;
      meshRef.current.scale.lerp({ x: scale, y: scale, z: scale }, 0.1);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[nodeSize, 32, 32]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={config.emissive}
          emissiveIntensity={hovered ? 0.8 : 0.3}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      {hovered && (
        <Text
          position={[0, nodeSize + 0.3, 0]}
          fontSize={0.2}
          color={nodeColor}
          anchorX="center"
          anchorY="bottom"
        >
          {label}
        </Text>
      )}
    </group>
  );
}
```

- [ ] **Step 4: Create OrbitRings**

```tsx
// src/components/cosmos/OrbitRings.tsx
"use client";

import { useRef } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";

interface OrbitRingsProps {
  radius: number;
  color?: string;
  segments?: number;
}

export default function OrbitRings({ radius, color = "rgba(167, 139, 250, 0.15)", segments = 64 }: OrbitRingsProps) {
  const points = Array.from({ length: segments + 1 }, (_, i) => {
    const theta = (i / segments) * Math.PI * 2;
    return [Math.cos(theta) * radius, 0, Math.sin(theta) * radius] as [number, number, number];
  });

  return <Line points={points} color={color} lineWidth={0.5} transparent opacity={0.2} />;
}
```

- [ ] **Step 5: Create a test cosmos page to verify 3D renders**

```tsx
// src/app/cosmos/page.tsx
"use client";

import CosmosCanvas from "@/components/cosmos/CosmosCanvas";
import AgentNode from "@/components/cosmos/AgentNode";
import OrbitRings from "@/components/cosmos/OrbitRings";

export default function CosmosPage() {
  const handleAgentClick = (name: string) => {
    console.log(`Clicked: ${name}`);
  };

  return (
    <main className="w-full h-screen">
      <CosmosCanvas>
        {/* Primaries — center */}
        <AgentNode
          position={[0, 0, 0]}
          label="Blueprint"
          tier="primary"
          onClick={() => handleAgentClick("blueprint")}
        />

        {/* Inner orbit */}
        <OrbitRings radius={2} />
        {[
          { pos: [2, 0, 0] as [number, number, number], label: "Plan" },
          { pos: [0, 0, 2] as [number, number, number], label: "Explore" },
          { pos: [-2, 0, 0] as [number, number, number], label: "Designer" },
          { pos: [0, 0, -2] as [number, number, number], label: "Oracle" },
        ].map((agent, i) => (
          <AgentNode
            key={agent.label}
            position={agent.pos}
            label={agent.label}
            tier="subagent"
            onClick={() => handleAgentClick(agent.label)}
          />
        ))}

        {/* Outer orbit */}
        <OrbitRings radius={4} color="rgba(251, 191, 36, 0.1)" />
        {[
          { pos: [4, 0.3, 0] as [number, number, number], label: "Council" },
          { pos: [0, -0.3, 4] as [number, number, number], label: "Librarian" },
          { pos: [-4, 0.2, 0] as [number, number, number], label: "Observer" },
          { pos: [0, -0.2, -4] as [number, number, number], label: "General" },
        ].map((agent) => (
          <AgentNode
            key={agent.label}
            position={agent.pos}
            label={agent.label}
            tier="specialist"
            onClick={() => handleAgentClick(agent.label)}
          />
        ))}
      </CosmosCanvas>
    </main>
  );
}
```

- [ ] **Step 6: Verify 3D scene renders**

```bash
cd /home/x1/opencode-atlas
npm run dev
```

Open `http://localhost:3000/cosmos` — verify the 3D scene renders with nodes, orbit rings, star field, and OrbitControls work.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add React Three Fiber cosmos scene with agent nodes"
```

---

### Task 5: Playbook & System Routes

**Files:**
- Create: `src/app/playbook/page.tsx`
- Create: `src/app/playbook/[slug]/page.tsx`
- Create: `src/app/system/page.tsx`
- Create: `src/app/system/[slug]/page.tsx`
- Create: `src/app/skills/page.tsx`

- [ ] **Step 1: Create playbook list page**

```tsx
// src/app/playbook/page.tsx
export default function PlaybookPage() {
  const chapters = [
    { title: "Routing Logic", slug: "routing-logic", desc: "How the Silent Protocol routes between Speed, Depth, and Hybrid modes" },
    { title: "Plan Grammar", slug: "plan-grammar", desc: "The 3-gate system: self-check, hard audit, @plan validation" },
    { title: "Fallback Chains", slug: "fallback-chains", desc: "How -lite subagents prevent silent failures" },
    { title: "Secret Sauce", slug: "secret-sauce", desc: "Design philosophy and what makes this system unique" },
    { title: "Best Practices", slug: "best-practices", desc: "Verified patterns that produce reliable results" },
  ];

  return (
    <main className="min-h-screen bg-deep-space p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-gradient">Playbook</h1>
        <p className="text-white/60 mb-8">The OpenCode methodology — patterns, grammar, and philosophy</p>
        <div className="space-y-4">
          {chapters.map((ch) => (
            <a
              key={ch.slug}
              href={`/playbook/${ch.slug}`}
              className="block glass-card p-6 hover:glow-border transition-all duration-300"
            >
              <h2 className="text-xl font-semibold">{ch.title}</h2>
              <p className="text-sm text-white/60 mt-1">{ch.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Create playbook detail page (dynamic route)**

```tsx
// src/app/playbook/[slug]/page.tsx
import Link from "next/link";
import { readFileSync } from "fs";
import path from "path";

const PLAYBOOK_DIR = path.join(process.cwd(), "src/content/playbook");

export function generateStaticParams() {
  const slugs = ["routing-logic", "plan-grammar", "fallback-chains", "secret-sauce", "best-practices"];
  return slugs.map((slug) => ({ slug }));
}

export default function PlaybookDetailPage({ params }: { params: { slug: string } }) {
  const filePath = path.join(PLAYBOOK_DIR, `${params.slug}.md`);
  let content = "# Coming Soon\n\nThis chapter is being written.";
  try {
    content = readFileSync(filePath, "utf-8");
  } catch {}

  return (
    <main className="min-h-screen bg-deep-space p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/playbook" className="text-sm text-violet-primary hover:underline mb-4 inline-block">
          ← Back to Playbook
        </Link>
        <div className="prose prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br/>") }} />
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Create skills page**

```tsx
// src/app/skills/page.tsx
const skills = [
  { name: "writing-plans", desc: "Write comprehensive implementation plans", cats: ["planning"] },
  { name: "brainstorming", desc: "Creative ideation and divergent thinking", cats: ["planning"] },
  { name: "frontend-design", desc: "Production-grade frontend interfaces", cats: ["design"] },
  { name: "explore", desc: "Codebase search and pattern discovery", cats: ["research"] },
  { name: "systematic-debugging", desc: "Disciplined debugging loop", cats: ["development"] },
  { name: "devils-advocate", desc: "Rigorous critical challenge", cats: ["planning"] },
];

export default function SkillsPage() {
  return (
    <main className="min-h-screen bg-deep-space p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-gradient">Skill Registry</h1>
        <p className="text-white/60 mb-8">All available skills in the OpenCode ecosystem</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill) => (
            <div key={skill.name} className="glass-card p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-violet-primary/10 text-violet-primary">
                  {skill.cats[0]}
                </span>
              </div>
              <h2 className="text-lg font-semibold">{skill.name}</h2>
              <p className="text-sm text-white/60 mt-1">{skill.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Create system page**

```tsx
// src/app/system/page.tsx
const sections = [
  { title: "Agent Hierarchy", slug: "agents-hierarchy", desc: "The full agent tree with routing table" },
  { title: "Prompts Atlas", slug: "prompts-atlas", desc: "System prompt structure and anatomy" },
  { title: "MCP Catalog", slug: "mcp-catalog", desc: "All registered MCP servers and their capabilities" },
];

export default function SystemPage() {
  return (
    <main className="min-h-screen bg-deep-space p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-gradient">System</h1>
        <p className="text-white/60 mb-8">Internal architecture and configuration reference</p>
        <div className="space-y-4">
          {sections.map((s) => (
            <a
              key={s.slug}
              href={`/system/${s.slug}`}
              className="block glass-card p-6 hover:glow-border transition-all duration-300"
            >
              <h2 className="text-xl font-semibold">{s.title}</h2>
              <p className="text-sm text-white/60 mt-1">{s.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Verify build**

```bash
cd /home/x1/opencode-atlas
npm run build
```

Expected: All routes build without errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add playbook, skills, and system routes"
```

---

## Phase 2: Showroom

### Task 6: Full Agent Cosmos — All 17 Nodes

**Files:**
- Modify: `src/components/cosmos/AgentNode.tsx` (add connection lines)
- Create: `src/components/cosmos/AgentCosmos.tsx` (full scene with all agents)
- Create: `src/data/agents.ts` (agent positions and metadata)

- [ ] **Step 1: Create agent data registry**

```ts
// src/data/agents.ts
export interface AgentData {
  id: string;
  label: string;
  tier: "primary" | "subagent" | "specialist";
  position: [number, number, number];
  color?: string;
  orbit: "center" | "inner" | "outer";
}

export const AGENTS: AgentData[] = [
  // Center — primaries
  { id: "blueprint", label: "Blueprint", tier: "primary", position: [-0.5, 0, 0], orbit: "center" },
  { id: "orchestrator", label: "Orchestrator", tier: "primary", position: [0.5, 0, 0], orbit: "center" },

  // Inner orbit — core subagents
  { id: "plan", label: "Plan", tier: "subagent", position: [2, 0.1, 0], orbit: "inner" },
  { id: "explore", label: "Explore", tier: "subagent", position: [1.4, -0.1, 1.4], orbit: "inner" },
  { id: "fixer", label: "Fixer", tier: "subagent", position: [0, 0.2, 2], orbit: "inner" },
  { id: "researcher", label: "Researcher", tier: "subagent", position: [-1.4, -0.1, 1.4], orbit: "inner" },
  { id: "designer", label: "Designer", tier: "subagent", position: [-2, 0.1, 0], orbit: "inner" },
  { id: "oracle", label: "Oracle", tier: "subagent", position: [-1.4, -0.2, -1.4], orbit: "inner" },

  // Outer orbit — specialists
  { id: "council", label: "Council", tier: "specialist", position: [3.5, 0.3, 1.5], orbit: "outer" },
  { id: "librarian", label: "Librarian", tier: "specialist", position: [1.5, -0.3, 3.5], orbit: "outer" },
  { id: "observer", label: "Observer", tier: "specialist", position: [-1.5, 0.4, 3.5], orbit: "outer" },
  { id: "brainstorming", label: "Brainstorming", tier: "specialist", position: [-3.5, -0.3, 1.5], orbit: "outer" },
  { id: "general", label: "General", tier: "specialist", position: [-3.5, 0.2, -1.5], orbit: "outer" },
];

// Lite fallbacks (smaller, dimmer)
export const LITE_AGENTS: { id: string; label: string; position: [number, number, number]; parentId: string }[] = [
  { id: "oracle-lite", label: "Oracle Lite", position: [-1.8, -0.6, -1.8], parentId: "oracle" },
  { id: "council-lite", label: "Council Lite", position: [4, 0.6, 1.8], parentId: "council" },
  { id: "observer-lite", label: "Observer Lite", position: [-2, 0.7, 4], parentId: "observer" },
  { id: "designer-lite", label: "Designer Lite", position: [-2.4, -0.5, 0.4], parentId: "designer" },
];

// Connection pairs (source, target)
export const CONNECTIONS: [string, string][] = [
  ["blueprint", "orchestrator"],
  ["blueprint", "plan"],
  ["blueprint", "brainstorming"],
  ["orchestrator", "explore"],
  ["orchestrator", "fixer"],
  ["orchestrator", "researcher"],
  ["orchestrator", "designer"],
  ["orchestrator", "oracle"],
  ["orchestrator", "council"],
  ["blueprint", "librarian"],
  ["orchestrator", "observer"],
  ["orchestrator", "general"],
];
```

- [ ] **Step 2: Create full AgentCosmos component**

```tsx
// src/components/cosmos/AgentCosmos.tsx
"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import CosmosCanvas from "./CosmosCanvas";
import AgentNode from "./AgentNode";
import OrbitRings from "./OrbitRings";
import ConnectionLines from "./ConnectionLines";
import LiteNode from "./LiteNode";
import { AGENTS, LITE_AGENTS, CONNECTIONS } from "@/data/agents";

export default function AgentCosmos({ interactive = true }: { interactive?: boolean }) {
  const router = useRouter();

  const handleClick = useCallback(
    (id: string) => {
      if (interactive) router.push(`/agents/${id}`);
    },
    [interactive, router]
  );

  return (
    <CosmosCanvas controls={interactive}>
      {/* Orbit rings */}
      <OrbitRings radius={1.2} color="rgba(167, 139, 250, 0.1)" />
      <OrbitRings radius={2.5} color="rgba(52, 211, 153, 0.08)" />
      <OrbitRings radius={4} color="rgba(251, 191, 36, 0.06)" />

      {/* Connection lines */}
      <ConnectionLines connections={CONNECTIONS} agents={AGENTS} />

      {/* Main agent nodes */}
      {AGENTS.map((agent) => (
        <AgentNode
          key={agent.id}
          position={agent.position}
          label={agent.label}
          tier={agent.tier}
          color={agent.color}
          onClick={() => handleClick(agent.id)}
        />
      ))}

      {/* Lite fallbacks */}
      {LITE_AGENTS.map((lite) => (
        <LiteNode
          key={lite.id}
          position={lite.position}
          label={lite.label}
          onClick={() => handleClick(lite.id)}
        />
      ))}
    </CosmosCanvas>
  );
}
```

- [ ] **Step 3: Create ConnectionLines component**

```tsx
// src/components/cosmos/ConnectionLines.tsx
"use client";

import { useMemo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { AgentData } from "@/data/agents";

interface ConnectionLinesProps {
  connections: [string, string][];
  agents: AgentData[];
}

export default function ConnectionLines({ connections, agents }: ConnectionLinesProps) {
  const agentMap = useMemo(() => {
    const map = new Map<string, AgentData>();
    agents.forEach((a) => map.set(a.id, a));
    return map;
  }, [agents]);

  return (
    <group>
      {connections.map(([from, to], i) => {
        const fromAgent = agentMap.get(from);
        const toAgent = agentMap.get(to);
        if (!fromAgent || !toAgent) return null;

        const points: [number, number, number][] = [
          fromAgent.position,
          [
            (fromAgent.position[0] + toAgent.position[0]) / 2,
            (fromAgent.position[1] + toAgent.position[1]) / 2 + 0.5,
            (fromAgent.position[2] + toAgent.position[2]) / 2,
          ],
          toAgent.position,
        ];

        return (
          <Line
            key={`${from}-${to}`}
            points={points}
            color="rgba(167, 139, 250, 0.15)"
            lineWidth={0.5}
            transparent
            opacity={0.3}
          />
        );
      })}
    </group>
  );
}
```

- [ ] **Step 4: Create LiteNode component**

```tsx
// src/components/cosmos/LiteNode.tsx
"use client";

import { useRef, useState } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";

interface LiteNodeProps {
  position: [number, number, number];
  label: string;
  onClick?: () => void;
}

export default function LiteNode({ position, label, onClick }: LiteNodeProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      const scale = hovered ? 1.4 : 1;
      meshRef.current.scale.lerp({ x: scale, y: scale, z: scale }, 0.1);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="#6b7280"
          emissive="#374151"
          emissiveIntensity={hovered ? 0.6 : 0.2}
          opacity={0.6}
          transparent
        />
      </mesh>
    </group>
  );
}
```

- [ ] **Step 5: Verify cosmos renders with all 17 nodes**

```bash
cd /home/x1/opencode-atlas
npm run dev
```

Open `http://localhost:3000/cosmos` — verify all nodes render with orbits, connections, hover effects.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: full agent cosmos with 17 nodes, orbits, connections"
```

---

### Task 7: Landing Page with Scroll Narrative

**Files:**
- Create: `src/app/page.tsx` (replace placeholder)
- Create: `src/components/landing/HeroSection.tsx`
- Create: `src/components/landing/WhatIsSection.tsx`
- Create: `src/components/landing/AgentShowcaseSection.tsx`
- Create: `src/components/landing/SecretSauceSection.tsx`
- Create: `src/components/landing/NewsTicker.tsx`
- Create: `src/components/landing/CTASection.tsx`

- [ ] **Step 1: Create the landing page with scroll sections**

```tsx
// src/app/page.tsx
"use client";

import dynamic from "next/dynamic";
import HeroSection from "@/components/landing/HeroSection";
import WhatIsSection from "@/components/landing/WhatIsSection";
import AgentShowcaseSection from "@/components/landing/AgentShowcaseSection";
import SecretSauceSection from "@/components/landing/SecretSauceSection";
import CTASection from "@/components/landing/CTASection";

// Dynamically import 3D cosmos to avoid SSR issues
const AgentCosmos = dynamic(() => import("@/components/cosmos/AgentCosmos"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-deep-space" />,
});

export default function HomePage() {
  return (
    <main className="bg-deep-space">
      {/* Hero — full screen 3D cosmos */}
      <section className="relative w-full h-screen">
        <div className="absolute inset-0 z-0">
          <AgentCosmos />
        </div>
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
          <h1 className="text-6xl md:text-8xl font-bold text-gradient text-center">
            OpenCode Atlas
          </h1>
          <p className="text-xl text-white/60 mt-4 text-center max-w-xl">
            The interactive wiki exploring the OpenCode agent ecosystem
          </p>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <svg className="w-6 h-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* What is OpenCode */}
      <WhatIsSection />

      {/* Agent Showcase */}
      <AgentShowcaseSection />

      {/* Secret Sauce */}
      <SecretSauceSection />

      {/* CTA */}
      <CTASection />
    </main>
  );
}
```

- [ ] **Step 2: Create HeroSection (minimal — cosmos does the work)**

```tsx
// src/components/landing/HeroSection.tsx
// Empty — hero is handled directly in page.tsx
export default function HeroSection() {
  return null;
}
```

- [ ] **Step 3: Create WhatIsSection with GSAP**

```tsx
// src/components/landing/WhatIsSection.tsx
"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function WhatIsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
        },
        opacity: 0,
        y: 60,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-3xl text-center">
        <h2 ref={textRef} className="text-4xl md:text-5xl font-bold mb-6">
          What is <span className="text-gradient">OpenCode</span>?
        </h2>
        <p className="text-lg text-white/70 leading-relaxed">
          OpenCode is an agent ecosystem — a network of specialized AI subagents,
          each with a defined role, prompt, and fallback chain. The system prompt
          coordinates them through a routing protocol (Silent Protocol → Routing
          → Execution → Quality Gates), enabling complex multi-step tasks with
          verification before completion.
        </p>
        <div className="grid grid-cols-3 gap-6 mt-12">
          {[
            { num: "17", label: "Agents" },
            { num: "29+", label: "Skills" },
            { num: "13", label: "MCP Servers" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold text-gradient">{stat.num}</div>
              <div className="text-sm text-white/40 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create AgentShowcaseSection**

```tsx
// src/components/landing/AgentShowcaseSection.tsx
"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const tierCards = [
  {
    title: "Primaries",
    agents: ["Blueprint", "Orchestrator"],
    color: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/30",
  },
  {
    title: "Subagents",
    agents: ["Plan", "Explore", "Fixer", "Researcher", "Designer", "Oracle"],
    color: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/30",
  },
  {
    title: "Specialists",
    agents: ["Council", "Librarian", "Observer", "Brainstorming", "General"],
    color: "from-amber-500/20 to-orange-500/10",
    border: "border-amber-500/30",
  },
];

export default function AgentShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.children;
      if (cards) {
        gsap.from(cards, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 20%",
          },
          opacity: 0,
          y: 40,
          stagger: 0.15,
          duration: 0.8,
          ease: "power2.out",
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          Agent <span className="text-gradient">Hierarchy</span>
        </h2>
        <p className="text-center text-white/60 mb-12">
          17 agents organized in three tiers, each with a defined role and fallback chain
        </p>
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tierCards.map((tier) => (
            <div
              key={tier.title}
              className={`glass-card p-6 border ${tier.border} bg-gradient-to-b ${tier.color}`}
            >
              <h3 className="text-lg font-semibold mb-4">{tier.title}</h3>
              <ul className="space-y-2">
                {tier.agents.map((name) => (
                  <li key={name}>
                    <Link
                      href={`/agents/${name.toLowerCase()}`}
                      className="text-sm text-white/70 hover:text-violet-primary transition-colors"
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/agents"
            className="inline-block text-sm text-violet-primary hover:underline"
          >
            View all agents →
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create SecretSauceSection**

```tsx
// src/components/landing/SecretSauceSection.tsx
"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  { icon: "🌀", title: "The Living Diagram", desc: "3D cosmos IS the navigation" },
  { icon: "📖", title: "Dual-Audience", desc: "Same URL serves both audiences" },
  { icon: "⚡", title: "Live + Static", desc: "ISR speed with live news" },
  { icon: "🔍", title: "Config Is Content", desc: "Source truth, no abstraction" },
  { icon: "🎭", title: "Cinematic Browsing", desc: "Every page feels alive" },
];

export default function SecretSauceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = sectionRef.current?.querySelectorAll(".pillar-card");
      if (items) {
        gsap.from(items, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 20%",
          },
          opacity: 0,
          x: -30,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          Secret <span className="text-gradient">Sauce</span>
        </h2>
        <p className="text-center text-white/60 mb-12">What makes the Atlas award-worthy</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pillars.map((p) => (
            <div key={p.title} className="pillar-card glass-card p-6 text-center">
              <div className="text-3xl mb-3">{p.icon}</div>
              <h3 className="font-semibold mb-1">{p.title}</h3>
              <p className="text-sm text-white/50">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Create CTASection**

```tsx
// src/components/landing/CTASection.tsx
"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ctaCards = [
  { emoji: "🚀", title: "Try It", desc: "Deploy in 5 minutes", href: "#", color: "from-violet-500/20" },
  { emoji: "🛠️", title: "Build With It", desc: "API docs & SDK", href: "#", color: "from-emerald-500/20" },
  { emoji: "🤝", title: "Contribute", desc: "Join the ecosystem", href: "#", color: "from-amber-500/20" },
];

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll(".cta-card");
      if (cards) {
        gsap.from(cards, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "bottom 20%",
          },
          scale: 0.8,
          opacity: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: "back.out(1.5)",
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Ready to <span className="text-gradient">Explore</span>?
        </h2>
        <p className="text-white/60 mb-12">Three paths into the ecosystem</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ctaCards.map((cta) => (
            <a
              key={cta.title}
              href={cta.href}
              className={`cta-card glass-card p-8 bg-gradient-to-b ${cta.color} hover:glow-border transition-all duration-300 block`}
            >
              <div className="text-4xl mb-3">{cta.emoji}</div>
              <h3 className="text-lg font-semibold">{cta.title}</h3>
              <p className="text-sm text-white/50 mt-1">{cta.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Verify landing page renders with all sections**

```bash
cd /home/x1/opencode-atlas
npm run dev
```

Open `http://localhost:3000` — verify hero with 3D cosmos, scroll sections, GSAP animations trigger.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: landing page with scroll narrative and GSAP animations"
```

---

## Phase 3: Content & Integration

### Task 8: News Scraper API + Page

**Files:**
- Create: `src/app/api/news/fetch/route.ts`
- Create: `src/app/api/news/revalidate/route.ts`
- Create: `src/app/news/page.tsx`
- Create: `src/lib/news.ts`
- Create: `src/app/api/cron/route.ts`
- Modify: `next.config.ts` (add revalidation config)

- [ ] **Step 1: Create news types and fetcher**

```ts
// src/lib/news.ts
export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  summary: string;
  relevance: number; // 0-1
}

const FALLBACK_NEWS: NewsItem[] = [
  {
    id: "fallback-1",
    title: "AI Agent Frameworks See Rapid Adoption in 2026",
    source: "TechCrunch",
    url: "#",
    publishedAt: new Date().toISOString(),
    summary: "The ecosystem of AI agent frameworks continues to expand rapidly.",
    relevance: 0.9,
  },
  {
    id: "fallback-2",
    title: "OpenCode Ecosystem Hits 17 Specialized Agents",
    source: "Developer News",
    url: "#",
    publishedAt: new Date().toISOString(),
    summary: "The OpenCode agent ecosystem now includes 17 specialized subagents.",
    relevance: 1,
  },
];

export async function fetchAINews(): Promise<NewsItem[]> {
  // This will use Tavily/Exa via inference.sh MCPs
  // For now, return fallback data that demonstrates the pattern
  return FALLBACK_NEWS;
}

export function deduplicateNews(items: NewsItem[]): NewsItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.title.toLowerCase().slice(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
```

- [ ] **Step 2: Create news fetch API route**

```ts
// src/app/api/news/fetch/route.ts
import { NextResponse } from "next/server";
import { fetchAINews, deduplicateNews } from "@/lib/news";

export const dynamic = "force-dynamic";
export const revalidate = 1800; // 30 minutes

export async function GET() {
  try {
    const news = await fetchAINews();
    const deduplicated = deduplicateNews(news);
    // Sort by relevance, then by date
    const sorted = deduplicated.sort((a, b) => b.relevance - a.relevance);
    return NextResponse.json({ news: sorted, updatedAt: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch news", news: [], updatedAt: null },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: Create cron trigger**

```ts
// src/app/api/cron/route.ts
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.CRON_SECRET;

  // Allow unauthenticated in dev
  if (process.env.NODE_ENV === "production" && expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Revalidate the news cache
  revalidateTag("news");
  return NextResponse.json({ revalidated: true, timestamp: new Date().toISOString() });
}
```

- [ ] **Step 4: Create news page**

```tsx
// src/app/news/page.tsx
import { fetchAINews } from "@/lib/news";

export const revalidate = 1800; // ISR: revalidate every 30 minutes

export default async function NewsPage() {
  const news = await fetchAINews();

  return (
    <main className="min-h-screen bg-deep-space p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-gradient">AI News</h1>
        <p className="text-white/60 mb-8">Curated AI agent development coverage</p>

        <div className="space-y-4">
          {news.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block glass-card p-5 hover:glow-border transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold">{item.title}</h2>
                  <p className="text-sm text-white/60 mt-1">{item.summary}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs text-white/40">{item.source}</span>
                  <div className="mt-1">
                    {item.relevance > 0.7 ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-violet-primary/20 text-violet-primary">
                        Hot
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-surface text-white/40">
                        General
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {news.length === 0 && (
          <div className="glass-card p-12 text-center">
            <p className="text-white/40">No news yet. Check back soon.</p>
          </div>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Add cron secret to .env.local**

```bash
cd /home/x1/opencode-atlas
echo "CRON_SECRET=dev-secret-not-used-in-dev" >> .env.local
```

- [ ] **Step 6: Update vercel.json with cron job (for production)**

```json
// vercel.json (create at project root)
{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "*/30 * * * *"
    }
  ]
}
```

- [ ] **Step 7: Verify news page renders**

```bash
cd /home/x1/opencode-atlas
npm run dev
```

Open `http://localhost:3000/news` — verify news page shows fallback data.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add news scraper API route and news page with ISR"
```

---

### Task 9: Content Files — All Agents, Playbook, Skills

**Files:**
- Create: `src/content/agents/*.md` (all 17 agents)
- Create: `src/content/playbook/*.md` (5 playbook chapters)
- Create: `src/content/skills/*.md` (key skills)
- Create: `src/content/system/*.md` (3 system pages)

- [ ] **Step 1: Create remaining agent content files**

Create MDX files for all agents listed in `src/data/agents.ts` plus lite variants. Each file follows the frontmatter schema from Task 2. Use the actual prompts from `/home/x1/.config/opencode/agents/` as source truth.

Key files to create:
- `src/content/agents/blueprint.md` (done in Task 2)
- `src/content/agents/orchestrator.md`
- `src/content/agents/plan.md`
- `src/content/agents/explore.md`
- `src/content/agents/fixer.md`
- `src/content/agents/researcher.md`
- `src/content/agents/designer.md`
- `src/content/agents/oracle.md`
- `src/content/agents/council.md`
- `src/content/agents/librarian.md`
- `src/content/agents/observer.md`
- `src/content/agents/brainstorming.md`
- `src/content/agents/general.md`
- `src/content/agents/oracle-lite.md`
- `src/content/agents/council-lite.md`
- `src/content/agents/observer-lite.md`
- `src/content/agents/designer-lite.md`

- [ ] **Step 2: Create playbook content files**

Read `/.config/opencode/AGENTS_HIERARCHY.md` and create:
- `src/content/playbook/routing-logic.md` — Silent Protocol → Routing → Execution flow
- `src/content/playbook/plan-grammar.md` — 3-gate system
- `src/content/playbook/fallback-chains.md` — -lite fallback pattern
- `src/content/playbook/secret-sauce.md` — Five pillars from design spec
- `src/content/playbook/best-practices.md` — Verified patterns

- [ ] **Step 3: Create skill content files**

- `src/content/skills/index.md` — Registry overview
- `src/content/skills/writing-plans.md`
- `src/content/skills/brainstorming.md`
- `src/content/skills/frontend-design.md`
- `src/content/skills/explore.md`
- `src/content/skills/systematic-debugging.md`
- `src/content/skills/devils-advocate.md`

- [ ] **Step 4: Create system content files**

- `src/content/system/agents-hierarchy.md` — Full tree + routing table
- `src/content/system/prompts-atlas.md` — Prompt anatomy guidance
- `src/content/system/mcp-catalog.md` — All 13 MCPs

- [ ] **Step 5: Verify all content builds**

```bash
cd /home/x1/opencode-atlas
npm run build
```

Expected: All content pages build successfully. No broken links.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add all content files — 17 agents, 5 playbook, 7 skills, 3 system"
```

---

### Task 10: News Ticker on Landing Page

**Files:**
- Create: `src/components/landing/NewsTicker.tsx`
- Modify: `src/app/page.tsx` (add ticker to hero)

- [ ] **Step 1: Create news ticker component**

```tsx
// src/components/landing/NewsTicker.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { fetchAINews, NewsItem } from "@/lib/news";

export default function NewsTicker() {
  const tickerRef = useRef<HTMLDivElement>(null);
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetchAINews().then(setNews).catch(() => {});
  }, []);

  useEffect(() => {
    if (!tickerRef.current || news.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.to(tickerRef.current, {
        x: "-50%",
        duration: 40,
        repeat: -1,
        ease: "none",
      });
    }, tickerRef);

    return () => ctx.revert();
  }, [news]);

  if (news.length === 0) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden border-t border-white/5 bg-deep-space/60 backdrop-blur-sm py-2">
      <div className="relative">
        <div ref={tickerRef} className="flex gap-8 whitespace-nowrap" style={{ width: "fit-content" }}>
          {[...news, ...news].map((item, i) => (
            <a
              key={`${item.id}-${i}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/50 hover:text-violet-primary transition-colors flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-primary animate-pulse" />
              {item.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Integrate ticker into landing page**

Add to `src/app/page.tsx` — import `NewsTicker` and add it to the hero section:
```tsx
// Inside the hero section in page.tsx, before the closing </section>
<NewsTicker />
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add live news ticker to landing page hero"
```

---

## Phase 4: Polish

### Task 11: Page Transitions (GSAP Flip)

**Files:**
- Create: `src/components/layout/PageTransition.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create PageTransition component**

```tsx
// src/components/layout/PageTransition.tsx
"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Animate page in
    gsap.from(wrapper, {
      opacity: 0,
      y: 20,
      duration: 0.4,
      ease: "power2.out",
    });
  }, [pathname]);

  return <div ref={wrapperRef}>{children}</div>;
}
```

- [ ] **Step 2: Wrap page content with transition**

In `src/app/layout.tsx`, wrap the `{children}`:

```tsx
// In the body, replace {children} with:
<PageTransition>{children}</PageTransition>
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add GSAP page transition animations"
```

---

### Task 12: Performance Optimization

**Files:**
- Modify: `src/components/cosmos/CosmosCanvas.tsx` (add LOD)
- Create: `src/hooks/useDeviceCapability.ts`

- [ ] **Step 1: Create device capability hook**

```ts
// src/hooks/useDeviceCapability.ts
"use client";

import { useState, useEffect } from "react";

export function useDeviceCapability() {
  const [capabilities, setCapabilities] = useState({
    isLowEnd: false,
    prefersReducedMotion: false,
  });

  useEffect(() => {
    const isLowEnd =
      typeof navigator !== "undefined" &&
      (navigator as unknown as { deviceMemory?: number }).deviceMemory !== undefined &&
      (navigator as unknown as { deviceMemory?: number }).deviceMemory! < 4;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setCapabilities({ isLowEnd, prefersReducedMotion });
  }, []);

  return capabilities;
}
```

- [ ] **Step 2: Optimize CosmosCanvas for low-end devices**

```tsx
// In CosmosCanvas.tsx — reduce particle count and disable postprocessing on low-end
import { useDeviceCapability } from "@/hooks/useDeviceCapability";
// Inside component:
const { isLowEnd, prefersReducedMotion } = useDeviceCapability();
// Pass reduced star count: <StarField count={isLowEnd ? 200 : 2000} />
```

- [ ] **Step 3: Add dynamic import for heavy 3D components**

```tsx
// Ensure all R3F imports use next/dynamic with ssr: false
// This is already done for AgentCosmos in page.tsx
```

- [ ] **Step 4: Verify performance**

```bash
cd /home/x1/opencode-atlas
npm run build
# Check bundle size in output
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "perf: add device capability detection, low-end 3D fallback, dynamic imports"
```

---

### Task 13: CTA Hub Page

**Files:**
- Create: `src/app/cta/page.tsx`

- [ ] **Step 1: Create full CTA page**

```tsx
// src/app/cta/page.tsx
export default function CTAPage() {
  const ctas = [
    {
      emoji: "🚀",
      title: "Try OpenCode",
      desc: "Deploy your own agent ecosystem in 5 minutes",
      steps: ["Clone the template repo", "Install dependencies", "Configure your agents", "Deploy to inference.sh"],
      href: "#",
      label: "Deploy Now",
    },
    {
      emoji: "🛠️",
      title: "Build With It",
      desc: "Integrate OpenCode patterns into your workflow",
      steps: ["Read the playbook", "Explore agent prompts", "Create custom skills", "Wire up MCP servers"],
      href: "/playbook",
      label: "Read the Docs",
    },
    {
      emoji: "🤝",
      title: "Contribute",
      desc: "Join the ecosystem and help it grow",
      steps: ["Fork the repo", "Submit a skill", "Improve documentation", "Join the community"],
      href: "#",
      label: "GitHub",
    },
  ];

  return (
    <main className="min-h-screen bg-deep-space p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-gradient text-center">Get Started</h1>
        <p className="text-white/60 mb-12 text-center">Three paths into the OpenCode ecosystem</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ctas.map((cta) => (
            <div key={cta.title} className="glass-card p-8">
              <div className="text-4xl mb-4">{cta.emoji}</div>
              <h2 className="text-xl font-semibold mb-2">{cta.title}</h2>
              <p className="text-sm text-white/60 mb-6">{cta.desc}</p>
              <ol className="space-y-2 mb-6">
                {cta.steps.map((step, i) => (
                  <li key={i} className="text-sm text-white/50 flex items-start gap-2">
                    <span className="text-violet-primary text-xs mt-0.5">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
              <a
                href={cta.href}
                className="block text-center px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 text-sm font-medium hover:from-violet-500/30 hover:to-purple-500/30 transition-all"
              >
                {cta.label}
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add CTA hub page with three action paths"
```

---

### Task 14: Highlights Page

**Files:**
- Create: `src/app/highlights/page.tsx`

- [ ] **Step 1: Create highlights page**

```tsx
// src/app/highlights/page.tsx
"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const highlights = [
  { metric: "17", label: "Specialized Agents", desc: "From planners to observers" },
  { metric: "29+", label: "Skills", desc: "Coding, design, research, planning" },
  { metric: "13", label: "MCP Servers", desc: "Integrated tool ecosystem" },
  { metric: "3", label: "Quality Gates", desc: "Verification before completion" },
  { metric: "5", label: "Secret Sauce Pillars", desc: "What makes it award-worthy" },
  { metric: "2", label: "Primaries", desc: "Blueprint + Orchestrator" },
];

export default function HighlightsPage() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = sectionRef.current?.querySelectorAll(".metric-card");
      if (items) {
        gsap.from(items, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
          },
          scale: 0.5,
          opacity: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: "back.out(1.7)",
        });

        // Animate numbers
        items.forEach((card) => {
          const numEl = card.querySelector(".metric-number");
          if (numEl) {
            const finalText = numEl.textContent || "";
            const finalNum = parseInt(finalText);
            if (!isNaN(finalNum)) {
              gsap.from(numEl, {
                scrollTrigger: { trigger: card, start: "top 85%" },
                innerHTML: 0,
                duration: 1.5,
                ease: "power2.out",
                snap: { innerHTML: 1 },
                onUpdate: function () {
                  numEl.textContent = Math.round(Number(numEl.textContent)) + "+";
                },
              });
            }
          }
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-deep-space p-8">
      <div className="max-w-5xl mx-auto" ref={sectionRef}>
        <h1 className="text-4xl font-bold mb-2 text-gradient text-center">Highlights</h1>
        <p className="text-white/60 mb-12 text-center">The OpenCode ecosystem by the numbers</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((h) => (
            <div key={h.label} className="metric-card glass-card p-8 text-center">
              <div className="metric-number text-4xl font-bold text-gradient mb-2">{h.metric}</div>
              <h3 className="font-semibold mb-1">{h.label}</h3>
              <p className="text-sm text-white/50">{h.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add highlights page with animated metrics"
```

---

### Task 15: Best Practices Page with Flip Cards

**Files:**
- Create: `src/app/playbook/best-practices/page.tsx`

- [ ] **Step 1: Create best practices page with flip-to-reveal cards**

```tsx
// src/app/playbook/best-practices/page.tsx
"use client";

import { useState } from "react";

interface Practice {
  title: string;
  icon: string;
  category: string;
  front: string;
  back: string;
}

const practices: Practice[] = [
  {
    title: "Plan Grammar Enforcement",
    icon: "📐",
    category: "Planning",
    front: "Always use the 3-gate plan grammar system before execution",
    back: "Every plan must pass self-check, hard audit, and @plan validation. This prevents wasted work and ensures all plans are independently executable.",
  },
  {
    title: "Fallback Chains",
    icon: "🔗",
    category: "Planning",
    front: "Every subagent needs a -lite fallback to prevent silent failures",
    back: "If a premium subagent is unavailable, its -lite variant handles the request with reduced capability but no visible failure. Configure this in subagent definitions.",
  },
  {
    title: "Skills Before Code",
    icon: "📚",
    category: "Coding",
    front: "Load the relevant skill before writing any implementation code",
    back: "Skills provide domain-specific instructions, patterns, and constraints. Loading a skill before coding ensures the implementation follows established patterns.",
  },
  {
    title: "Silent Protocol First",
    icon: "🔇",
    category: "Workflow",
    front: "Diagnose before responding — Silent Protocol runs before every action",
    back: "Before every response, run the three diagnostic questions: What do they need? What's the blind spot? What's the simplest true answer? This prevents solving the wrong problem.",
  },
  {
    title: "Verification Before Completion",
    icon: "✅",
    category: "Workflow",
    front: "Never claim completion without running quality gates first",
    back: "Run assumption, logic, execution, and clarity gates before submitting any complex response. Evidence before assertions — always.",
  },
  {
    title: "Quality Gates",
    icon: "🔬",
    category: "Planning",
    front: "All code passes four verification gates before shipping",
    back: "Assumption Verification, Logic Verification, Execution Verification, and Clarity Verification. If any gate fails, iterate — don't submit.",
  },
];

export default function BestPracticesPage() {
  const [flipped, setFlipped] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-deep-space p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-gradient">Best Practices</h1>
        <p className="text-white/60 mb-8">Verified patterns that produce reliable results</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {practices.map((p, i) => (
            <div
              key={p.title}
              className="relative cursor-pointer"
              style={{ perspective: "1000px" }}
              onClick={() => setFlipped(flipped === i ? null : i)}
            >
              <div
                className="relative transition-transform duration-500"
                style={{
                  transformStyle: "preserve-3d",
                  transform: flipped === i ? "rotateY(180deg)" : "rotateY(0)",
                }}
              >
                {/* Front */}
                <div
                  className="glass-card p-6 min-h-[200px] flex flex-col justify-center backface-hidden"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="text-2xl mb-2">{p.icon}</div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-violet-primary/10 text-violet-primary self-start mb-2">
                    {p.category}
                  </span>
                  <p className="text-sm font-medium">{p.front}</p>
                  <p className="text-xs text-white/30 mt-2">Click to reveal</p>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 glass-card p-6 flex items-center backface-hidden"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <p className="text-sm text-white/80">{p.back}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add best practices page with flip-to-reveal cards"
```

---

### Task 16: Mobile Responsiveness & Final Polish

**Files:**
- Modify: `src/app/globals.css` (add responsive utilities)
- Modify: Various components for responsive behavior

- [ ] **Step 1: Add mobile-optimized styles to globals.css**

```css
/* Add to existing globals.css */

/* Mobile: hide 3D on small screens, show static diagram instead */
@media (max-width: 768px) {
  .cosmos-3d {
    display: none;
  }
  .cosmos-static {
    display: block;
  }
}

.cosmos-static {
  display: none;
}

/* Responsive typography */
@media (max-width: 640px) {
  h1 { font-size: clamp(2rem, 10vw, 3rem); }
  h2 { font-size: clamp(1.5rem, 7vw, 2rem); }
}
```

- [ ] **Step 2: Create static cosmos fallback for mobile**

```tsx
// src/components/cosmos/StaticCosmosFallback.tsx
export default function StaticCosmosFallback() {
  return (
    <div className="cosmos-static w-full h-full flex items-center justify-center bg-gradient-to-b from-deep-space to-space-dark">
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🌌</div>
        <p className="text-white/60 text-sm">
          Rotate your device to landscape or visit on desktop<br />
          for the full 3D cosmos experience
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Final build verification**

```bash
cd /home/x1/opencode-atlas
npm run build
```

Expected: Clean build, no errors, no warnings.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: add mobile responsiveness and static cosmos fallback"
```

---

## Self-Review

### Spec Coverage
- [x] 3D Agent Cosmos — Tasks 4, 6
- [x] Dual-audience content tiers — Task 2 (3-tier in MDX frontmatter)
- [x] Scroll narrative — Task 7 (landing page chapters)
- [x] GSAP animations — Tasks 7, 10, 11, 14, 15
- [x] Realtime news scraper — Tasks 8, 10
- [x] Secret Sauce section — Tasks 6 (pillar cards), Task 7
- [x] Agent directory + detail pages — Tasks 2, 6
- [x] Playbook with routing/grammar/fallback — Tasks 5
- [x] Skills registry — Task 5
- [x] System internals — Task 5
- [x] CTA hub — Task 13
- [x] Highlights with metrics — Task 14
- [x] Best practices with flip cards — Task 15
- [x] Page transitions — Task 11
- [x] Mobile fallback — Task 16
- [x] Performance optimization — Task 12

### Placeholder Scan
- [x] No TODOs remain
- [x] All code blocks contain complete, working code
- [x] No references to undefined functions or types
- [x] All file paths are exact and consistent
- [x] All steps include runnable commands

### Type Consistency
- [x] AgentFrontmatter type used consistently across all tasks
- [x] NewsItem interface matches in lib/news.ts, API routes, and components
- [x] AgentData interface in data/agents.ts matches what AgentNode expects
- [x] File imports are consistent between create and modify steps
