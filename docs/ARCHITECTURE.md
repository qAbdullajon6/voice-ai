# Architecture (Initial)

## Services
- API (NestJS): auth, users, projects, voices, billing, usage, API keys
- Worker (Python): TTS jobs, audio processing, S3 uploads
- Web (Next.js): studio UI, dashboard

## Infra
- Postgres for data
- Redis for queues
- S3 compatible storage for audio

## Data Flow
1. User submits text in web or API.
2. API enqueues a job.
3. Worker generates audio and uploads to S3.
4. API updates job status and usage.
5. UI polls for result and shows playback link.
