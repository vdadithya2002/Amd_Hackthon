import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai

load_dotenv(Path(__file__).resolve().parents[2] / ".env")


def get_gemini_client():
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise RuntimeError("GOOGLE_API_KEY is not set")
    return genai.Client(api_key=api_key)
