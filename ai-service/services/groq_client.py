from pathlib import Path
import os
from dotenv import load_dotenv
from groq import Groq

# Load .env from ai-service directory or current directory
env_path = Path(__file__).resolve().parent.parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
load_dotenv()

my_api_key = os.getenv("GROQ_API_KEY")

if not my_api_key:
    raise ValueError("API key missing from .env")

client = Groq(api_key=my_api_key)

# Default to high-throughput openai/gpt-oss-120b to avoid 1000 OTPM rate limits
MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
FALLBACK_MODEL = "openai/gpt-oss-20b"


def call_groq_completions(messages, max_tokens=800, temperature=0.1):
    models = [MODEL, FALLBACK_MODEL, "qwen/qwen3.8-27b"]
    last_err = None
    for m in models:
        try:
            return client.chat.completions.create(
                model=m,
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature
            )
        except Exception as e:
            last_err = e
            print(f"[groq_client] Call to {m} failed: {e}. Trying fallback...")
            continue
    raise last_err
