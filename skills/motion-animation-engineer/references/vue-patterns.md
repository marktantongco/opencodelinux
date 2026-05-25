# Motion for Vue Patterns

## Vue 3 Composition API Setup
```vue
<script setup>
import { motion } from "motion/vue";

// Use motion components directly in template
</script>

<template>
  <motion.div
    :initial="{ opacity: 0, y: 20 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.5 }"
  >
    Content
  </motion.div>
</template>
```

## Variants in Vue
```vue
<script setup>
import { motion } from "motion/vue";

const containerVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      type: "spring", 
      stiffness: 300,
      delayChildren: 0.2,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};
</script>

<template>
  <motion.div 
    :variants="containerVariants"
    initial="hidden"
    animate="visible"
  >
    <motion.div 
      v-for="item in items" 
      :key="item.id"
      :variants="itemVariants"
    >
      {{ item.text }}
    </motion.div>
  </motion.div>
</template>
```

## Gestures in Vue
```vue
<script setup>
import { motion } from "motion/vue";

const scale = ref(1);

function handleTap() {
  scale.value = 0.95;
  setTimeout(() => { scale.value = 1; }, 100);
}
</script>

<template>
  <motion.div 
    :style="{ transform: `scale(${scale})` }"
    @tap="handleTap"
    whileTap="{ scale: 0.95 }"
  >
    Tap me
  </motion.div>
</template>
```

## Layout Animations in Vue
```vue
<script setup>
import { motion, LayoutGroup } from "motion/vue";

const items = ref([
  { id: 1, text: "First" },
  { id: 2, text: "Second" },
  { id: 3, text: "Third" }
]);

function reorderItems(newOrder) {
  items.value = newOrder.map(id => 
    items.value.find(item => item.id === id)
  );
}
</script>

<template>
  <LayoutGroup>
    <motion.div
      v-for="item in items"
      :key="item.id"
      layout
      layoutId={`item-${item.id}`}
      transition="{ type: 'spring', stiffness: 300 }"
    >
      {{ item.text }}
    </motion.div>
  </LayoutGroup>
</template>
```

## Scroll Integration in Vue
```vue
<script setup>
import { motion, useScroll, useTransform } from "motion/vue";

const { scrollYProgress } = useScroll();
const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
</script>

<template>
  <motion.div 
    :style="{ opacity }"
  >
    Fades in and out with scroll
  </motion.div>
</template>
```

## Presence Animation in Vue
```vue
<script setup>
import { motion, AnimatePresence } from "motion/vue";
import { ref } from "vue";

const isVisible = ref(false);
</script>

<template>
  <AnimatePresence>
    <motion.div
      v-if="isVisible"
      key="modal"
      initial="{ opacity: 0, scale: 0.95 }"
      animate="{ opacity: 1, scale: 1 }"
      exit="{ opacity: 0, scale: 0.95 }"
    >
      Modal Content
    </motion.div>
  </AnimatePresence>
</template>
```

## Best Practices for Vue
1. **Use motion/vue import** - Not motion/react or motion.dom
2. **Leverage Vue reactivity** - Combine motion props with ref/reactive for dynamic values
3. **Respect Vue lifecycle** - Motion handles mount/unmount, but Vue-specific logic goes in setup
4. **Combine with Pinia/Vuex** - Store animation state in state management when needed
5. **Test on mobile** - Vue motion works great with touch gestures