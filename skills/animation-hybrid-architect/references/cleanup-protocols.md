# Animation Cleanup Protocols

## Memory Leak Prevention in Hybrid Apps

### Why Cleanup Matters
- GSAP instances persist in memory until explicitly killed
- Motion components clean up automatically on unmount
- In SPAs, uncleaned GSAP timelines accumulate with each route change
- ScrollTriggers and observers also need explicit cleanup

## Standardized Cleanup Patterns

### A. GSAP Timeline Cleanup (React)
```jsx
import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function AnimatedComponent() {
  const tlRef = useRef();
  
  // Using useGSAP (recommended - automatic cleanup)
  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(".item", { y: 50, opacity: 0, stagger: 0.1 });
    tlRef.current = tl; // Optional: keep reference for manual control
  }, { scope: containerRef });
  
  // Alternative: manual cleanup with useRef
  useEffect(() => {
    const tl = gsap.timeline();
    tl.from(".item", { y: 50, opacity: 0, stagger: 0.1 });
    
    return () => {
      tl.kill(); // Essential cleanup
      tlRef.current = null;
    };
  }, []);
  
  return <div ref={containerRef}>...</div>;
}
```

### B. ScrollTrigger Cleanup
```jsx
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrollSection() {
  useGSAP(() => {
    gsap.utils.toArray(".panel").forEach((panel) => {
      gsap.from(panel, {
        y: 100,
        opacity: 0,
        scrollTrigger: {
          trigger: panel,
          start: "top bottom",
          toggleActions: "play none none reverse"
        }
      });
    });
  });
  
  return <div className="scroll-section">...</div>;
}
```

### C. Observer Cleanup
```jsx
import { useGSAP } from "@gsap/react";
import { Observer } from "gsap/Observer";

export function GestureArea() {
  useGSAP(() => {
    Observer.create({
      target: ".gesture-area",
      type: "wheel,touch,pointer",
      preventDefault: true,
      onUp: () => /* handle swipe up */,
      onDown: () => /* handle swipe down */,
      onLeft: () => /* handle swipe left */,
      onRight: () => /* handle swipe right */
    });
  });
  
  return <div className="gesture-area">...</div>;
}
```

### D. Motion Automatic Cleanup
Motion handles cleanup automatically through React's unmount lifecycle:
```jsx
// No cleanup needed - Motion handles this automatically
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
/>
```

### E. Shared Cleanup Protocol for Hybrid Apps
Create a centralized cleanup utility:

```js
// utils/animationCleanup.js
export function cleanupAnimations() {
  // Kill all GSAP timelines
  gsap.globalTimeline.clear();
  
  // Kill all ScrollTriggers
  ScrollTrigger.getAll().forEach(t => t.kill());
  
  // Kill all Observers (if tracked)
  // Observer.getAll().forEach(o => o.kill()); // If you track them
  
  // Motion cleanup happens automatically via React unmount
}

// Usage in route change handlers:
import { cleanupAnimations } from "./utils/animationCleanup";

function App() {
  // In Next.js _app.js or React Router v6
  useEffect(() => {
    const handler = () => cleanupAnimations();
    window.addEventListener("routeChange", handler);
    return () => window.removeEventListener("routeChange", handler);
  }, []);
  
  return <Routes />;
}
```

## Validation Checks
For your audit pipeline, implement these checks:

```js
export function auditAnimationCleanup() {
  return {
    orphanedGSAPInstances: gsap.globalTimeline.getChildren().length,
    orphanedScrollTriggers: ScrollTrigger.getAll().length,
    hasSharedCleanupProtocol: !!window.cleanupAnimations, // If you expose it
    motionComponentsClean: true // Motion auto-cleans, so always true
  };
}
```

## Mobile-Specific Considerations
- On iOS, ScrollTrigger pin can cause issues with address bar showing/hiding
- Consider using `ScrollSmoother` instead of native ScrollTrigger pin on mobile
- Always test cleanup on real devices - emulators may not reveal timing issues

## Best Practices
1. **Always pair GSAP usage with cleanup** - Never create a timeline without a kill plan
2. **Use useGSAP() in React** - It handles cleanup automatically
3. **Centralize cleanup logic** - Make it easy to audit and modify
4. **Test in SPA scenarios** - Navigate between routes multiple times to check for accumulation
5. **Monitor memory in dev tools** - Use Chrome DevTools Memory panel to spot leaks