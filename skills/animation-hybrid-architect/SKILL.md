---
name: animation-hybrid-architect
description: >
  Architect hybrid animation stacks combining Motion (ex-Framer Motion) and GSAP for React/Vue/Next.js projects requiring both
  UI micro-interactions and cinematic scroll/content animations. Use when the user wants to use Framer Motion with GSAP,
  Motion plus GreenSock, combine declarative and imperative animation, or split animation responsibilities across libraries.
  Also trigger for animation architecture, animation stack selection, animation bundle optimization, cross-library animation integration,
  React animation performance, marketing site with React UI, or when the user asks "should I use Framer Motion or GSAP" or
  "how do I combine Motion and GSAP." Trigger for animation skillset design, animation MCP tools, or when the user needs
  animation decision matrices, cleanup protocols, or shared reduced-motion handlers across multiple libraries.
  Combat under-triggering: if the project has both UI components and scroll storytelling, activate this skill.
allowed-tools:
  - Read
  - Write
  - Bash
  - Edit
  - Grep
  - Glob
user-invocable: true

expects:
- key: context
  type: string
  description: Current context and state information
- key: input
  type: string
  description: Input data or content to process
provides:
- key: output
  type: string
  description: Processed output or result
- key: report
  type: string
  description: Summary or report of what was done
---

# Animation Hybrid Architect

## When This Skill Activates
Activate when the task involves:
- Choosing between Motion and GSAP (or combining both)
- Integrating Motion UI with GSAP scroll/timeline layers
- Defining animation boundaries in a multi-library project
- Optimizing animation bundles and performance budgets
- Establishing shared animation utilities (reduced motion, cleanup, easing)
- Building animation skillsets or MCP tool definitions for teams

## Core Principles
1. **Boundary by concern, not by page.** Motion owns the UI layer (modals, drawers, buttons, gestures, layout shifts). GSAP owns the content layer (scroll sequences, text reveals, SVG morphs, hero timelines). They coexist in the same viewport but never animate the same element simultaneously.
2. **Cleanup is architecture.** GSAP instances must be killed; Motion components unmount automatically. A shared cleanup protocol prevents memory leaks in SPAs.
3. **Bundle budget is the constraint.** The combination must stay under performance targets. For ultra-strict runtimes (e.g., 5KB initial), use Motion mini only and lazy-load GSAP. Load GSAP plugins on-demand; use Motion's mini API for non-critical paths.

## Workflow

### Step 1: Assess Project Needs
Run this decision matrix:

| Factor | Motion Only | GSAP Only | Hybrid |
|---|---|---|---|
| React/Vue UI-heavy | ✅ | ⚠️ | ✅ |
| Complex scroll storytelling | ⚠️ | ✅ | ✅ |
| SVG morph / path drawing | ❌ | ✅ | ✅ |
| Exit animations (unmount) | ✅ | ❌ | ✅ |
| Drag/gesture interactions | ✅ | ⚠️ | ✅ |
| Webflow / no-code | ❌ | ✅ | ❌ |
| Strict mobile bundle (<30KB) | ✅ | ⚠️ | ❌ |
| Ultra-strict runtime (≤5KB) | ✅ (mini) | ❌ | ❌ |
| Cross-framework (non-React) | ❌ | ✅ | ❌ |

**Rule:** If two or more "Hybrid" columns apply, use both libraries with clear boundaries.

### Step 2: Define the Boundary
Map responsibilities explicitly:

**Motion Layer (UI):**
- Modal, drawer, popover enter/exit (`AnimatePresence`)
- Button/card hover and tap feedback (`whileHover`, `whileTap`)
- Drag-to-reorder, swipeable lists (`drag`, `Reorder`)
- Layout reflow on resize or filter (`layout`, `layoutId`)
- Page transitions in Next.js/Remix
- Spring-based cursor followers (`useSpring`)

**GSAP Layer (Content):**
- Hero timeline sequences (`gsap.timeline()`)
- Scroll-triggered section reveals (`ScrollTrigger`)
- Text character/word animations (`SplitText`)
- SVG logo morphs or path draws (`MorphSVG`, `DrawSVG`)
- Smooth scroll wrapper (`ScrollSmoother`)
- Complex staggered orchestration with labels

**No-Go Zone:** Never run GSAP tweens and Motion `animate` props on the same DOM node simultaneously. Choose one driver per element.

### Step 3: Set Up Shared Infrastructure

#### A. Reduced Motion Handler
Create a universal hook/utility used by both libraries.

```jsx
// hooks/useReducedMotion.js
import { useReducedMotion as useMotionReduced } from "motion/react";
import { useEffect, useState } from "react";

export function useReducedMotion() {
  const motionReduced = useMotionReduced();
  const [mediaReduced, setMediaReduced] = useState(false);
  
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setMediaReduced(mql.matches);
    const handler = (e) => setMediaReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  
  return motionReduced || mediaReduced;
}
```

Apply to Motion via `transition` props. Apply to GSAP by setting `gsap.globalTimeline.timeScale(0)` or skipping setup.

#### B. Cleanup Protocol
Standardize unmount behavior:

```jsx
// In React components using GSAP
useGSAP(() => {
  // create animations
}, { scope: ref });

// In React components using Motion
// Automatic cleanup on unmount — no manual action needed

// In shared page transition wrappers
useEffect(() => {
  return () => {
    // Emergency: kill all orphaned GSAP instances
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.globalTimeline.clear();
  };
}, []);
```

#### C. Easing Dictionary
Align perceived physics by mapping Motion springs to GSAP eases:

| Motion | GSAP Equivalent | Use Case |
|---|---|---|
| `type: "spring", stiffness: 300, damping: 30` | `ease: "power2.out"` | UI feedback |
| `type: "spring", stiffness: 100, damping: 10` | `ease: "elastic.out(1, 0.5)"` | Playful bounce |
| `transition: { duration: 0.3 }` | `duration: 0.3, ease: "power2.inOut"` | Standard transition |

### Step 4: Optimize Bundles

**Target Budgets:**
- Motion UI layer: <60KB gzipped (full) or <18KB (core) or <3KB (mini)
- GSAP content layer: load plugins on-demand via dynamic imports
- Total animation budget: <100KB gzipped for initial load
- **Ultra-strict runtime (5KB):** Motion mini (`animate()`, 2.6KB) + CSS transitions. Exclude GSAP from initial runtime entirely; load only after user interaction.

**Code Splitting Pattern:**
```jsx
// Lazy-load GSAP scroll features only on landing pages
const ScrollSection = lazy(() => import("./ScrollSection"));

// ScrollSection.jsx
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
```

**Motion Lazy Loading:**
```jsx
import { LazyMotion, domAnimation } from "motion/react";

<<LazyMotion features={domAnimation}>
  <App />
</LazyMotion>
```

### Step 5: Mobile & Web Strategy

**Mobile:**
- Use Motion mini (`animate()`) for touch feedback to keep bundle minimal.
- GSAP ScrollTrigger pin can conflict with mobile address bars. Test on iOS Safari.
- Use `Observer` plugin instead of native scroll listeners for unified touch/wheel input.
- Target 60fps on low-end Android by limiting simultaneous tweens to <20.

**Web:**
- Use `ScrollSmoother` or Lenis for desktop smooth scrolling.
- GSAP `batch()` for large grids to avoid creating hundreds of ScrollTriggers.
- Motion `useInView` with `once: true` for static reveals to reduce active listeners.

### Step 6: Integration Patterns

#### Pattern A: Motion UI + GSAP Hero
```jsx
// Layout.jsx — Motion handles navigation and page transitions
<<AnimatePresence mode="wait">
  <motion.div key={router.route}>...</motion.div>
</AnimatePresence>

// Hero.jsx — GSAP handles the cinematic intro
useGSAP(() => {
  const tl = gsap.timeline();
  tl.from(".hero-title", { y: 100, opacity: 0 })
    .from(".hero-bg", { scale: 1.2 }, "<");
});
```

#### Pattern B: Motion Modal over GSAP Page
```jsx
// Page scroll is driven by GSAP ScrollTrigger
// Modal opens via Motion AnimatePresence
// Modal has `drag` and `layout` — Motion territory
// Underlying page scroll is paused via Lenis.stop() while modal is open
```

#### Pattern C: Shared Reduced Motion
Both libraries read from the same `useReducedMotion()` hook. Motion transitions become instant; GSAP timelines are skipped.

### Step 7: Validation & Audit Hooks
For projects with recurring audit pipelines (e.g., v8.1.0 Design OS), expose these checks:

```js
// scripts/audit-animation.js
export function auditAnimation() {
  return {
    motionBundleSize: checkMotionImports(),   // warn if >60KB
    gsapPluginCount: countGSAPPlugins(),      // warn if >3 plugins loaded sync
    orphanedTriggers: ScrollTrigger.getAll().length, // must be 0 on idle routes
    reducedMotionHandler: hasSharedReducedMotion(), // boolean
    sameElementConflict: detectMixedDrivers()   // scans for motion + gsap on one node
  };
}
```

## Output Format

### Hybrid Project Structure
```
src/
├── components/
│   ├── ui/                 # Motion-only: buttons, cards, modals
│   └── content/            # GSAP-only: heroes, text reveals, SVG
├── hooks/
│   ├── useReducedMotion.js # Shared across both libraries
│   └── useGSAPCleanup.js   # Standardized kill protocol
├── lib/
│   ├── motion-config.js    # LazyMotion features, variants
│   └── gsap-config.js     # Plugin registration, defaults
└── pages/
    └── landing/
        ├── Hero.jsx        # GSAP timeline
        ├── Features.jsx    # GSAP ScrollTrigger + SplitText
        └── Nav.jsx         # Motion layout + gestures
```

### Decision Log Template
```markdown
## Animation Stack Decision
- **Project:** [Name]
- **Framework:** [React/Vue/Next/Webflow]
- **Motion used for:** [UI layer list]
- **GSAP used for:** [Content layer list]
- **Bundle budget:** [X KB]
- **Mobile target:** [Yes/No]
- **Accessibility:** Shared useReducedMotion hook
- **Cleanup protocol:** useGSAP + global kill on route change
- **Audit hook:** scripts/audit-animation.js registered
```

## Examples

### Example 1: Next.js Marketing Site
**Input:** User needs a React marketing site with animated UI and scroll storytelling.
**Output:** Motion for Nav + CTAs + modals. GSAP for hero timeline + feature scroll reveals + SplitText quotes. Shared `useReducedMotion`. Lenis for smooth scroll. GSAP cleanup in `_app.js` unmount.

### Example 2: Mobile PWA with One Scroll Section
**Input:** User has a React PWA that needs one fancy scroll onboarding.
**Output:** Motion mini for all UI. Dynamic import of GSAP + ScrollTrigger only for the onboarding route. Total animation budget <40KB initial.

### Example 3: Webflow + Embedded React
**Input:** User builds in Webflow but embeds a React calculator with animations.
**Output:** GSAP handles all Webflow page animations natively. Motion handles the embedded React widget's UI state. No direct integration needed; separate scopes.

## Anti-Patterns

### ❌ Don't: Animate the same element with both libraries
```jsx
// Bad: conflicting drivers
<motion.div animate={{ x: 100 }} ref={el => gsap.to(el, { x: 200 })} />
```
### ✅ Do: Assign clear ownership per element
```jsx
// Good: Motion owns the card, GSAP owns the text inside
<motion.div layout>
  <div className="gsap-text">...</div>
</motion.div>
```

### ❌ Don't: Load all GSAP plugins upfront in a SPA
```js
// Bad: 80KB+ initial bundle
import * as plugins from "gsap/all";
```
### ✅ Do: Dynamic import by route
```js
// Good: load only when needed
const { ScrollTrigger } = await import("gsap/ScrollTrigger");
```

### ❌ Don't: Ignore cleanup in hybrid apps
GSAP timelines accumulate if not killed. Motion doesn't leak but GSAP does. Always pair GSAP usage with a cleanup protocol.

## Tool Usage
- Use `Read` to audit existing animation libraries and component boundaries.
- Use `Write` to create `gsap-config.js`, `motion-config.js`, and shared hooks.
- Use `Edit` to split mixed animation files into Motion-only and GSAP-only components.
- Use `Bash` to run bundle analyzer (`npx vite-bundle-visualizer`) and verify budget.

## MCP Tool Exposure
If exposing this skill as an MCP server, register these tools:
- `select_animation_stack` — Returns Motion/GSAP/Hybrid recommendation based on framework and complexity.
- `generate_motion_component` — Emits Motion JSX with variants and accessibility.
- `generate_gsap_timeline` — Emits GSAP timeline code with plugin registration and cleanup.
- `audit_animation_bundle` — Checks bundle size and suggests splitting.
- `create_cleanup_protocol` — Generates shared hooks and kill routines.

## References
- `references/stack-patterns.md` — 10+ combination patterns (SaaS, editorial, e-commerce, PWA)
- `references/bundle-budgets.md` — Size targets, dynamic import recipes, 5KB runtime strategy
- `references/cleanup-protocols.md` — Memory leak prevention, SPA route change handling
- `references/mobile-optimization.md` — 60fps targets, iOS pin fixes, low-end Android tuning
- `references/mcp-schema.md` — Full MCP tool JSON schema for animation tooling