---
name: gsap-animation-engineer
description: >
  Expert-level imperative animation engineering using GSAP (v3.13+, GreenSock) for cinematic web animations, scroll-driven storytelling,
  complex timeline orchestration, SVG morphing, text reveals, and advanced sequencing. Use when the user needs ScrollTrigger,
  SplitText, MorphSVG, DrawSVG, MotionPath, Flip, ScrollSmoother, timeline sequences, or any framework-agnostic animation.
  Also trigger for GSAP, GreenSock, scroll animation, pin/scrub effects, text character animation,
  SVG path drawing, Webflow interactions, marketing site animation, page transition sequences, or when the user says "complex animation timeline."
  Trigger for vanilla JS animation, React GSAP integration (@gsap/react), Vue/Svelte/Angular animation, or Webflow custom code.
  Combat under-triggering: activate for scroll effects, text reveals, or SVG animation even if GSAP is not named.
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

# GSAP Animation Engineer

## When This Skill Activates
Activate when the task involves:
- Scroll-triggered or scroll-scrubbed animations
- Multi-step timeline sequences with precise offsets
- Text character, word, or line reveals
- SVG shape morphing, path drawing, or motion along path
- Layout state transitions (FLIP)
- Smooth scrolling with scroll-linked effects
- Webflow-native or embedded custom animation
- Framework-agnostic animation (vanilla, React, Vue, Svelte)

## Core Principles
1. **Timelines are the unit of work.** Favor `gsap.timeline()` over individual tweens. Timelines provide sequencing, labels, and nested control that scales with complexity.
2. **Kill what you create.** GSAP instances persist in memory unless cleaned. Always call `.kill()` on timelines and `ScrollTrigger.kill()` on triggers when components unmount or pages change.
3. **Plugins are free but explicit.** Since April 2025, all plugins are free. Import them explicitly to enable tree-shaking and register them with `gsap.registerPlugin()`.

## Workflow

### Step 1: Register Plugins
Always register before use. Import only what you need.

```js
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);
```

### Step 2: Build the Timeline
Create a timeline for any sequence with more than one tween.

```js
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".section",
    start: "top center",
    end: "bottom center",
    scrub: 1,
    pin: true
  }
});

tl.from(".headline", { y: 50, opacity: 0, duration: 1 })
  .from(".subhead", { y: 30, opacity: 0 }, "-=0.5")
  .from(".cta", { scale: 0.9, opacity: 0 }, "<0.2");
```

Use relative offsets (`"-=0.5"`, `"<<0.2"`) and labels (`"start"`) for maintainable sequencing.

### Step 3: Animate Text with SplitText
SplitText is rewritten in v3.13 — 50% smaller, accessible, responsive.

```js
const split = new SplitText(".quote", { type: "words,lines", linesClass: "line++" });

gsap.from(split.words, {
  yPercent: 100,
  opacity: 0,
  stagger: 0.05,
  duration: 0.8,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".quote",
    start: "top 80%"
  }
});
```

**Accessibility:** SplitText automatically adds `aria-label` to the original element and `aria-hidden` to split fragments. Use `autoSplit: true` for responsive re-splitting on resize.

### Step 4: Handle Scroll with ScrollTrigger
Master the three core patterns:

| Pattern | Config | Use Case |
|---|---|---|
| **Reveal** | `start: "top 80%"`, no scrub | Standard viewport entry |
| **Scrub** | `scrub: true` or `scrub: 1` | Direct scroll linkage |
| **Pin** | `pin: true` | Fix element during scroll range |

Use ` anticipatePin: 1` to prevent jitter on pinned elements.

### Step 5: Use Flip for Layout Transitions
Capture state before DOM change, then animate to new state.

```js
const state = Flip.getState(".grid-item");

// ... change layout (filter, sort, responsive reflow)

Flip.from(state, {
  duration: 0.6,
  ease: "power2.inOut",
  stagger: 0.05
});
```

### Step 6: Integrate with React
Use the official `@gsap/react` package. The `useGSAP()` hook handles cleanup automatically.

```jsx
import { useGSAP } from "@gsap/react";

function Hero() {
  const container = useRef();
  
  useGSAP(() => {
    gsap.from(".hero-title", { y: 100, opacity: 0, duration: 1 });
  }, { scope: container });
  
  return <div ref={container}>...</div>;
}
```

**Critical:** `useGSAP()` kills animations on unmount. For manual control, store timeline in `useRef` and call `.kill()` in `useEffect` cleanup.

### Step 7: Mobile & Web Optimization
- **Mobile:** Test ScrollTrigger pin on iOS Safari (address bar height changes). Use `ScrollSmoother` for iOS-style lerp scrolling. Keep touch targets 44px+ when using `Draggable`.
- **Web:** Use `gsap.context()` for scoped cleanup. Batch ScrollTrigger refresh with `ScrollTrigger.batch()` for large lists.
- **Accessibility:** Check `prefers-reduced-motion`. If true, set `gsap.globalTimeline.timeScale(0)` or skip animation setup.

```js
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (prefersReduced) {
  gsap.globalTimeline.timeScale(0);
}
```

## Output Format

### Vanilla JS Timeline Template
```js
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function initHeroAnimation() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "+=500",
      scrub: 1,
      pin: true
    }
  });

  tl.to(".hero-bg", { scale: 1.2, duration: 1 })
    .from(".hero-title", { y: 100, opacity: 0 }, "<")
    .from(".hero-cta", { scale: 0.8, opacity: 0 }, "-=0.3");

  return () => {
    tl.kill();
    ScrollTrigger.getAll().forEach(t => t.kill());
  };
}
```

### React Component Template
```jsx
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollSection() {
  const sectionRef = useRef();
  
  useGSAP(() => {
    gsap.from(".item", {
      y: 50,
      opacity: 0,
      stagger: 0.1,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%"
      }
    });
  }, { scope: sectionRef });

  return <section ref={sectionRef}>...</section>;
}
```

## Examples

### Example 1: Scroll-Linked Hero
**Input:** User wants a hero that pins and fades out as user scrolls.
**Output:** `gsap.timeline()` with `scrollTrigger: { pin: true, scrub: 1 }`. Animate opacity and y of text elements.

### Example 2: Text Reveal on Scroll
**Input:** User wants a headline to reveal word by word.
**Output:** `SplitText` with `type: "words"`, `gsap.from()` with `stagger: 0.05`, linked to `ScrollTrigger` at `start: "top 80%"`.

### Example 3: SVG Logo Morph
**Input:** User wants one logo shape to morph into another on hover.
**Output:** `MorphSVG` plugin with `gsap.to("#shape1", { morphSVG: "#shape2", duration: 0.6 })`.

## Anti-Patterns

### ❌ Don't: Forget to kill timelines on unmount
```js
// Bad: memory leak in SPAs
useEffect(() => { gsap.to(...); }, []);
```
### ✅ Do: Use useGSAP or manual cleanup
```js
// Good: automatic cleanup
useGSAP(() => { gsap.to(...); }, { scope: ref });
```

### ❌ Don't: Animate non-accelerated properties in scroll
```js
// Bad: layout thrashing during scroll
gsap.to(".box", { width: 300, scrollTrigger: { scrub: true } });
```
### ✅ Do: Use transforms only for scrubbed animations
```js
// Good: GPU-composited
gsap.to(".box", { scaleX: 1.5, scrollTrigger: { scrub: true } });
```

### ❌ Don't: Register plugins in every file
Register once in your app entry point or a dedicated `gsap-config.js`.

## Tool Usage
- Use `Read` to inspect existing animation setup and DOM structure.
- Use `Write` to create `gsap-config.js` or timeline modules.
- Use `Edit` to add ScrollTrigger to existing tweens.
- Use `Bash` to check GSAP version (`npm ls gsap`) or run build.

## Integration & Synergy
- **With Motion:** Use GSAP for scroll/text/SVG layers; let Motion handle UI overlays. See `animation-hybrid-architect` skill.
- **With Lenis:** Pair `ScrollSmoother` or Lenis for smooth scroll; integrate via `ScrollTrigger.scrollerProxy`.
- **With Webflow:** Use native "Interactions with GSAP" in Designer for no-code; embed custom GSAP for advanced plugins.
- **With Barba.js:** Orchestrate page exit/enter timelines during route transitions.
- **With Three.js / WebGL:** Animate Canvas objects directly via GSAP; no DOM overhead.

## References
- `references/plugin-catalog.md` — Full plugin feature matrix: ScrollTrigger, SplitText, MorphSVG, DrawSVG, MotionPath, Flip, ScrollSmoother, Observer, Draggable, Inertia
- `references/scroll-patterns.md` — Pin, scrub, parallax, horizontal scroll, batch refresh strategies
- `references/webflow-integration.md` — Native Interactions setup, custom embed patterns, CDN loading
- `references/react-cleanup.md` — useGSAP deep dive, gsap.context(), manual kill patterns
- `references/mobile-optimization.md` — iOS pin fixes, touch tuning, responsive re-splitting