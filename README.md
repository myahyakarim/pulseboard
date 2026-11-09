# Pulseboard

React + Node status board for internal service health and lightweight incident intake.

## Problem

On-call engineers need a fast view of service health and a way to file an incident without opening five tools.

## Approach

- Fastify API for service pulse + incident create
- React UI with live refresh
- Typed contracts end to end

Details: [ARCHITECTURE.md](./ARCHITECTURE.md)

## Run

```bash
# terminal 1
cd server && npm install && npm run dev

# terminal 2
cd web && npm install && npm run dev
```

UI: Vite default (`http://127.0.0.1:5173`) · API: `:3200`

## Stack

Node · Fastify · React · Vite · TypeScript
