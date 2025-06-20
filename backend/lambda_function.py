import json
from gpt.gpt_prompt_v2 import ask_gpt
from validation.validate_response import validate_gpt_nutrition_response

def lambda_handler(event, context):
    try:
        # Anfrage-Daten extrahieren (POST Body)
        if "body" not in event:
            return _response(400, {"error": "Fehlender Request-Body."})

        user_data = json.loads(event["body"])

        # GPT-Abfrage
        gpt_result = ask_gpt(user_data)

        # Validierung
        warnings = validate_gpt_nutrition_response(gpt_result)

        # Antwort zurückgeben
        return _response(200, {
            "recommendation": gpt_result,
            "warnings": warnings
        })

    except Exception as e:
        return _response(500, {"error": str(e)})

def _response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps(body, ensure_ascii=False)
    }
