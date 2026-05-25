# Motion React Patterns

## Basic Component Animation
```jsx
import { motion } from "motion/react";

export function FadeIn() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      Content
    </motion.div>
  );
}
```

## Variants and Orchestration
```jsx
import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function StaggeredList({ items }) {
  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, index) => (
        <motion.li
          key={item.id}
          variants={itemVariants}
        >
          {item.text}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

## AnimatePresence for Exit Animations
```jsx
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

export function ToggleableModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="modal-content">
              <h2>Modal Title</h2>
              <p>Modal content goes here.</p>
              <button onClick={() => setIsOpen(false)}>Close</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

## Layout Animations and Shared Elements
```jsx
import { motion, LayoutGroup } from "motion/react";
import { useState } from "react";

export function ReorderableList() {
  const [items, setItems] = useState([
    { id: 1, text: "First item" },
    { id: 2, text: "Second item" },
    { id: 3, text: "Third item" }
  ]);
  
  const handleReorder = (newOrder) => {
    setItems(newOrder.map(id => 
      items.find(item => item.id === id)
    ));
  };
  
  return (
    <LayoutGroup>
      {items.map((item) => (
        <motion.div
          key={item.id}
          layout
          layoutId={`item-${item.id}`}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="card">
            <h3>{item.text}</h3>
          </div>
        </motion.div>
      ))}
    </LayoutGroup>
  );
}
```

## Gesture Interactions
```jsx
import { motion } from "motion/react";

export function InteractiveCard() {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="card-content">
        <h3>Drag Me Horizontally</h3>
        <p>Try dragging, tapping, or hovering!</p>
      </div>
    </motion.div>
  );
}
```

## Spring Physics
```jsx
import { motion, useSpring } from "motion/react";

export function SpringyButton() {
  const scale = useSpring({ stiffness: 300, damping: 20 });
  
  return (
    <motion.div
      style={{ transform: `scale(${scale})` }}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
    >
      <button>Springy Button</button>
    </motion.div>
  );
}
```

## Scroll Integration
```jsx
import { motion, useScroll, useTransform } from "motion/react";

export function ScrollLinkedAnimation() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 1.2, 1.2, 1]);
  
  return (
    <motion.div
      style={{ opacity, scale }}
    >
      Content that fades in/out and pulses with scroll
    </motion.div>
  );
}
```

## Viewport-Triggered Animations
```jsx
import { motion, useInView } from "motion/react";

export function OnScrollAnimation() {
  const ref = useRef();
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8 }}
    >
      Element that animates when it enters viewport
    </motion.div>
  );
}
```

## LazyMotion for Performance
```jsx
import { LazyMotion, domAnimation, domMax } from "motion/react";

// Minimal bundle for simple interactions
<<LazyMotion features={domAnimation}>
  <App />
</LazyMotion>

// Full features for complex apps
<<LazyMotion features={domMax}>
  <App />
</LazyMotion>
```

## Accessibility: Reduced Motion Support
```jsx
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

export function AccessibleModal() {
  const [isOpen, setIsOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  
  const transition = reducedMotion 
    ? { duration: 0 } 
    : { type: "spring", stiffness: 300, damping: 20 };
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isOpen ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={transition}
      >
        {isOpen && (
          <div className="modal-content">
            <h2>Modal Title</h2>
            <p>Modal content</p>
            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
        )}
      </motion.div>
    </>
  );
}
```

## Advanced: useMotionValue and useTransform
```jsx
import { motion, useMotionValue, useTransform } from "motion/react";

export function DragToScale() {
  const x = useMotionValue(0);
  const scale = useTransform(x, [-100, 0, 100], [0.5, 1, 1.5]);
  
  return (
    <motion.div
      draggable
      dragConstraints={{ left: -100, right: 100 }}
      style={{ x, scale }}
    >
      Drag to scale
    </motion.div>
  );
}
```