---
name: motion-animation-engineer
description: >
  Expert-level declarative animation engineering using Motion (v12, formerly Framer Motion) for React, Vue, and vanilla JS.
  Use when the user needs UI transitions, gesture-based interactions, layout animations, exit animations, spring physics,
  drag-and-drop components, scroll-linked effects, or component orchestration in React/Vue. Also trigger for Framer Motion,
  motion.dev, motion/react, motion/vue, AnimatePresence, layout animations, whileHover, whileTap, useSpring, useScroll,
  useMotionValue, or any declarative component animation. Trigger for mobile UI animation, PWA micro-interactions,
  modal/drawer transitions, list reordering, page transitions in Next.js/Remix, or when the user says "animate this React component."
  Combat under-triggering: if the user mentions React animation, component motion, or UI feedback, activate this skill even if they don't name the library.
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

# Motion Animation Engineer

## When This Skill Activates
Activate when the task involves:
- Declarative UI animation in React or Vue
- Component mount/unmount/exit transitions
- Gesture interactions (drag, hover, tap, pan)
- Layout shifts, responsive reflow, shared element transitions
- Scroll-driven or viewport-triggered component effects
- Spring physics, inertia, or motion values
- Mobile-optimized micro-interactions with strict bundle budgets

## Core Principles
1. **Declarative over imperative.** Let the component props drive state. Use `initial`, `animate`, `exit`, and `variants` so the animation state is readable from the JSX.
2. **Hardware acceleration only.** Animate `transform` and `opacity` whenever possible. Motion handles scale correction during layout animations automatically—trust it, but avoid animating `width`, `height`, `top`, `left`.
3. **Bundle is a feature.** Use `LazyMotion` + `domAnimation` or the `animate()` mini (2.6KB) for performance-critical paths. The full React package is ~59KB gzipped; the core is ~18KB. Only load what the viewport needs.

## Workflow

### Step 1: Select API Level
Choose the abstraction based on complexity and framework:

| Need | API | Import | Size |
|---|---|---|---|
| Simple tween | `animate()` mini | `motion/animate` | 2.6KB |
| React component | `motion` components | `motion/react` | ~18KB core |
| Full gestures + layout | `motion` + hooks | `motion/react` | ~59KB |
| Vue component | `motion` components | `motion/vue` | ~59KB |

**v12 Import Rule:** Use `motion/react`, not `framer-motion`. The old namespace still works but is deprecated.

### Step 2: Structure Variants
Define animation states as variant objects, not inline props. This enables orchestration, stagger, and reuse.

```jsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};
```

Apply with `variants={containerVariants}` on parent and child `motion` elements.

### Step 3: Handle Presence
For mount/unmount animations, wrap the component tree in `AnimatePresence` and give each child a unique `key`.

```jsx
<<AnimatePresence mode="wait">
  {isOpen && (
    <motion.div
      key="modal"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      {content}
    </motion.div>
  )}
</AnimatePresence>
```

Use `mode="wait"` to delay entering until exit completes. Use `mode="popLayout"` for list reordering.

### Step 4: Enable Layout Animations
For responsive reflow or drag-to-reorder, add the `layout` prop. For shared element transitions between routes or states, use `layoutId` with the same string on both source and target.

```jsx
<motion.div layout layoutId="card" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
```

Wrap related layout elements in `<LayoutGroup>` to scope measurements.

### Step 5: Add Gestures
Use gesture props directly on `motion` components:

- `whileHover={{ scale: 1.02 }}`
- `whileTap={{ scale: 0.98 }}`
- `drag="x"` or `drag` (both axes)
- `dragConstraints={{ left: 0, right: 0 }}`
- `dragElastic={0.2}`

For custom gesture logic, use `useMotionValue` and `useTransform` to create reactive chains.

### Step 6: Scroll Integration
Use hooks, not manual listeners:

```jsx
const { scrollYProgress } = useScroll();
const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
```

For viewport-triggered reveals, use `useInView` with `once: true` to fire once.

### Step 7: Optimize for Mobile & Web
- **Mobile:** Use `animate()` mini for essential micro-interactions. Avoid heavy blur/backdrop-filter animations. Test on low-end Android.
- **Web:** Use `LazyMotion` to split animation features by route. Defer non-critical variants.
- **Accessibility:** Always respect `prefers-reduced-motion`. Provide instant state changes when reduced motion is preferred.

```jsx
const prefersReducedMotion = useReducedMotion(); // from motion/react
const transition = prefersReducedMotion ? { duration: 0 } : { type: "spring" };
```

## Output Format

### React Component Template
```jsx
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

export function AnimatedComponent({ isVisible, children }) {
  const reduced = useReducedMotion();
  
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 300 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### Vue Component Template
```vue
<template>
  <Motion
    :initial="{ opacity: 0 }"
    :animate="{ opacity: 1 }"
    :transition="{ duration: 0.5 }"
  >
    <div>Content</div>
  </Motion>
</template>

<script setup>
import { Motion } from "motion/vue";
</script>
```

## Examples

### Example 1: Staggered List Entrance
**Input:** User wants a todo list to animate in on load.
**Output:** Parent with `staggerChildren` variant, children with `itemVariants`. Use `AnimatePresence` for item deletion.

### Example 2: Drag-to-Reorder
**Input:** User wants a sortable grid.
**Output:** Each item is `motion.div` with `layout` and `drag`. Parent uses `LayoutGroup`. Use `Reorder.Group` and `Reorder.Item` from Motion for simplified API.

### Example 3: Scroll-Linked Parallax
**Input:** User wants a hero image to scale as they scroll.
**Output:** `useScroll` + `useTransform` bound to `scale` and `y`. Apply to `motion.img`.

## Anti-Patterns

### ❌ Don't: Animate layout properties directly
```jsx
// Bad: triggers layout thrashing
<motion.div animate={{ width: open ? 300 : 100 }} />
```
### ✅ Do: Use layout animations or transforms
```jsx
// Good: GPU-accelerated, measured automatically
<motion.div layout style={{ width: open ? 300 : 100 }} />
```

### ❌ Don't: Forget AnimatePresence keys
Missing `key` causes exit animations to fail silently.

### ❌ Don't: Import from "framer-motion" in new projects
Use `motion/react` for v12+. The old package name is legacy.

## Tool Usage
- Use `Read` to inspect existing component files before adding animation.
- Use `Write` to create new animated components or `motion` wrappers.
- Use `Edit` to retrofit `AnimatePresence` or `layout` props into existing JSX.
- Use `Bash` to check bundle size via `npm ls motion` or build analyzer.

## Integration & Synergy
- **With GSAP:** Use Motion for UI layer (modals, drawers, gestures). Use GSAP for scroll sequences and text reveals. See `animation-hybrid-architect` skill for boundary protocols.
- **With Tailwind CSS:** Combine `className` utilities with `motion` props. No conflicts.
- **With React Three Fiber:** Use `framer-motion-3d` for 3D declarative animation.
- **With Next.js:** Wrap page components in `AnimatePresence` in `_app.js` or root layout for route transitions.

## References
- `references/react-patterns.md` — Advanced variants, orchestration, and Reorder API
- `references/vue-patterns.md` — Motion for Vue specifics, composable patterns
- `references/performance-budgets.md` — LazyMotion, mini API, bundle splitting strategies, 5KB runtime constraints
- `references/motion-plus.md` — Motion+ Carousel, Ticker, Cursor, AnimateNumber integration