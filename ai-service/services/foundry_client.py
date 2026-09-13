from openai import OpenAI

client = OpenAI(
    base_url="http://127.0.0.1:54149/v1",
    api_key="dummy"
)

MODEL = "qwen2.5-1.5b-instruct-generic-cpu"