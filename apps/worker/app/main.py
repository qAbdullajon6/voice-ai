import asyncio
from datetime import datetime, timezone
import html
import uuid

import boto3
import redis.asyncio as redis
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from .config import settings


app = FastAPI(title="VoiceAI Worker")


class TtsRequest(BaseModel):
    text: str
    voice: str | None = None
    output_format: str | None = None


redis_client = redis.from_url(settings.redis_url)


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/tts")
def tts(req: TtsRequest):
    return run_tts(req.text, req.voice, req.output_format)


def run_tts(text: str, voice: str | None, output_format: str | None):
    if not settings.azure_tts_key or not settings.azure_tts_region:
        raise HTTPException(status_code=500, detail="Azure TTS not configured")
    if not settings.s3_access_key or not settings.s3_secret_key or not settings.s3_bucket:
        raise HTTPException(status_code=500, detail="S3 not configured")

    voice = voice or "en-US-AriaNeural"
    allowed_formats = {
        "audio-16khz-32kbitrate-mono-mp3",
        "audio-16khz-64kbitrate-mono-mp3",
        "audio-24khz-48kbitrate-mono-mp3",
        "audio-24khz-96kbitrate-mono-mp3",
        "audio-24khz-160kbitrate-mono-mp3",
        "audio-24khz-48kbitrate-mono-mp3",
        "audio-48khz-96kbitrate-mono-mp3",
    }
    output_format = output_format or "audio-16khz-32kbitrate-mono-mp3"
    if output_format not in allowed_formats:
        output_format = "audio-16khz-32kbitrate-mono-mp3"

    ssml = (
        "<speak version='1.0' xml:lang='en-US'>"
        f"<voice name='{html.escape(voice)}'>"
        f"{html.escape(text)}"
        "</voice>"
        "</speak>"
    )

    tts_url = (
        f"https://{settings.azure_tts_region}.tts.speech.microsoft.com/"
        "cognitiveservices/v1"
    )
    headers = {
        "Ocp-Apim-Subscription-Key": settings.azure_tts_key,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": output_format,
        "User-Agent": "voiceai-worker",
    }

    resp = requests.post(tts_url, headers=headers, data=ssml.encode("utf-8"), timeout=30)
    if resp.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=f"Azure TTS error: {resp.status_code} {resp.text}",
        )

    audio_bytes = resp.content

    s3_kwargs = {
        "region_name": settings.s3_region or None,
        "aws_access_key_id": settings.s3_access_key,
        "aws_secret_access_key": settings.s3_secret_key,
    }
    if settings.s3_endpoint:
        s3_kwargs["endpoint_url"] = settings.s3_endpoint

    s3 = boto3.client("s3", **s3_kwargs)
    key = f"tts/{uuid.uuid4().hex}.mp3"
    s3.put_object(
        Bucket=settings.s3_bucket,
        Key=key,
        Body=audio_bytes,
        ContentType="audio/mpeg",
    )

    url = s3.generate_presigned_url(
        "get_object",
        Params={"Bucket": settings.s3_bucket, "Key": key},
        ExpiresIn=settings.s3_presign_expiry,
    )
    return {"key": key, "url": url}


@app.on_event("startup")
async def start_worker_loop():
    asyncio.create_task(process_queue())


async def process_queue():
    while True:
        item = await redis_client.blpop("tts:queue", timeout=5)
        if not item:
            continue

        _, raw_id = item
        job_id = raw_id.decode("utf-8")
        job_key = f"tts:job:{job_id}"
        data = await redis_client.hgetall(job_key)
        if not data:
            continue

        text = data.get(b"text", b"").decode("utf-8")
        voice = data.get(b"voice", b"").decode("utf-8") or None
        output_format = data.get(b"output_format", b"").decode("utf-8") or None

        await redis_client.hset(
            job_key,
            mapping={"status": "processing", "updated_at": _now()},
        )

        try:
            result = await asyncio.to_thread(run_tts, text, voice, output_format)
            await redis_client.hset(
                job_key,
                mapping={
                    "status": "done",
                    "url": result["url"],
                    "updated_at": _now(),
                },
            )
        except Exception as exc:  # noqa: BLE001
            await redis_client.hset(
                job_key,
                mapping={
                    "status": "failed",
                    "error": str(exc),
                    "updated_at": _now(),
                },
            )


def _now():
    return datetime.now(timezone.utc).isoformat()
