from pathlib import Path
import os
import re
import json
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

# Default to high-throughput openai/gpt-oss-120b or qwen3.8-27b
MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
FALLBACK_MODEL = "qwen/qwen3.8-27b"


def extract_json_from_text(raw_text: str):
    """
    Robust JSON extractor: handles markdown wrappers, leading/trailing prose,
    and trailing commas.
    """
    if not raw_text or not isinstance(raw_text, str):
        return {}
    
    cleaned = raw_text.strip()
    cleaned = re.sub(r'^```(?:json)?\s*', '', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'\s*```$', '', cleaned)
    cleaned = cleaned.strip()
    
    # Try direct parse
    try:
        return json.loads(cleaned)
    except Exception:
        pass
    
    # Try finding first { and last }
    first_brace = cleaned.find("{")
    last_brace = cleaned.rfind("}")
    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
        sub = cleaned[first_brace:last_brace + 1]
        # Remove trailing commas before } or ]
        sub_fixed = re.sub(r',\s*([\]}])', r'\1', sub)
        try:
            return json.loads(sub_fixed)
        except Exception:
            try:
                return json.loads(sub)
            except Exception:
                pass

    # Try finding array [ and ]
    first_bracket = cleaned.find("[")
    last_bracket = cleaned.rfind("]")
    if first_bracket != -1 and last_bracket != -1 and last_bracket > first_bracket:
        sub = cleaned[first_bracket:last_bracket + 1]
        sub_fixed = re.sub(r',\s*([\]}])', r'\1', sub)
        try:
            return json.loads(sub_fixed)
        except Exception:
            pass

    return {}


def call_groq_completions(messages, max_tokens=2200, temperature=0.1, extra_body=None):
    """
    Executes Groq chat completion with automatic fallback and reasoning suppression.
    """
    models = [MODEL, FALLBACK_MODEL, "openai/gpt-oss-20b", "groq/compound-mini"]
    last_err = None
    merged_extra = {"reasoning_format": "hidden"}
    if extra_body:
        merged_extra.update(extra_body)

    for m in models:
        try:
            resp = client.chat.completions.create(
                model=m,
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature,
                extra_body=merged_extra
            )
            content = resp.choices[0].message.content
            # Ensure model didn't return an empty string
            if content and len(content.strip()) > 0:
                return resp
            
            # If content was empty but model generated reasoning with JSON:
            reasoning = getattr(resp.choices[0].message, "reasoning", "")
            if reasoning and ("{" in reasoning and "}" in reasoning):
                resp.choices[0].message.content = reasoning
                return resp

            print(f"[groq_client] Call to {m} returned empty content. Trying fallback...")
        except Exception as e:
            last_err = e
            print(f"[groq_client] Call to {m} failed: {e}. Trying fallback...")
            continue

    if last_err:
        raise last_err
    raise RuntimeError("All Groq models failed to return content")
