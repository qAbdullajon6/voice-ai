import asyncio
import json
from datetime import datetime, timezone
import html
import uuid
import os

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
    model_id: str | None = None
    settings: dict | None = None


redis_client = redis.from_url(settings.redis_url)


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/tts")
def tts(req: TtsRequest):
    return run_tts(req.text, req.voice, req.output_format, req.model_id, req.settings)

def run_tts(
    text: str,
    voice: str | None,
    output_format: str | None,
    model_id: str | None,
    job_settings: dict | None,
):
    if not settings.s3_access_key or not settings.s3_secret_key or not settings.s3_bucket:
        raise HTTPException(status_code=500, detail="S3 not configured")

    voice = voice or "en-US-AriaNeural"
    if voice.startswith("elevenlabs:"):
        audio_bytes = _run_elevenlabs_tts(
            text,
            voice.removeprefix("elevenlabs:"),
            model_id=model_id,
            job_settings=job_settings,
        )
    else:
        audio_bytes = _run_azure_tts(text, voice, output_format)

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


def _run_azure_tts(text: str, voice: str, output_format: str | None):
    if not settings.azure_tts_key or not settings.azure_tts_region:
        raise HTTPException(status_code=500, detail="Azure TTS not configured")

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

    return resp.content


def _run_elevenlabs_tts(
    text: str,
    voice_id: str,
    model_id: str | None,
    job_settings: dict | None,
):
    if not settings.elevenlabs_api_key:
        raise HTTPException(status_code=500, detail="ElevenLabs not configured")

    url = (
        f"{settings.elevenlabs_base_url.rstrip('/')}/v1/text-to-speech/"
        f"{voice_id}"
    )
    headers = {
        "xi-api-key": settings.elevenlabs_api_key,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
    }
    payload: dict = {
        "text": text,
        "model_id": model_id or settings.elevenlabs_model_id,
    }

    # Voice settings are optional and applied per-request.
    # Front-end currently sends { speed, stability, similarity }.
    voice_settings: dict = {}
    if isinstance(job_settings, dict):
        # Stability
        if job_settings.get("stability") is not None:
            try:
                voice_settings["stability"] = float(job_settings["stability"])
            except (TypeError, ValueError):
                pass

        # Similarity: front-end uses `similarity`, ElevenLabs expects `similarity_boost`.
        if job_settings.get("similarity") is not None:
            try:
                voice_settings["similarity_boost"] = float(job_settings["similarity"])
            except (TypeError, ValueError):
                pass
        elif job_settings.get("similarity_boost") is not None:
            try:
                voice_settings["similarity_boost"] = float(job_settings["similarity_boost"])
            except (TypeError, ValueError):
                pass

        # Speed
        if job_settings.get("speed") is not None:
            try:
                voice_settings["speed"] = float(job_settings["speed"])
            except (TypeError, ValueError):
                pass

        # Optional passthroughs (if later added on FE)
        if job_settings.get("style") is not None:
            try:
                voice_settings["style"] = float(job_settings["style"])
            except (TypeError, ValueError):
                pass
        if job_settings.get("use_speaker_boost") is not None:
            try:
                voice_settings["use_speaker_boost"] = bool(job_settings["use_speaker_boost"])
            except (TypeError, ValueError):
                pass

    if voice_settings:
        payload["voice_settings"] = voice_settings

    resp = requests.post(url, headers=headers, json=payload, timeout=60)
    if resp.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=f"ElevenLabs TTS error: {resp.status_code} {resp.text}",
        )
    return resp.content


@app.on_event("startup")
async def start_worker_loop():
    workers = int(os.getenv("TTS_WORKERS", "1"))
    workers = max(1, workers)
    for _ in range(workers):
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
        model_id = data.get(b"model_id", b"").decode("utf-8") or None
        output_format = data.get(b"output_format", b"").decode("utf-8") or None
        settings_raw = data.get(b"settings", b"").decode("utf-8") or ""
        parsed_settings: dict | None = None
        if settings_raw:
            try:
                parsed_settings = json.loads(settings_raw)
            except json.JSONDecodeError:
                parsed_settings = None

        await redis_client.hset(
            job_key,
            mapping={"status": "processing", "updated_at": _now()},
        )

        try:
            result = await asyncio.to_thread(
                run_tts, text, voice, output_format, model_id, parsed_settings
            )
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
