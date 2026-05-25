# PLATFORM GUIDE — ChatGPT

> Part of the Mark System Prompt — Platform-Specific Deployment Guide
> Target: ChatGPT (Web, App, API)
> Version: 1.0

---

## SYSTEM PROMPT LOADING

### ChatGPT (Web/App)
1. Open chatgpt.com
2. Go to Settings → Custom Instructions
3. Paste the core prompt into "What would you like ChatGPT to know about you to provide better responses?"
4. Save

### ChatGPT API (Programmatic)
```python
from openai import OpenAI

client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": load_file("MARK_SYSTEM_PROMPT_FINAL.md")},
        {"role": "user", "content": "Hello"}
    ]
)
```

### ChatGPT Plus (o-series models)
```python
# For o1/o3 models with reasoning
response = client.chat.completions.create(
    model="o3",
    reasoning_effort="high",  # or "medium", "low"
    messages=[
        {"role": "system", "content": load_file("MARK_SYSTEM_PROMPT_FINAL.md")},
        {"role": "user", "content": "Complex problem here"}
    ]
)
```

---

## CAPABILITY MATRIX — ChatGPT-Specific

| Feature | ChatGPT Web | ChatGPT API |
|---------|------------|-------------|
| System Prompt | ✅ Custom Instructions | ✅ system role |
| Extended Thinking | ✅ o1/o3 reasoning | ✅ reasoning_effort |
| Subagent Spawning | ❌ No native | ❌ No native |
| Token Awareness | ⚠️ Partial | ✅ API response |
| File Operations | ⚠️ Code Interpreter | ❌ No |
| Code Execution | ⚠️ Code Interpreter | ❌ No |
| Web Search | ✅ Browse | ⚠️ Depends |
| Context Window | 128K tokens | 128K-200K tokens |

---

## CHATGPT-SPECIFIC CONSIDERATIONS

### Design Bias
GPT models have a different aesthetic bias than Claude:
- Blue color schemes
- Sans-serif typography (system fonts)
- Clean, corporate aesthetic
- Grid-based layouts

**Countermeasure:** SKILL_02's Anti-Defaults protocol should detect and opt out of GPT defaults too.

### Reasoning Deployment
- GPT-4o: No extended thinking. Fast responses.
- o1/o3: Extended reasoning built-in. Use `reasoning_effort` parameter.
- For the Mark System: Use GPT-4o for tactical tasks, o3 for strategic/complex work.

### Token Budget
- Safe threshold: Keep system prompt under 6,500 tokens (5% of 128K context)
- ChatGPT doesn't show token count in the web interface — estimate externally

### Subagent Limitation
ChatGPT does NOT support native subagent spawning. SKILL_04 serves as a WORKFLOW PLANNER — it decomposes tasks and creates execution plans, but the user must manually orchestrate each step.

---

## VERIFICATION TEST — ChatGPT-Specific

Send this test message after loading the prompt:

```
"Confirm you've loaded the Universal Router system. State your core identity in one sentence."
```

**Expected response:**
> "Zero fluff. Working output > explanation. Alignment > execution."

---

## PRICING

| Plan | System Prompt Support | Reasoning | Subagents |
|------|----------------------|-----------|-----------|
| Free | ❌ No | ❌ No | ❌ No |
| Plus | ✅ Custom Instructions | ⚠️ Limited | ❌ No |
| Pro | ✅ Custom Instructions | ✅ o1/o3 | ❌ No |
| API | ✅ system role | ✅ reasoning_effort | ❌ No |

---

## TROUBLESHOOTING — ChatGPT-Specific

### Custom Instructions Not Applied
1. Verify you saved in Settings → Custom Instructions
2. Start a NEW conversation (custom instructions apply to new chats only)
3. Check that your plan supports custom instructions (Plus/Pro required)

### Model Ignores System Prompt
1. GPT models sometimes prioritize recent conversation over system prompt
2. Reinforce with: "Remember your loaded instructions. Apply them now."
3. For API: Ensure system message is the FIRST message in the array

### Overthinking on Simple Tasks (o-series)
1. Use GPT-4o for simple tasks, o3 only for complex work
2. Set `reasoning_effort: "low"` for tactical questions
3. Add explicit instruction: "Use minimal reasoning for factual questions"

---

## END OF CHATGPT PLATFORM GUIDE
