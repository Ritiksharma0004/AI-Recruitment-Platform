import os

from dotenv import load_dotenv
from groq import Groq

load_dotenv()

my_api_key = os.getenv("GROQ_API_KEY")

if not my_api_key:
    raise ValueError("API key missing from .env")

client = Groq(api_key=my_api_key)

MODEL = "qwen/qwen3.8-27b"
