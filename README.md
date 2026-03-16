# VoiceAI

MVP goal: a minimal ElevenLabs-style TTS platform with a web studio, API access, basic voice library, and usage-based billing.

## Repository Structure
- apps/api: NestJS API (auth, billing, usage, voices, projects)
- apps/worker: Python worker (TTS jobs, audio processing)
- apps/web: Next.js studio UI
- docs: architecture and roadmap

## Local Dev (initial)
1. Start infra: `docker compose up -d`
2. Copy env: `copy .env.example .env` (Windows) or `cp .env.example .env`
3. API/Web/Worker setup will be added in the next step.

## Scope (MVP)
- TTS generation (text to audio)
- Voice library (default + custom)
- Usage tracking and limits
- API keys
- Stripe billing

## Notes
This repo starts with infra and docs first. Services will be scaffolded next.
