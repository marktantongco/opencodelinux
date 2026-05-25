---
name: auth.session
description: Session management patterns — server-side sessions, cookie-based auth, session stores, and secure session handling. Use when implementing traditional session-based authentication.

expects:
- key: input
  type: string
  description: Source code or data to process
- key: options
  type: object
  description: Configuration options
provides:
- key: result
  type: string
  description: Processed output or generated code
- key: file_path
  type: path
  description: Path to any generated files
---

# Session Management

## When to Use

Invoke this variant when the task involves server-side sessions, cookie-based authentication, session stores, or secure session handling.

## Session Patterns

### Pattern 1: Server-Side Sessions (Recommended for Most Apps)

```
Login → create session in store → set session cookie
Request → read session cookie → lookup session in store
```

- Session data stored server-side (Redis, DB, or encrypted cookie)
- Cookie contains only session ID (opaque, non-guessable)
- Session ID should be: crypto-random, at least 128 bits

### Pattern 2: Encrypted Cookies (Good for Small Payloads)

- Session data encrypted and stored in the cookie itself
- No server-side store needed (but revocation is hard)
- Use authenticated encryption (AES-GCM or similar)
- Keep payload size small (< 4 KB)

## Session Store Options

| Store | Pros | Cons |
|-------|------|------|
| Redis | Fast, TTL built-in, atomic operations | External dependency |
| Database | No extra infra, transactional | Slower, more load |
| Memory | Simplest, no deps | Lost on restart, single-server only |

## Security Checklist

- [ ] Set `httpOnly` flag on session cookies
- [ ] Set `secure` flag (HTTPS only)
- [ ] Set `sameSite=lax` or `strict`
- [ ] Regenerate session ID on login (prevent session fixation)
- [ ] Implement absolute session timeout + inactivity timeout
- [ ] Provide session revocation endpoint
