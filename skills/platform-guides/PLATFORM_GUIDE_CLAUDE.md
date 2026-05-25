# PLATFORM GUIDE — Claude.ai

> Part of the Mark System Prompt — Platform-Specific Deployment Guide
> Target: Claude.ai (Web, App, API, Code)
> Version: 1.0

---

## SYSTEM PROMPT LOADING

### Claude.ai (Web)
1. Open claude.ai in browser
2. Go to Settings → Custom Instructions
3. Paste the core prompt into the system field
4. Save

### Claude.ai (App)
1. Open Settings
2. Find "System" or "Custom Instructions"
3. Paste the prompt
4. Save and restart conversation

### Claude Code (CLI)
```bash
# Pass as system prompt parameter
opencode --system "$(cat MARK_SYSTEM_PROMPT_FINAL.md)"
```

### Claude API (Programmatic)
```python
import anthropic

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-opus-4-20260515",
    system=load_file("MARK_SYSTEM_PROMPT_FINAL.md"),
    messages=[{"role": "user", "content": "Hello"}]
)
```

---

## CAPABILITY MATRIX — Claude-Specific

| Feature | Claude.ai Web | Claude Code | Claude API |
|---------|--------------|-------------|------------|
| System Prompt | ✅ Custom Instructions | ✅ --system flag | ✅ system parameter |
| Extended Thinking | ✅ Native | ✅ Native | ✅ thinking parameter |
| Subagent Spawning | ❌ Manual only | ⚠️ Limited | ❌ No native |
| Token Awareness | ✅ Shows count | ✅ Shows count | ✅ API response |
| File Operations | ❌ No | ✅ Native | ❌ No |
| Code Execution | ❌ No | ✅ Native | ❌ No |
| Web Search | ❌ No | ⚠️ Tool use | ❌ No |
| Context Window | 200K tokens | 200K tokens | 200K tokens |

---

## CLAUDE-SPECIFIC CONSIDERATIONS

### Design Bias
Claude models have a known aesthetic bias:
- Warm cream/off-white backgrounds (~#F4F1EA)
- Serif display typography (Georgia, Playfair)
- Minimalist, warm aesthetic
- Generous whitespace, organic shapes

**Countermeasure:** SKILL_02's Anti-Defaults protocol explicitly opts out of these.

### Extended Thinking
Claude supports extended thinking for complex reasoning:
- Use for: Novel problems, strategic decisions, first-principles work
- Don't use for: Factual questions, tactical answers, quick clarifications
- Adds latency — deploy intentionally

### Token Budget
- Safe threshold: Keep system prompt under 6,500 tokens (3% of 200K context)
- Claude shows token count in the interface — use it to verify

### Subagent Limitation
Claude.ai does NOT support native subagent spawning. SKILL_04 serves as a WORKFLOW PLANNER on Claude — it decomposes tasks and creates execution plans, but the user must manually orchestrate each step by creating new conversations.

---

## VERIFICATION TEST — Claude-Specific

Send this test message after loading the prompt:

```
"Acknowledge that you've loaded the Universal Router system.
Confirm the core identity in exactly one sentence."
```

**Expected response:**
> "Zero fluff. Working output > explanation. Alignment > execution."

Or a close variant capturing all three principles.

**If you get:**
- Expected response → System loaded correctly
- Generic Claude response → System prompt didn't load. Check paste location.
- Partial response → Only part of prompt loaded. Check file wasn't truncated.

---

## PRICING

| Plan | System Prompt Support | Extended Thinking | Subagents |
|------|----------------------|-------------------|-----------|
| Free | ❌ No | ❌ No | ❌ No |
| Pro | ✅ Custom Instructions | ✅ Yes | ❌ No |
| Team | ✅ Custom Instructions | ✅ Yes | ❌ No |
| API | ✅ system parameter | ✅ thinking param | ❌ No |

---

## TROUBLESHOOTING — Claude-Specific

### System Prompt Fails to Load
1. Verify you pasted into the system field, not the conversation
2. Check that you have Pro/Team plan (required for custom system prompts)
3. Clear the system field completely, paste slowly, save
4. Test with verification message

### Routing Always Defaults to Conversational
1. Make routing explicit: "When I say 'I'm building a React component,' you should explicitly state: 'Switching to SKILL_02 (Design mode)'"
2. If still broken, simplify: remove SKILL_04, keep only SKILL_01/02/03

### Overthinking on Simple Tasks
1. Add: "Do NOT use extended thinking for factual questions, tactical answers, or quick clarifications"
2. Change effort guidance for conversational: "effort = low for factual, high for strategic"
3. If still slow, remove CONTINUITY PROTOCOL (adds overhead)

---

## END OF CLAUDE PLATFORM GUIDE
