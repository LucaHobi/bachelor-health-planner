import os
from openai import OpenAI
from dotenv import load_dotenv

# .env laden (für API Key)
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Simulierte Nutzerdaten
data = {
    "diet_type": "vegetarian",
    "intolerances": ["lactose"],
    "fruit_veg": "2 Portionen",
    "grains_scale": 3,
    "sugar_scale": 4,
    "fish_per_week": "0x",
    "meat_per_week": "0x",
    "water_intake": "1,5 Liter",
    "goals": "Mehr Energie und besserer Schlaf",
    "motivation": 4,
    "past_attempts": "Habe schon Intervallfasten ausprobiert.",
    "cook_time": 3,
    "cooking_skill": 2,
    "lifestyle": "Sitzender Büroalltag mit wenig Bewegung",
    "stress_level": 4,
    "eating_out": "Mittags meist in der Kantine",
    "energy_level": 2,
    "sleep_quality": "schlecht, wache oft auf",
    "mood": "oft gereizt",
    "digestion": "teils Blähungen",
    "exercise_per_week": "1x",
    "movement_total": "ca. 3.000 Schritte täglich",
    "strength_training": "nein",
    "medical_conditions": "Vitamin D Mangel",
    "pregnancy_status": "nicht schwanger",
    "additional_notes": ""
}

# GPT-Prompt zusammenbauen (gekürzt & angepasst)
prompt = f"""
Du bist ein Ernährungsexperte mit wissenschaftlichem Hintergrund.
Hier sind Angaben einer Person:

- Ernährung: {data['diet_type']}, Unverträglichkeiten: {data['intolerances']}, Zuckerkonsum: {data['sugar_scale']}/5
- Ziel: {data['goals']} (Motivation: {data['motivation']}/5)
- Lebensstil: {data['lifestyle']}, Stress: {data['stress_level']}/5
- Schlaf: {data['sleep_quality']}, Stimmung: {data['mood']}
- Bewegung: {data['exercise_per_week']}, Krafttraining: {data['strength_training']}
- Weitere Hinweise: {data['medical_conditions']}

Bitte gib eine klare, fundierte, alltagstaugliche Ernährungsempfehlung in folgenden Abschnitten:
1. Einschätzung
2. Ernährungsempfehlungen
3. Bewegung & Regeneration
4. 2 Alltagstipps

Sprich den Leser direkt an.
"""

# API-Call
response = client.chat.completions.create(
    model="gpt-4o-mini",  # oder gpt-3.5-turbo, wenn günstiger
    messages=[
        {"role": "system", "content": "Du bist ein Ernährungswissenschaftler mit evidenzbasierter Arbeitsweise. Du gibst fundierte, personalisierte Empfehlungen basierend auf anerkannten Leitlinien wie DGE, WHO und aktuellen Studien."},
        {"role": "user", "content": prompt}
    ],
    temperature=0.7,
    max_tokens=800
)

# Ausgabe drucken
print(response.choices[0].message.content)