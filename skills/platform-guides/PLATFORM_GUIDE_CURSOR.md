# PLATFORM GUIDE — Cursor

> Part of the Mark System Prompt — Platform-Specific Deployment Guide
> Target: Cursor IDE
> Version: 1.0

---

## SYSTEM PROMPT LOADING

### Project-Level (.cursorrules)
```bash
# Create .cursorrules in project root
cat > /path/to/project/.cursorrules << 'EOF'
[Paste the core prompt here]
EOF
```

### Global Settings
1. Open Cursor Settings (Cmd/Ctrl + ,)
2. Go to "Rules for AI"
3. Paste the core prompt
4. Save

### Cursor Agent Mode
```
# In Cursor's agent mode, the .cursorrules file is automatically loaded
# for all AI interactions within that project
```

---

## CAPABILITY MATRIX — Cursor-Specific

| Feature | Cursor |
|---------|--------|
| System Prompt | ✅ .cursorrules / Rules for AI |
| Extended Thinking | ⚠️ Depends on model |
| Subagent Spawning | ⚠️ Limited (Agent mode) |
| Token Awareness | ⚠️ Partial |
| File Operations | ✅ Native (IDE integration) |
| Code Execution | ✅ Native (terminal integration) |
| Web Search | ⚠️ Limited |
| Context Window | Depends on model |
| Codebase Awareness | ✅ Native (indexes project) |

---

## CURSOR-SPECIFIC CONSIDERATIONS

### Codebase Awareness
Cursor automatically indexes your project's codebase. This means:
- SKILL_03's "check existing patterns" is partially automated
- The model already knows your codebase structure
- Research-first gate is partially satisfied by Cursor's indexing

### Design Bias
Cursor's default model (typically Claude or GPT) carries that model's aesthetic bias. See the respective platform guide for countermeasures.

### Agent Mode
Cursor's Agent mode provides limited subagent-like capabilities:
- Can read and edit multiple files
- Can run terminal commands
- Can search the codebase
- But cannot spawn true parallel subagents

### Subagent Limitation
Cursor does NOT support native subagent spawning in the traditional sense. SKILL_04 serves as a WORKFLOW PLANNER — it decomposes tasks and creates execution plans, but the user must manually orchestrate each step.

---

## VERIFICATION TEST — Cursor-Specific

Open Cursor in your project and send:

```
"Confirm you've loaded the Universal Router system. State your core identity in one sentence."
```

**Expected response:**
> "Zero fluff. Working output > explanation. Alignment > execution."

---

## TROUBLESHOOTING — Cursor-Specific

### .cursorrules Not Applied
1. Verify file is in project root (not a subdirectory)
2. Check file name is exactly `.cursorrules` (no extension)
3. Restart Cursor or reload the window
4. Verify Agent mode is enabled

### Model Ignores Rules
1. Cursor sometimes prioritizes codebase context over rules
2. Reinforce with: "Apply your loaded rules to this task"
3. For critical instructions, repeat them in the conversation

### Codebase Index Out of Date
1. Cursor's index may be stale after large changes
2. Trigger re-index: Cmd/Ctrl + Shift + P → "Cursor: Rebuild Codebase Index"
3. Wait for indexing to complete before asking questions

---

## END OF CURSOR PLATFORM GUIDE
