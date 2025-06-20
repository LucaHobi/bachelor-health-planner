import re

def validate_gpt_nutrition_response(text: str) -> list:
    """Validiert GPT-Antworten anhand wissenschaftlich fundierter Empfehlungen (DGE/WHO)."""
    warnings = []

    # Makronährstoffverteilung (mindestens erwähnen)
    if not re.search(r"(50\s*%.*kohlenhydrate|kohlenhydrate.*50\s*%)", text.lower()):
        warnings.append("Makronährstoffverteilung scheint unvollständig oder ungenau (z. B. Kohlenhydrate fehlen oder <50%).")

    if not re.search(r"(20\s*%.*fett|fett.*20\s*%)", text.lower()):
        warnings.append("Fettanteil nicht klar genannt oder liegt evtl. außerhalb der WHO-Empfehlung.")

    if not re.search(r"(10\s*%.*eiweiß|eiweiß.*10\s*%)", text.lower()):
        warnings.append("Eiweißanteil nicht klar benannt (z. B. <10%).")

    # Bewegung
    if "150" not in text and "2–3" not in text and "2-3" not in text:
        warnings.append("Bewegungsempfehlung fehlt oder nicht WHO-konform (z. B. ≥150 Minuten/Woche).")

    # Gemüse & Obst
    if "obst" not in text.lower() or "gemüse" not in text.lower():
        warnings.append("Obst oder Gemüse werden nicht erwähnt (DGE: 5 am Tag).")

    # Zuckerreduktion
    if "zucker reduzieren" not in text.lower() and "zuckerkonsum senken" not in text.lower():
        warnings.append("Zuckervermeidung oder -reduktion wird nicht explizit erwähnt.")

    # Vollkorn / Ballaststoffe
    if "vollkorn" not in text.lower():
        warnings.append("Hinweis auf Vollkornprodukte fehlt (Ballaststoffe empfohlen).")

    # Nahrungsergänzung mit ärztlicher Absicherung
    if "nahrungsergänzung" in text.lower() and "arzt" not in text.lower():
        warnings.append("Nahrungsergänzung wird erwähnt, aber ohne Hinweis auf ärztliche Abklärung.")

    return warnings
