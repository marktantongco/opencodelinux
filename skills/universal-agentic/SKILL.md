---
name: universal-agentic
description: "SKILL_04: Agentic mode for the Universal Router system. Use when automating complex workflows, spawning subagents, orchestrating parallel tasks, or long-horizon autonomous work. Activates task decomposition, state management, and failure recovery patterns."

expects:
- key: input
  type: string
  description: Input content or instructions
provides:
- key: output
  type: string
  description: Generated output
---

# 🤖 SKILL_04: AGENTIC
## Universal Router — Autonomous Orchestration Mode

**Status:** ✅ Production Ready  
**Architecture:** Part of Universal Router system (loaded alongside AGENTS.md)  
**When to load:** Automating complex workflows, spawning subagents, orchestrating parallel tasks, long-horizon autonomous work  
**Reasoning depth:** deep (large reasoning budget required)  
**Depth-seeking:** Built-in (adaptive thinking for coordination)  
**Cross-reference:** `AGENTS.md` for Silent Protocol + Routing + Closing Structure

---

## LOADING INSTRUCTION

When this skill loads, announce the switch via CONTINUITY PROTOCOL:

> "Switching to Agentic mode — I've noted your [prior context]. I'll now orchestrate the full workflow: [summary]. Here's the plan..."

Then apply ALL sections below.

---

## CORE PRINCIPLE

**Break complexity into subagents. Coordinate autonomously. Fail gracefully.**

Agentic work:
- Identifies what can be done in parallel
- Spawns subagents for independent tasks
- Tracks state across subagents
- Aggregates results
- Recovers from failures
- Reports back with clarity

---

## TONE ADAPTATION (Agentic-Specific)

- **Plan first, execute second.** Show the workflow before running it.
- **State tracking explicit.** Report state at each step. "Here's what we've done, here's what's next."
- **Failure recovery clear.** When something breaks, say why and what we're doing about it.
- **Task decomposition visible.** Show how work is split across agents.
- **Confidence calibrated.** "This will work if X. If X fails, we do Y."

---

## TASK DECOMPOSITION

**Before spawning any subagent, map the workflow:**

```
TASK DECOMPOSITION TEMPLATE

Main goal: [What are we building/automating?]

Independent tasks (can run in parallel):
  Task 1: [Specific, bounded work]
    - Input: [What does this task need?]
    - Output: [What does it produce?]
    - Subagent role: [Search / Write / Code / Design / Validate]
    - Failure mode: [What if this fails?]
    - Recovery: [How do we recover?]

  Task 2: [Another independent task]
    - Input: [...]
    - Output: [...]

Dependent tasks (require output from earlier tasks):
  Task 3: [Work that depends on Tasks 1 + 2]
    - Requires: [Output from Task 1 + Task 2]

Aggregation:
  [How do we combine results from all subagents?]
  [Who validates the final output?]

Success criteria:
  [What does success look like?]
  [How do we measure it?]
```

---

## SUBAGENT ORCHESTRATION PATTERNS

### Pattern 1: Parallel Independent Tasks
**Use when:** Multiple tasks have no dependencies. All can run at once.
```
Subagent A: Search market + competitors
Subagent B: Write product copy
Subagent C: Code React components
→ Parallelize: All 3 run concurrently
→ Aggregate: Combine results
```

### Pattern 2: Sequential Dependent Tasks
**Use when:** Task B requires output from Task A.
```
Subagent A: Fetch data from source
  ↓ (wait for output)
Subagent B: Validate data quality
  ↓ (wait for valid dataset)
Subagent C: Process and transform
→ Validate at each step before proceeding
```

### Pattern 3: Map-Reduce (Parallel + Aggregation)
**Use when:** Same task on many items, then combine.
```
Subagent A: Analyze product 1
Subagent B: Analyze product 2
...
Subagent N: Analyze product N
→ Parallelize: All run concurrently
→ Aggregate: Combine into unified output
```

### Pattern 4: Decision Tree (Conditional Spawning)
**Use when:** What happens next depends on earlier results.
```
Subagent A: Identify root cause
  → If "simple error": Subagent B1: Fix and test
  → If "architectural": Subagent B2: Redesign
  → If "unknown": Subagent B3: Deep debug
```

---

## STATE MANAGEMENT

**State must be explicit, visible, and recoverable.**

```javascript
{
  workflow_id: "unique_id",
  status: "in_progress", // [pending, in_progress, completed, failed]
  
  tasks: {
    task_1: {
      name: "Search competitors",
      status: "completed",
      output: { analysis: {...} },
      error: null,
      subagent_id: "agent_a_1234"
    },
    task_2: {
      name: "Write copy",
      status: "in_progress",
      output: null,
      error: null,
      subagent_id: "agent_b_5678"
    }
  },
  
  dependencies: {
    task_3: ["task_1"],
    task_4: ["task_1", "task_2"]
  },
  
  logs: [
    { timestamp: "...", event: "workflow_started" },
    { timestamp: "...", event: "task_1_completed", duration: "25s" }
  ]
}
```

### Reporting State

At each major step, report:

```
WORKFLOW STATE REPORT
┌─────────────────────────────────────────┐
│ Workflow: [Name]                        │
│ Status: [in_progress/completed/failed]  │
└─────────────────────────────────────────┘

TASKS
✓ Task 1 (Search): Completed in 25s → Output summary

⧖ Task 2 (Write): In progress (5m 20s elapsed)

⏳ Task 3 (Code): Waiting for Task 1

NEXT STEPS
→ When Task 2 completes, start Task 4
→ Aggregate all outputs → Validate → Return

RISKS
⚠️ If Task 2 takes >30min, suggest manual review
```

---

## FAILURE RECOVERY

**Anticipate failures. Have recovery paths.**

```
Task fails? → Try 3 times, then escalate
  Failure 1: Retry after 5 seconds
  Failure 2: Retry after 15 seconds
  Failure 3: Escalate to user with error details

Dependency missing? → Report clearly and stop
  "Task 3 requires output from Task 1, which failed.
   Options: 1. Fix Task 1 and retry  2. Skip Task 3  3. Manual intervention"

Timeout? → Don't hang. Report and offer options
  "Task 2 has been running for 30 minutes (expected: 5 min).
   Options: 1. Keep waiting  2. Cancel and skip  3. Report partial results"

Data validation fails? → Show what's wrong, offer fix
  "Task 1 output failed validation. Expected [X], got [Y].
   Options: 1. Retry with different approach  2. Provide corrected data  3. Skip"
```

### Recovery Action Plan

```
IF task_fails:
  retry_count = 0
  MAX_RETRIES = 3
  WHILE retry_count < MAX_RETRIES:
    retry_count += 1
    Wait (retry_count * 5 seconds)
    Try task again
    IF succeeds: Continue
    ELSE IF retry_count == MAX_RETRIES:
      Report failure
      Check: Can we skip?
        IF optional: Skip and continue
        ELSE: Stop workflow, ask for manual help
```

---

## MCP SERVER ROUTING

| Server | Use Case | Example |
|--------|----------|---------|
| websearch | Find current info | Search latest market trends |
| Fetch | Get web content | Extract page data |
| Filesystem | Read/write files | Save results to disk |
| Memory | Persistent state | Store workflow context |
| Sequential Thinking | Complex reasoning | Multi-step analysis |

### Routing Rules

```
IF task is "research/search":            Use: websearch + Fetch
IF task is "document/create artifact":   Use: Filesystem (write)
IF task is "analyze/reason":             Use: Sequential Thinking
IF task is "persist state":              Use: Memory
IF task is "code/create":                Use: Filesystem + bash tools
```

---

## SKILL BOUNDARY

When work crosses into:
- **Single task (not orchestration):** Fall back to `universal-code` or `universal-design`
- **Quick question/discussion:** Fall back to conversational mode (AGENTS.md base)
- **Pure design without automation:** Suggest loading `universal-design`

---

## CLOSING PATTERN (Agentic)

Apply the ⚡⚡ Recommended Next Step / ✨ 3 Suggestions / 🔗 Hidden Assumption structure from AGENTS.md with strategic/agentic-specific language.

---

## STATUS

**Token estimate:** ~2,800 tokens (combined with AGENTS.md: ~6,100 total)
**Dependencies:** AGENTS.md (Universal Router core)
**Deployment:** Load on demand via skill system when autonomous orchestration is needed

---

## MODEL TIER ADAPTATION

This skill is designed for **Tier 1 (Frontier) models only**. Agentic orchestration requires strong instruction-following, multi-step reasoning, and state tracking across parallel tasks.

**If you are a Tier 2 (Balanced) model:**
- Use only Pattern 1 (Parallel Independent) and Pattern 2 (Sequential Dependent)
- 🔄 Skip Pattern 3 (Map-Reduce) and Pattern 4 (Decision Tree) — too complex to coordinate
- 🔄 Simplify State Management to tracking just: status (running/done/failed) + current output
- 🔄 Reduce MAX_RETRIES from 3 to 1
- 🔄 Skip the MCP Server Routing section — just describe what tool would be needed
- **Fallback:** If the task is too complex for a single response, suggest the user break it into smaller requests

**If you are a Tier 3 (Compact) model:**
- DO NOT load this skill automatically
- 🔄 Fall back to SKILL_01 (Conversational) and suggest the task needs a more capable model
- 🔄 Optionally decompose the task into actionable chunks the user can execute step by step
- **Core behavior:** "This task requires multi-step orchestration that I can't reliably execute. Here's a plan you can follow manually."
