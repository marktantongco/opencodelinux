---
name: hermes-tweet
description: "Hermes Agent native X/Twitter plugin workflow for installing Xquik-dev/hermes-tweet, discovering available routes with tweet_explore, reading public or account data with tweet_read, and keeping tweet_action behind explicit user approval plus HERMES_TWEET_ENABLE_ACTIONS=true."
allowed-tools: Bash(hermes plugins install Xquik-dev/hermes-tweet --enable), Bash(hermes plugins enable hermes-tweet), Bash(hermes tools list)
expects:
- key: task
  type: string
  description: X/Twitter research, monitoring, or approved action request to run through Hermes Agent
- key: hermes_runtime
  type: string
  description: Local, gateway, or project Hermes runtime where the plugin executes
  default: local
provides:
- key: workflow
  type: string
  description: Safe Hermes Tweet setup or tool-use plan
- key: result
  type: string
  description: Read result, action summary, or blocked-gate explanation
---

# Hermes Tweet

Use this skill when the user wants Hermes Agent to inspect, monitor, or
carefully act on X/Twitter through the `Xquik-dev/hermes-tweet` plugin. It is a
Hermes-native route, not a generic social posting shortcut.

## Fit Check

Use this skill for:

- Hermes Agent setup for the Hermes Tweet plugin.
- X/Twitter account, post, search, trend, monitor, draw, or media workflows in
  a Hermes session.
- Read-first social listening, launch monitoring, support triage, creator
  research, brand research, and giveaway audits.
- Account-changing actions only after the user asks for the specific action and
  approves the exact endpoint and payload.

Do not use this skill when the user only wants copywriting, thread structure,
or social media strategy. Use content skills for those tasks.

## Install

Install and enable the plugin in the Hermes runtime that will execute tools:

```bash
hermes plugins install Xquik-dev/hermes-tweet --enable
```

If the plugin is already installed but disabled:

```bash
hermes plugins enable hermes-tweet
```

Then confirm the toolset is available:

```bash
hermes tools list
```

## Credential Gates

- `tweet_explore` is always the first step. It searches the bundled endpoint
  catalog and makes no network call.
- `tweet_read` requires `XQUIK_API_KEY` in the Hermes runtime environment.
- `tweet_action` requires `XQUIK_API_KEY` and
  `HERMES_TWEET_ENABLE_ACTIONS=true`.
- Never ask the user to paste key values into chat, issue text, logs, or tool
  input. Tell them to set secrets in the runtime environment or Hermes secret
  store.
- Keep `tweet_action` disabled for unattended, scheduled, research, gateway, or
  cron sessions unless the workflow has an explicit approval step.

## Workflow

1. Use `tweet_explore` with a short capability query.
2. Select only catalog-listed `/api/v1/...` routes.
3. Use `tweet_read` for catalog routes that are public, read-only, and not
   marked as actions.
4. For posting, deleting, replying, liking, reposting, following, DMs, profile
   changes, monitors, webhooks, extraction jobs, media changes, or draws, state
   the exact endpoint, method, payload, and reason before using `tweet_action`.
5. If `tweet_action` is unavailable, explain that action tools are intentionally
   gated by `HERMES_TWEET_ENABLE_ACTIONS=true`.

## Decision Rules

- If the user asks what Hermes Tweet can do, call `tweet_explore`.
- If the user asks for X/Twitter research, discovery, monitoring, or reporting,
  prefer `tweet_read` only for public read-only routes.
- If a read route touches private or account-state data, use the `tweet_action`
  approval path.
- If the user asks for an account-changing operation, draft the operation first
  and require user approval before `tweet_action`.
- If `XQUIK_API_KEY` is missing, stop at discovery and ask the user to configure
  the key where Hermes runs.
- If Hermes Desktop uses a remote gateway profile, install and configure Hermes
  Tweet on the remote Hermes host, not just the local desktop client.
- If a project-local plugin copy is used, enable project plugins only for a
  trusted repository.

## Safety

- Do not guess endpoint paths.
- Do not use routes outside the catalog returned by `tweet_explore`.
- Do not include credentials, cookies, TOTP codes, API keys, or raw session
  material in examples or logs.
- Do not use account connection, re-authentication, API key, billing, credit
  top-up, or support-ticket endpoints.
- Do not retry writes through unrelated tools after a policy, authentication,
  or account-state error.

## Examples

Find a read route:

```json
{"query":"tweet search","method":"GET"}
```

Then use the catalog result with `tweet_read`.

Prepare an approved post:

```json
{"query":"post tweet","include_actions":true}
```

Then summarize the exact `tweet_action` call before executing it.

## Verification

After installing or updating Hermes Tweet:

1. Run `hermes plugins enable hermes-tweet` unless install used `--enable`.
2. Run `hermes tools list` and confirm the `hermes-tweet` toolset is enabled.
3. Confirm `tweet_explore` is available without `XQUIK_API_KEY`.
4. Confirm `tweet_read` appears only when `XQUIK_API_KEY` is configured.
5. Confirm `tweet_action` stays hidden or disabled unless
   `HERMES_TWEET_ENABLE_ACTIONS=true`.
