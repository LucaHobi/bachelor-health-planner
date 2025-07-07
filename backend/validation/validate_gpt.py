def validate_gpt_output_full(gpt_response: dict, user_data: dict) -> dict:
    """Erweiterte Validierung der GPT-Antwort inkl. Regeln für vegetarische und vegane Ernährung nach DGE, WHO, Harvard."""
    report = {
        "supplements": {"status": "OK", "message": ""},
        "intolerances": {"status": "OK", "message": ""},
        "dailyPlan_structure": {"status": "OK", "message": ""},
        "goals_matched": {"status": "OK", "message": ""},
        "fruits_veg": {"status": "OK", "message": ""},
        "fat_ratio": {"status": "OK", "message": ""},
        "fiber_protein": {"status": "OK", "message": ""},
        "plant_protein_sources": {"status": "OK", "message": ""},
        "vegan_critical_nutrients": {"status": "N/A", "message": ""},
        "overall": "PASS"
    }

    diet = user_data.get("dietary_preference", "").lower()

    # Regel 1: Vitamin B12 bei vegetarischer oder veganer Ernährung
    if diet in ["vegetarian", "vegan"]:
        b12_found = any("b12" in s["name"].lower() for s in gpt_response["nutrition"].get("supplements", []))
        if not b12_found:
            report["supplements"]["status"] = "FAIL"
            report["supplements"]["message"] = "Vitamin B12 fehlt trotz vegetarischer/veganer Ernährung."

    # Vegan-spezifische Prüfung
    if diet == "vegan":
        report["vegan_critical_nutrients"]["status"] = "OK"
        vegan_issues = []

        supps = [s["name"].lower() for s in gpt_response["nutrition"].get("supplements", [])]

        if not any("omega" in s for s in supps):
            vegan_issues.append("Omega-3")

        if not any("vitamin d" in s for s in supps):
            vegan_issues.append("Vitamin D")

        if not any("eisen" in s or "iron" in s for s in supps):
            vegan_issues.append("Eisen")

        if vegan_issues:
            report["vegan_critical_nutrients"]["status"] = "WARN"
            report["vegan_critical_nutrients"]["message"] = f"Fehlende Hinweise auf kritische Nährstoffe bei veganer Ernährung: {', '.join(vegan_issues)}"

    # Regel 2: Laktosefreie Alternativen bei Laktoseintoleranz
    if "lactose" in user_data.get("intolerances", "").lower():
        alt_text = " ".join(gpt_response["nutrition"].get("alternatives", {}).get("intolerances", []))
        if not any(word in alt_text.lower() for word in ["laktosefrei", "sojamilch", "pflanzlich", "mandelmilch", "hafermilch"]):
            report["intolerances"]["status"] = "FAIL"
            report["intolerances"]["message"] = "Keine laktosefreien Alternativen erwähnt, obwohl Laktoseintoleranz vorliegt."

    # Regel 3: Strukturprüfung der Tagesplanung (jedes Lebensmittel einzeln gelistet)
    for meal in gpt_response["nutrition"].get("dailyPlan", []):
        if any("," in item or " mit " in item.lower() for item in meal.get("items", [])):
            report["dailyPlan_structure"]["status"] = "WARN"
            report["dailyPlan_structure"]["message"] = f"Unklare Item-Struktur in {meal['meal']}: '{meal['items']}'"

    # Regel 4: Heißhunger oder Energieziele → Protein- und Ballaststoffquellen enthalten?
    goals = user_data.get("goals", "").lower()
    if any(kw in goals for kw in ["energie", "energy", "heißhunger", "cravings"]):
        reasoning_texts = [m.get("reasoning", "").lower() for m in gpt_response["nutrition"].get("dailyPlan", [])]
        if not any(kw in r for kw in ["protein", "eiweiß", "ballaststoff", "sättigung"] for r in reasoning_texts):
            report["goals_matched"]["status"] = "WARN"
            report["goals_matched"]["message"] = "Kein Hinweis auf Protein oder Ballaststoffe trotz Energie-/Heißhungerthematik."

    # Regel 5: WHO - mindestens 5 Portionen Obst/Gemüse pro Tag
    fruits_veg_keywords = ["apfel", "banane", "karotten", "blaubeeren", "paprika", "gurke", "tomaten", "brokkoli", "obst", "gemüse", "beeren", "sprossen"]
    fruits_veg_count = sum(
        1 for meal in gpt_response["nutrition"]["dailyPlan"]
        for item in meal["items"]
        if any(veg in item.lower() for veg in fruits_veg_keywords)
    )
    if fruits_veg_count < 5:
        report["fruits_veg"]["status"] = "WARN"
        report["fruits_veg"]["message"] = f"Nur {fruits_veg_count} Obst/Gemüse-Komponenten gefunden, WHO empfiehlt mindestens 5."

    # Regel 6: Fettanteil <= 35%
    try:
        fat_str = gpt_response["nutrition"]["macroDistribution"]["fat"]
        fat_percent = int(fat_str.split("%")[0].strip())
        if fat_percent > 35:
            report["fat_ratio"]["status"] = "WARN"
            report["fat_ratio"]["message"] = f"Fettanteil beträgt {fat_percent}%, WHO empfiehlt maximal 30–35%."
    except:
        report["fat_ratio"]["status"] = "WARN"
        report["fat_ratio"]["message"] = "Fettanteil konnte nicht eindeutig validiert werden."

    # Regel 7: Ballaststoffe/Vollkorn/Pflanzenprotein erwähnt?
    reasoning = " ".join(m["reasoning"].lower() for m in gpt_response["nutrition"]["dailyPlan"])
    if not any(k in reasoning for k in ["vollkorn", "ballaststoff", "protein", "eiweiß", "hülsenfrüchte", "nüsse"]):
        report["fiber_protein"]["status"] = "WARN"
        report["fiber_protein"]["message"] = "Keine Erwähnung von Vollkorn, Ballaststoffen oder pflanzlichem Eiweiß in den Begründungen."

    # Regel 8: Mindestens 2 pflanzliche Proteinquellen
    protein_sources = ["tofu", "kichererbsen", "hummus", "mandeln", "walnüsse", "quinoa", "linsen", "soja", "tempeh"]
    protein_hits = sum(
        1 for meal in gpt_response["nutrition"]["dailyPlan"]
        for item in meal["items"]
        if any(p in item.lower() for p in protein_sources)
    )
    if protein_hits < 2:
        report["plant_protein_sources"]["status"] = "WARN"
        report["plant_protein_sources"]["message"] = f"Nur {protein_hits} pflanzliche Proteinquellen gefunden, empfohlen werden mindestens 2."

    # Gesamtbewertung
    if any(v["status"] == "FAIL" for v in report.values() if isinstance(v, dict)):
        report["overall"] = "FAIL"
    elif any(v["status"] == "WARN" for v in report.values() if isinstance(v, dict)):
        report["overall"] = "WARN"

    return report
