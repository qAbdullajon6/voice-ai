import os

from dotenv import load_dotenv, find_dotenv
from pydantic import BaseModel

load_dotenv(find_dotenv())


class Settings(BaseModel):
    azure_tts_key: str = os.getenv("AZURE_TTS_KEY", "")
    azure_tts_region: str = os.getenv("AZURE_TTS_REGION", "")

    s3_access_key: str = os.getenv("S3_ACCESS_KEY", "")
    s3_secret_key: str = os.getenv("S3_SECRET_KEY", "")
    s3_bucket: str = os.getenv("S3_BUCKET", "")
    s3_region: str = os.getenv("S3_REGION", "")
    s3_endpoint: str = os.getenv("S3_ENDPOINT", "")
    s3_presign_expiry: int = int(os.getenv("S3_PRESIGN_EXPIRY", "3600"))

    redis_url: str = os.getenv("REDIS_URL", "redis://127.0.0.1:6379/0")


settings = Settings()
