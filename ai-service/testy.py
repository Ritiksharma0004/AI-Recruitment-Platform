from openai import OpenAI

client = OpenAI(
    base_url="http://127.0.0.1:55481/v1",
    api_key="dummy"
)

response = client.chat.completions.create(
    model="qwen2.5-1.5b-instruct-generic-cpu",
    messages=[
        {
            "role": "user",
            "content": "hello"
        }
    ]
)

print(response.choices[0].message.content)