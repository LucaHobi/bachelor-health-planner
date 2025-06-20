import os
import sys
import json

# Backend-Pfad hinzufügen (damit gpt/ und validation/ gefunden werden)
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from gpt.gpt_prompt_v2 import ask_gpt
from validation.validate_response import validate_gpt_nutrition_response

def load_test_data():
    """Lädt Testdaten aus der JSON-Datei"""
    with open("test/dummy_user.json", "r") as f:
        return json.load(f)

def run_test():
    print("🚀 Lade Nutzerdaten …")
    user_data = load_test_data()

    print("🤖 Starte GPT-Abfrage …")
    response = ask_gpt(user_data)

    print("\n=== GPT-Antwort ===\n")
    print(response)
    
    print("\n🔎 Starte Validierung nach DGE/WHO …")
    warnings = validate_gpt_nutrition_response(response)

    if warnings:
        print("\n⚠️ Hinweise zur wissenschaftlichen Fundierung:")
        for w in warnings:
            print("-", w)
    else:
        print("\n✅ Alle Kernpunkte erfüllt (DGE/WHO-kompatibel).")

if __name__ == "__main__":
    run_test()
