---
name: zoom-out
description: Tell the agent to zoom out and give broader context or a higher-level perspective. Use when you're unfamiliar with a section of code or need to understand how it fits into the bigger picture.
disable-model-invocation: true

expects:
- key: query
  type: string
  description: Research question or search query
provides:
- key: findings
  type: string
  description: Research findings and analysis
- key: references
  type: array
  description: List of references or sources
---

I don't know this area of code well. Go up a layer of abstraction. Give me a map of all the relevant modules and callers, using the project's domain glossary vocabulary.
