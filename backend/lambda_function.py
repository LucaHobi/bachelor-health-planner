import json
from gpt.gpt_prompt import ask_gpt
from validation.validate_gpt import validate_gpt_output

def lambda_handler(event, context):
    try:
        # Anfrage-Daten extrahieren (POST Body)
        if "body" not in event:
            return _response(400, {"error": "Fehlender Request-Body."})

        user_data = json.loads(event["body"])

        # GPT-Abfrage
        gpt_result_str = ask_gpt(user_data)

        # GPT-Antwort in JSON umwandeln
        gpt_result = json.loads(gpt_result_str)

        # Validierung
        warnings = validate_gpt_output(gpt_result, user_data)

        # Antwort zurückgeben
        return _response(200, {
            "recommendation": gpt_result,
            "warnings": warnings
        })

    except json.JSONDecodeError as e:
        return _response(500, {"error": f"Ungültiges JSON: {str(e)}"})
    except Exception as e:
        return _response(500, {"error": str(e)})

def _response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type"
        },
        "body": json.dumps(body, ensure_ascii=False)
    }
