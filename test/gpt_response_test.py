import os
import sys
import json

# Backend-Pfad hinzufügen (damit gpt/ und validation/ gefunden werden)
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from gpt.gpt_prompt_v3 import ask_gpt
from validation.validate_gpt import validate_gpt_output_full

def load_test_data():
    """Lädt Testdaten aus der JSON-Datei"""
    with open("test/dummy_user_v2.json", "r") as f:
        return json.load(f)

def run_test():
    print("🚀 Lade Nutzerdaten …")
    user_data = load_test_data()

    print("🤖 Starte GPT-Abfrage …")
    response = ask_gpt(user_data)

    print("\n=== GPT-Antwort ===\n")
    print(response)
    
  
    print("\n🔎 Starte Validierung nach DGE/WHO/Harvard …")
    import json
    try:
        gpt_response = json.loads(response)
        validation_report = validate_gpt_output_full(gpt_response, user_data)

        for key, result in validation_report.items():
            if isinstance(result, dict):
                print(f"{key.upper()}: {result['status']} - {result['message']}")
            else:
                print(f"{key.upper()}: {result}")
    except json.JSONDecodeError:
        print("\n❌ Fehler: Antwort ist kein gültiges JSON.")
    except Exception as e:
        print(f"\n❌ Unerwarteter Fehler bei der Validierung: {e}")

if __name__ == "__main__":
    run_test()
