# Motion Performance Budgets

## Bundle Sizes (gzipped, v12)
| Import | Size | Use Case |
|---|---|---|
| `motion/animate` | 2.6KB | Simple tweens, mini interactions |
| `motion/react` (core) | ~18KB | Components, variants, gestures |
| `motion/react` (full) | ~59KB | Layout, scroll, AnimatePresence |
| `motion/vue` | ~59KB | Full Vue feature parity |
| `motion/dom` | ~18KB | Vanilla JS projects |

## Tree-Shaking
Motion uses modern ESM. Only imported features are bundled.
- Import `motion/react` for React
- Import `motion/vue` for Vue  
- Import `motion/animate` for vanilla mini API

## LazyMotion Strategy
```jsx
import { LazyMotion, domAnimation, domMax } from "motion/react";

// Minimal features: no layout, no drag
<<LazyMotion features={domAnimation}>
  <App />
</LazyMotion>

// Maximum features: layout, drag, gestures
<<LazyMotion features={domMax}>
  <App />
</LazyMotion>
```

## 5KB Runtime Strategy (Ultra-Strict)
For v8.1.0 Design OS constraints:
1. Use `motion/animate` (2.6KB) for state-change micro-interactions
2. Use CSS `transition` for hover/focus states (0KB JS)
3. Avoid `AnimatePresence`, `layout`, and `useSpring` in initial runtime
4. Lazy-load full Motion only after user interaction or route change
5. Never load GSAP in the 5KB runtime phase