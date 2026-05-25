---
name: auth.jwt
description: JWT (JSON Web Token) creation, validation, and management — signing, verification, claims, and best practices. Use when implementing token-based auth or API authentication.

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

# JWT — JSON Web Tokens

## When to Use

Invoke this variant when the task involves JWT creation, validation, signing, claims structure, or token management.

## JWT Structure

A JWT consists of three parts separated by dots:

```
base64(header).base64(payload).base64(signature)
```

**Header:**
```json
{"alg": "RS256", "typ": "JWT", "kid": "key-id-1"}
```

**Payload (claims):**
```json
{
  "sub": "user_123",
  "iss": "https://auth.example.com",
  "aud": "api.example.com",
  "exp": 1748115200,
  "iat": 1748028800,
  "scope": "read write"
}
```

## Signing Algorithms

| Algorithm | Type | Use Case |
|-----------|------|----------|
| HS256 | Symmetric | Single-service apps (same key signs and verifies) |
| RS256 | Asymmetric | Multi-service apps (private key signs, public key verifies) |
| ES256 | Asymmetric | Modern alternative to RS256, smaller signatures |

**Recommendation:** Use RS256 or ES256 for production. HS256 requires the secret to be shared.

## JWT Best Practices

- Set short `exp` (15 minutes max for access tokens)
- Always validate `aud` (audience) claim
- Always validate `iss` (issuer) claim
- Never store sensitive data in payload (it's base64, not encrypted)
- Use `jti` (JWT ID) for token replay detection
- Rotate signing keys periodically
- Maintain a key rotation endpoint (`/.well-known/jwks.json`) for RS256/ES256
