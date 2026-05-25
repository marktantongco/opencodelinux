# PLATFORM GUIDE — Gemini

> Part of the Mark System Prompt — Platform-Specific Deployment Guide
> Target: Gemini (Web, API, Studio)
> Version: 1.0

---

## SYSTEM PROMPT LOADING

### Gemini (Web)
Gemini does NOT have a native system prompt field. Use prompt prefixing:

```
[SYSTEM INSTRUCTIONS — Apply to all responses]

[Paste the core prompt here]

---

[USER MESSAGE]
Your actual question here
```

### Gemini API (Programmatic)
```python
import google.generativeai as genai

genai.configure(api_key="YOUR_API_KEY")
model = genai.GenerativeModel("gemini-2.5-pro")

response = model.generate_content(
    contents=[
        {"role": "user", "parts": [load_file("MARK_SYSTEM_PROMPT_FINAL.md") + "\n\n" + user_message]}
    ],
    system_instruction=load_file("MARK_SYSTEM_PROMPT_FINAL.md")  # If supported
)
```

### Gemini Studio
1. Open aistudio.google.com
2. Create a new prompt
3. Paste the core prompt as the system instruction
4. Save as a template

---

## CAPABILITY MATRIX — Gemini-Specific

| Feature | Gemini Web | Gemini API |
|---------|-----------|------------|
| System Prompt | ⚠️ Prompt prefix only | ✅ system_instruction |
| Extended Thinking | ✅ Built-in reasoning | ✅ Built-in |
| Subagent Spawning | ❌ No native | ❌ No native |
| Token Awareness | ⚠️ Partial | ✅ API response |
| File Operations | ⚠️ Code execution | ⚠️ Code execution |
| Code Execution | ⚠️ Limited | ⚠️ Limited |
| Web Search | ✅ Google Search | ✅ Google Search |
| Context Window | 1M-2M tokens | 1M-2M tokens |

---

## GEMINI-SPECIFIC CONSIDERATIONS

### Massive Context Window
Gemini supports 1M-2M token context windows. The 6.5k token threshold is meaningless here — the system prompt is less than 1% of available context. You can load ALL skills simultaneously without budget concerns.

### Design Bias
Gemini has a Material Design aesthetic bias:
- Material Design color palettes
- Roboto typography
- Card-based layouts
- Subtle shadows and elevation

**Countermeasure:** SKILL_02's Anti-Defaults protocol should detect and opt out of Material Design defaults.

### Built-in Reasoning
Gemini has built-in reasoning capabilities. No separate "extended thinking" toggle needed. The model automatically applies deeper reasoning to complex prompts.

### Subagent Limitation
Gemini does NOT support native subagent spawning. SKILL_04 serves as a WORKFLOW PLANNER — it decomposes tasks and creates execution plans, but the user must manually orchestrate each step.

---

## VERIFICATION TEST — Gemini-Specific

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
| Free | ⚠️ Prompt prefix | ✅ Built-in | ❌ No |
| Advanced | ⚠️ Prompt prefix | ✅ Built-in | ❌ No |
| API (Free tier) | ✅ system_instruction | ✅ Built-in | ❌ No |
| API (Paid) | ✅ system_instruction | ✅ Built-in | ❌ No |

---

## TROUBLESHOOTING — Gemini-Specific

### System Instructions Not Applied (Web)
1. Gemini Web doesn't have a system prompt field
2. Use prompt prefixing: paste instructions before every message
3. Consider using Gemini API for proper system_instruction support

### Model Forgets Instructions Mid-Conversation
1. Gemini's massive context window means it rarely forgets
2. If it does, re-state: "Remember your loaded instructions"
3. For long conversations, periodically reference the system prompt

### Over-Reasoning on Simple Tasks
1. Gemini applies reasoning automatically
2. For simple tasks, prefix with: "Quick answer, no deep reasoning needed:"
3. This signals the model to respond directly

---

## END OF GEMINI PLATFORM GUIDE
