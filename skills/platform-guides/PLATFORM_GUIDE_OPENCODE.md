# PLATFORM GUIDE — OpenCode

> Part of the Mark System Prompt — Platform-Specific Deployment Guide
> Target: OpenCode (Terminal, IDE, Headless)
> Version: 1.0

---

## SYSTEM PROMPT LOADING

### Global Agent Configuration
```bash
# Create or edit AGENTS.md
cat > ~/.config/opencode/AGENTS.md << 'EOF'
[Paste the core prompt here]
EOF
```

### Project-Level Configuration
```bash
# Create or edit AGENTS.md in project root
cat > /path/to/project/AGENTS.md << 'EOF'
[Paste the core prompt here]
EOF
```

### opencode.json Configuration
```json
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "system": "~/.config/opencode/AGENTS.md"
  }
}
```

---

## CAPABILITY MATRIX — OpenCode-Specific

| Feature | OpenCode |
|---------|----------|
| System Prompt | ✅ AGENTS.md / opencode.json |
| Extended Thinking | ⚠️ Depends on model |
| Subagent Spawning | ✅ Native (with oh-my-opencode-slim) |
| Token Awareness | ⚠️ Varies by provider |
| File Operations | ✅ Native |
| Code Execution | ✅ Native (bash tool) |
| Web Search | ✅ Native (websearch tool) |
| MCP Support | ✅ Native (opencode.json mcp section) |
| Skills System | ✅ Native (.opencode/skills/) |
| Context Window | Depends on model |

---

## OPENCODE-SPECIFIC CONSIDERATIONS

### Real Subagent Support
Unlike Claude.ai, OpenCode has NATIVE subagent spawning. SKILL_04's autonomous workflow descriptions are OPERATIONAL on OpenCode. Use the `task` tool to spawn subagents:

```
Task: Break this into parallel tasks
→ Subagent A: Research competitors
→ Subagent B: Write copy
→ Subagent C: Design components
→ All run concurrently
→ Aggregate results
```

### oh-my-opencode-slim Plugin
For enhanced agent orchestration:
```bash
bunx oh-my-opencode-slim@latest install
```

This adds:
- 6-agent Pantheon (Orchestrator, Explorer, Librarian, Oracle, Designer, Fixer)
- Auto-delegation based on task type
- Token-efficient routing

### MCP Server Integration
Add MCP servers to `opencode.json`:
```json
{
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp",
      "enabled": true
    }
  }
}
```

### Skills System
OpenCode loads skills automatically from:
- `~/.config/opencode/skills/<name>/SKILL.md` (global)
- `.opencode/skills/<name>/SKILL.md` (project)
- `~/.agents/skills/<name>/SKILL.md` (global alternative)

---

## VERIFICATION TEST — OpenCode-Specific

```bash
# Start OpenCode session
opencode

# Send test message
"Acknowledge your loaded instructions. Summarize your core identity in one sentence."
```

**Expected response:**
> "Zero fluff. Working output > explanation. Alignment > execution."

---

## TROUBLESHOOTING — OpenCode-Specific

### AGENTS.md Not Loading
1. Verify file path: `~/.config/opencode/AGENTS.md` or project-level `AGENTS.md`
2. Check opencode.json references the correct path
3. Restart OpenCode session

### Subagents Not Spawning
1. Verify oh-my-opencode-slim is installed: `bunx oh-my-opencode-slim@latest install`
2. Check plugin is registered in opencode.json
3. Verify default agents are disabled (no conflicts)

### MCP Servers Not Connecting
1. Check opencode.json mcp section syntax
2. Verify network access to remote MCP endpoints
3. Run `opencode debug config` to see resolved configuration

---

## END OF OPENCODE PLATFORM GUIDE
