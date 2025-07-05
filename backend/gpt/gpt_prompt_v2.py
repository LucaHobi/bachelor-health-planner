import os
from openai import OpenAI
from dotenv import load_dotenv

# .env laden (für API Key)
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# System prompt: Rolle und Instruktionen
system_prompt = """Du bist ein erfahrener Ernährungswissenschaftler mit Fokus auf alltagspraktische, wissenschaftlich fundierte Empfehlungen.

Sprich auf Deutsch und liefere ausschließlich die Antwort als gültiges JSON-Objekt (keinen zusätzlichen Text davor oder danach).

Halte dich an folgende Struktur und Felder:

{
  "nutrition": {
    "summary": "Kurzbeschreibung der allgemeinen Ernährungsempfehlung",
    "macroDistribution": {
      "carbs": "Angabe in Prozent + kurze Lebensmittelbeispiele",
      "fat": "Angabe in Prozent + kurze Lebensmittelbeispiele",
      "protein": "Angabe in Prozent + kurze Lebensmittelbeispiele"
    },
    "dayPlan": [
      { "meal": "Frühstück", "items": ["Haferflocken mit Banane", "1 EL Nussmus", "Tee"] },
      { "meal": "Snack", "items": ["1 Apfel", "1 Handvoll Mandeln"] },
      { "meal": "Mittagessen", "items": ["Quinoa-Gemüse-Pfanne", "Kichererbsen", "Olivenöl"] },
      { "meal": "Abendessen", "items": ["Linsensuppe", "Vollkornbrot", "Gemüse"] }
    ],
    "supplements": [
      "Vitamin B12 – empfohlen bei veganer Ernährung",
      "Omega-3 – sinnvoll bei geringem Fischkonsum"
    ]
  },
  "exercise": {
    "frequency": "z. B. 3x/Woche",
    "duration": "z. B. 30 Minuten",
    "type": "z. B. moderates Krafttraining oder Yoga"
  },
  "mentalHealth": "Empfehlung zur Entspannung, Schlaf, Selbstfürsorge etc.",
  "recipes": [
    {
      "title": "Veganes Kichererbsen-Curry",
      "ingredients": ["Kichererbsen", "Kokosmilch", "Spinat", "Curry-Gewürz"],
      "steps": ["Gemüse schneiden", "Kichererbsen anbraten", "Kokosmilch hinzufügen", "mit Curry würzen und köcheln lassen"]
    }
  ],
  "extra": ["Meal Prep am Wochenende", "Snacks vorbereiten für Arbeit", "Wasserflasche immer dabeihaben"]
}

Achte bei allen Angaben auf:
- wissenschaftliche Fundierung (orientiert an DGE/WHO),
- einfache, verständliche Sprache für Laien,
- einen motivierenden, positiven und sachlichen Ton.

Gib die Antwort **nur als JSON zurück** – keine Erklärungen, keine Hinweise, kein Markdown.
"""

# Benutzer-Prompt (Template mit Fragebogenfeldern)
user_prompt_template = """Nutze die folgenden Nutzerdaten aus dem Gesundheits- und Ernährungsfragebogen, um eine strukturierte, personalisierte Empfehlung zu erstellen. Liefere ausschließlich die finale Antwort im oben beschriebenen JSON-Format.

- Ernährungsweise: {dietary_preference}
- Ernährungseinschränkungen/Unverträglichkeiten: {intolerances}
- Obst/Gemüse pro Tag: {fruit_veg_servings}
- Ziele und Motivation: {goals}
- Zeit fürs Kochen (1–5): {cooking_time}
- Kochkenntnisse (1–5): {cooking_skill}
- Arbeitsalltag / Lebensstil: {work_context}
- Stresslevel (1–5): {stress_level}
- Häufigkeit Essen außer Haus / Bestellungen: {eating_out_frequency}
- Müdigkeit/Energielevel (1–5): {tiredness}
- Schlafqualität (1–5): {sleep_quality}
- Stimmungslage (1–5): {mood}
- Verdauungsbeschwerden (1–5): {digestive_issues}
- Sportliche Aktivität (Häufigkeit): {exercise_frequency}
- Gesamtbewegung pro Woche (Minuten): {weekly_activity}
- Krafttraining (pro Woche): {strength_training}
- Diagnostizierte Gesundheitsbedingungen / Nährstoffmängel: {health_conditions}
- Schwangerschaft/Stillen/Kinderwunsch: {pregnancy_status}
- Leistungssportler / harte körperliche Arbeit: {athlete_status}
- Sonstige Besonderheiten: {other_notes}

Achte darauf, dass die Empfehlungen wissenschaftlich fundiert (nach DGE/WHO-Empfehlungen) und leicht verständlich sind."""

# Funktion zum Abfragen von GPT
def ask_gpt(user_data: dict) -> str:
    """Fragt GPT nach personalisierten Ernährungsempfehlungen basierend auf Nutzerdaten."""
    user_prompt = user_prompt_template.format(**user_data)

    response = client.chat.completions.create(
        model="gpt-4o-mini",  # günstiges Modell für Testphase
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.7,
        max_tokens=1600
    )

    content = response.choices[0].message.content
    if content is None:
        raise ValueError("GPT response content is None")
    
    return content