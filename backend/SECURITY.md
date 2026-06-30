# Security Guidelines — PresentAI

> **Versi:** 1.0  
> **Terakhir Update:** 2026-06-29  
> **Status:** Production Ready  
> **Severity Levels:** Critical | High | Medium | Low

---

## 1. Overview

Dokumen ini menjelaskan kebijakan keamanan, best practices, dan prosedur penanganan insiden untuk aplikasi PresentAI. Tujuannya adalah melindungi data pengguna, API key, dan infrastruktur dari ancaman umum aplikasi web modern.

---

## 2. Threat Model

### 2.1 Ancaman yang Dihadapi

| ID | Ancaman | Severity | Mitigasi |
|----|---------|----------|----------|
| T-001 | **API Key Exposure** — GEMINI_API_KEY bocor ke publik | **CRITICAL** | Environment variables, .gitignore, never commit |
| T-002 | **CORS Misconfiguration** — API bisa diakses dari domain lain | **HIGH** | Whitelist domain frontend |
| T-003 | **Rate Limit Bypass** — Abuse API dengan unlimited requests | **HIGH** | express-rate-limit per IP |
| T-004 | **Input Injection** — XSS atau HTML injection via topic input | **HIGH** | Input sanitization, HTML tag stripping |
| T-005 | **DoS Attack** — Flood request membuat server down | **MEDIUM** | Rate limiting + Render free tier limits |
| T-006 | **Man-in-the-Middle** — Intercept traffic HTTP | **MEDIUM** | HTTPS enforced (Render/Vercel auto) |
| T-007 | **Information Disclosure** — Stack trace di production | **MEDIUM** | NODE_ENV check, generic error messages |
| T-008 | **Dependency Vulnerabilities** — Package npm yang outdated | **MEDIUM** | npm audit, regular updates |

### 2.2 Attack Surface

```
┌─────────────────────────────────────────────────────────────┐
│  ATTACK SURFACE PRESENTAI                                    │
├─────────────────────────────────────────────────────────────┐
│                                                              │
│  [Browser/User] ──► [Vercel Frontend] ──► [Render Backend]  │
│       │                    │                    │            │
│       │                    │                    │            │
│   XSS/Injection      Asset Tampering      API Key Theft      │
│   Phishing           CORS Bypass          Rate Limit Bypass  │
│   MITM               CDN Hijacking        DoS/Abuse          │
│                                                              │
│  [External: Gemini API]                                      │
│       │                                                     │
│   API Key Leak (via logs)                                   │
│   Prompt Injection                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Environment Variables & Secrets

### 3.1 Daftar Secrets

| Variable | Lokasi | Sensitivity | Cara Akses |
|----------|--------|-------------|------------|
| `GEMINI_API_KEY` | Backend `.env` | **CRITICAL** | `process.env.GEMINI_API_KEY` |
| `CORS_ORIGIN` | Backend `.env` | HIGH | `process.env.CORS_ORIGIN` |
| `PORT` | Backend `.env` | LOW | `process.env.PORT` |
| `API_URL` | Vercel Env | MEDIUM | Frontend fetch URL |

### 3.2 Aturan Penanganan Secrets

```
┌────────────────────────────────────────────────────────────┐
│  GOLDEN RULES FOR SECRETS                                  │
├────────────────────────────────────────────────────────────┤
│  1. NEVER commit .env to GitHub                            │
│  2. NEVER log API keys to console (even in development)    │
│  3. NEVER hardcode secrets in source code                  │
│  4. NEVER expose API keys in frontend code                 │
│  5. ALWAYS use environment variables                       │
│  6. ALWAYS rotate keys if suspected leak                  │
│  7. ALWAYS use .env.example as template (without values)   │
└────────────────────────────────────────────────────────────┘
```

### 3.3 .gitignore Configuration

```gitignore
# Environment variables
.env
.env.local
.env.production
.env.development

# Logs
logs/
*.log
npm-debug.log*

# Dependencies
node_modules/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
```

### 3.4 .env.example (Template)

```env
# GEMINI_API_KEY=your_gemini_api_key_here
# PORT=3000
# CORS_ORIGIN=http://localhost:5173
# NODE_ENV=development
# RATE_LIMIT_WINDOW_MS=60000
# RATE_LIMIT_MAX_REQUESTS=10
```

---

## 4. API Keamanan (CORS, Rate Limiting, Input Validation)

Telah diimplementasikan secara komprehensif pada source code backend.
