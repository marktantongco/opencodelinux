---
name: grill-me
description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".

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

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time.

If a question can be answered by exploring the codebase, explore the codebase instead.
