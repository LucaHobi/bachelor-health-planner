import openai
import os
from dotenv import load_dotenv

# .env laden
load_dotenv()
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Anfrage senden
response = client.chat.completions.create(
    model="gpt-4o",  # oder gpt-4o-mini, gpt-3.5-turbo
    messages=[
        {"role": "user", "content": "Ich habe wenig Zeit, aber möchte gesund essen. Was empfiehlst du mir?"}
    ],
    temperature=0.7,
    max_tokens=300
)

# Ausgabe
print("\n💬 GPT-Antwort:\n")
print(response.choices[0].message.content)
