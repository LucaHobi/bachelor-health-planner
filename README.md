# Bachelorarbeit – Serverloses System zur Erstellung personalisierter Gesundheitspläne mit KI

Dieses Repository enthält den vollständigen Quellcode zur Bachelorarbeit
**„Entwicklung eines serverlosen Systems zur Erstellung personalisierter Gesundheitspläne mithilfe generativer KI“**.
Ziel war die prototypische Umsetzung eines KI-basierten Empfehlungssystems mit Fokus auf Ernährung, basierend auf individuellen Nutzereingaben und validiert anhand von DGE- und WHO-Kriterien.

---

## Projektstruktur

Das Repository ist in zwei Hauptbereiche unterteilt:
ein **serverloses Backend** (Python, AWS Lambda) und ein **Frontend** (React, Vite).

### `backend/`

Enthält sämtliche Python-Module zur Promptgenerierung, API-Anbindung und inhaltlichen Validierung.

* `gpt/`
  Logik zur Erstellung des system- und nutzerspezifischen Prompts.
  • `gpt_prompt.py`: zentrale Prompt-Definition und GPT-Aufruf

* `validation/`
  Prüfregeln zur inhaltlichen Überprüfung der GPT-Antworten.
  • `validate_gpt.py`: Validierung strukturierter Ausgaben
  • `lambda_function.py`: Hauptfunktion zur Integration in AWS Lambda

---

### `frontend/`

Das Frontend wurde mit React und Vite umgesetzt und dient der nutzerfreundlichen Dateneingabe sowie der Darstellung personalisierter Empfehlungen.

* `src/components/`
  • `Form.jsx`: Eingabeformular für Nutzerdaten
  • `Result.jsx`: Darstellung der generierten Empfehlungen

* Weitere zentrale Dateien:
  • `App.jsx`, `main.jsx`: Einstiegspunkte der Anwendung
  • `index.html`, `index.css`: Einbindung und Styling via Tailwind CSS
  • `vite.config.js`: Vite-spezifische Konfiguration

---

## Weitere Dateien (Root-Verzeichnis)

* `.env`: Lokale Umgebungsvariablen (z. B. OpenAI-API-Key), **nicht im Repository enthalten**
* `.gitignore`: Ausschluss temporärer und sensibler Dateien
* `build_lambda_package.sh`: Shell-Skript zur Erzeugung des Deployment-ZIP-Archivs
* `deployment.zip`: resultierendes Archiv für den Upload in AWS Lambda, **nicht im Repository enthalten**
* `README.md`: Dokumentation des Projekts
