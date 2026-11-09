# Architecture — Pulseboard

Internal service-health board with lightweight incident intake.

## Goals

1. Fast read model for on-call (`GET /api/services`)
2. Simple incident create without leaving the board
3. Typed React client over a small Node API

## Components

```
React (Vite) ──proxy/HTTP──► Fastify API
                               │
                               ▼
                         in-memory services[]
```

## Notes

- Status values: `healthy | degraded | down`
- UI polls on an interval for freshness
- Incident create is append-only in this version (no persistence layer yet)

## Tradeoffs

| Choice | Why |
|--------|-----|
| In-memory services | Zero-setup local run |
| Vite proxy to `:3200` | Avoids CORS friction in development |
| Minimal incident API | Keeps the surface small; add store later |
