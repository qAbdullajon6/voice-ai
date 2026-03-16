# Deploy to Render (Docker)

This repo ships three services, each with its own Dockerfile:
- Web (Next.js): `apps/web/Dockerfile`
- API (NestJS): `apps/api/Dockerfile`
- Worker (Python): `apps/worker/Dockerfile`

Render will use `render.yaml` to create all services.

## 1) Create Render services
1. Push this repo to GitHub.
2. Render: **New > Blueprint**, select the repo.
3. Render will create:
   - `voiceai-web` (Docker Web Service)
   - `voiceai-api` (Docker Web Service)
   - `voiceai-worker` (Docker Background Worker)
   - `voiceai-db` (Postgres)
   - `voiceai-redis` (Key Value/Redis)

## 2) Update environment variables
Fill these in Render dashboard (sync=false variables):

### API (`voiceai-api`)
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `S3_ACCESS_KEY`
- `S3_SECRET_KEY`
- `S3_BUCKET`
- `S3_REGION`
- `S3_ENDPOINT`
- `AZURE_TTS_KEY`
- `AZURE_TTS_REGION`

### Worker (`voiceai-worker`)
- `S3_ACCESS_KEY`
- `S3_SECRET_KEY`
- `S3_BUCKET`
- `S3_REGION`
- `S3_ENDPOINT`
- `AZURE_TTS_KEY`
- `AZURE_TTS_REGION`

### Web (`voiceai-web`)
- `NEXT_PUBLIC_API_URL` = `https://<your-api-domain>`

`DATABASE_URL` and `REDIS_URL` are injected automatically by Render.

## 3) Google OAuth callbacks
Add these in Google Cloud Console:
- Authorized JavaScript origins:
  - `https://<your-web-domain>`
- Authorized redirect URIs:
  - `https://<your-api-domain>/auth/google/callback`

## 4) Update API/Web URLs
In Render, set:
- `API_URL` = `https://<your-api-domain>`
- `WEB_URL` = `https://<your-web-domain>`

## 5) Deploy
Render will build and deploy automatically from GitHub. Redeploy after env changes.

Notes:
- Free plans can sleep on idle.
- Use paid plans for always-on worker.
