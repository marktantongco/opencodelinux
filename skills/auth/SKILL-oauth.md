---
name: auth.oauth
description: OAuth 2.0 / OIDC authentication flows — authorization code, PKCE, client credentials, and implicit flow patterns. Use when implementing social login, SSO, or delegated auth.

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

# OAuth 2.0 & OpenID Connect

## When to Use

Invoke this variant when the task involves OAuth 2.0 flows, OpenID Connect, social login (Google, GitHub, etc.), or delegated authorization patterns.

## Authorization Code Flow (Recommended)

The standard OAuth 2.0 flow for server-side apps:

1. Redirect user to authorization endpoint with `client_id`, `redirect_uri`, `scope`, `state`
2. User authenticates and approves
3. Authorization server redirects back with `?code=AUTH_CODE&state=...`
4. Server exchanges `code` for `access_token` + `refresh_token` via POST to token endpoint
5. Store tokens securely (httpOnly cookies or encrypted storage)

## PKCE Extension

Required for mobile/native apps and recommended for all public clients:

- `code_challenge = BASE64URL(SHA256(code_verifier))`
- Send `code_challenge` and `code_challenge_method=S256` with auth request
- Send `code_verifier` with token exchange request

## Client Credentials Flow

For server-to-server communication:

- POST to token endpoint with `grant_type=client_credentials`
- Requires `client_id` and `client_secret`
- No user context — use for API access only

## Security Checklist

- [ ] Validate `state` parameter to prevent CSRF
- [ ] Validate `redirect_uri` against allowlist
- [ ] Use PKCE for all public clients
- [ ] Store client secrets server-side only
- [ ] Set short token expiry (15 min for access, 7 days for refresh)
- [ ] Implement token rotation for refresh tokens
