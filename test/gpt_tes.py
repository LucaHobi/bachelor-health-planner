import openai
import os
from dotenv import load_dotenv

# .env laden
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# GPT-Call
response = openai.ChatCompletion.create(
    model="gpt-4o-mini",  # oder z. B. "gpt-4.1-nano"
    messages=[
        {"role": "user", "content": "Ich habe wenig Zeit, aber will gesund essen. Gib mir einen Vorschlag."}
    ],
    temperature=0.7,
    max_tokens=300
)

# Ausgabe anzeigen
print("\n💬 GPT-Antwort:\n")
print(response["choices"][0]["message"]["content"])
