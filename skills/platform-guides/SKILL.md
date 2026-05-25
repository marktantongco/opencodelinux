---
name: platform-guides
description: Platform-specific deployment guides for configuring AI agents across OpenCode, Claude, ChatGPT, Cursor, and Gemini. Use when deploying system prompts or agents to different platforms.

expects:
- key: config
  type: string
  description: Configuration or settings to apply
- key: environment
  type: string
  description: Target environment
  default: production
provides:
- key: status
  type: string
  description: Operation status or result
- key: deployment_url
  type: url
  description: URL of the deployed resource
---

# Platform Guides

## Context

Use this skill when deploying system prompts, agent configurations, or custom instructions across different AI platforms. Contains platform-specific guides for OpenCode, Claude, ChatGPT, Cursor, and Gemini.

**Trigger phrases:** "deploy to platform," "platform guide," "setup on [platform]," "platform-specific config"

## Available Guides

- PLATFORM_GUIDE_OPENCODE.md — OpenCode (Terminal, IDE, Headless)
- PLATFORM_GUIDE_CLAUDE.md — Claude (claude.ai, Claude Code)
- PLATFORM_GUIDE_CHATGPT.md — ChatGPT (Web, Mobile)
- PLATFORM_GUIDE_CURSOR.md — Cursor IDE (Rules, Agent)
- PLATFORM_GUIDE_GEMINI.md — Gemini (Google AI Studio)

## Instructions

1. Identify the target platform
2. Load the corresponding PLATFORM_GUIDE_*.md file
3. Follow the platform-specific setup instructions
4. Verify the configuration is loaded correctly
