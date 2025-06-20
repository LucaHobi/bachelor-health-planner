import os
from openai import OpenAI
from dotenv import load_dotenv

# .env laden (für API Key)
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# System prompt: Rolle und Instruktionen
system_prompt = """Du bist ein erfahrener Ernährungswissenschaftler mit Fokus auf alltagspraktische Empfehlungen. 
Du antwortest auf Deutsch.

Deine Antworten sollen:
- strukturiert und verständlich für Laien sein (verwende kurze Absätze oder Aufzählungen),
- wissenschaftlich fundiert und nachvollziehbar sein (orientiere dich an DGE/WHO-Empfehlungen, ohne sie direkt zu zitieren),
- motivierend und positiv klingen (fördere gesunde Veränderungen im Alltag).

Beachte insbesondere:
- Gib konkrete Makronährstoffverteilungen an (z.B. prozentuale Anteile oder Beispielmahlzeiten),
- Schlage einen beispielhaften Tagesplan vor (Frühstück, Mittagessen, Abendessen, Snacks),
- Erwähne mögliche Nahrungsergänzungsmittel bei Hinweisen auf Defizite (z.B. Vitamin B12 bei vegetarischer Ernährung), weise jedoch darauf hin, dass dies ärztlich abgeklärt werden sollte,
- Integriere 1-3 praktische Alltagstipps oder kurze Rezeptideen als Beispiele,
- Vermeide unnötige Wiederholungen und Füllwörter,
- Achte auf einen freundlichen, aber sachlichen Ton."""

# Benutzer-Prompt (Template mit Fragebogenfeldern)
user_prompt_template = """Basierend auf den folgenden Angaben aus dem Gesundheits- und Ernährungsfragebogen erstelle eine personalisierte Ernährungsempfehlung:

- Ernährungsweise: {dietary_preference}
- Ernährungseinschränkungen/Unverträglichkeiten: {intolerances}
- Obst/Gemüse pro Tag: {fruit_veg_servings}
- Ziele und Motivation: {goals}
- Zeit fürs Kochen (1-5): {cooking_time}
- Kochkenntnisse (1-5): {cooking_skill}
- Arbeitsalltag / Lebensstil: {work_context}
- Stresslevel (1-5): {stress_level}
- Häufigkeit Essen außer Haus / Bestellungen: {eating_out_frequency}
- Müdigkeit/Energielevel (1-5): {tiredness}
- Schlafqualität (1-5): {sleep_quality}
- Stimmungslage (1-5): {mood}
- Verdauungsbeschwerden (1-5): {digestive_issues}
- Sportliche Aktivität (Häufigkeit): {exercise_frequency}
- Gesamtbewegung pro Woche (Minuten): {weekly_activity}
- Krafttraining (pro Woche): {strength_training}
- Diagnostizierte Gesundheitsbedingungen / Nährstoffmängel: {health_conditions}
- Schwangerschaft/Stillen/Kinderwunsch: {pregnancy_status}
- Leistungssportler / harte körperliche Arbeit: {athlete_status}
- Sonstige Besonderheiten: {other_notes}

Formuliere darauf basierend eine strukturierte, motivierende und alltagspraktische Ernährungsempfehlung, die Folgendes enthält:

1. Makronährstoffverteilung (z.B. Kohlenhydrate/Fett/Eiweiß in Prozent oder Beispielmahlzeiten),
2. Einen beispielhaften Tagesplan (Frühstück, Mittagessen, Abendessen, Snacks),
3. Hinweise auf mögliche Nahrungsergänzungsmittel bei Bedarf (z.B. Vitamin B12 bei vegetarischer Ernährung) mit dem Hinweis, dass dies ärztlich abgeklärt werden sollte,
4. 1–3 konkrete Alltagstipps oder kurze Rezepte als Beispiele.

Achte darauf, dass die Empfehlungen wissenschaftlich fundiert (nach DGE/WHO-Empfehlungen), leicht verständlich und ohne unnötige Wiederholungen formuliert sind."""

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
        max_tokens=800
    )

    content = response.choices[0].message.content
    if content is None:
        raise ValueError("GPT response content is None")
    
    return content