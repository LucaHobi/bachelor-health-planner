#./build_lambda_package.sh
#!/bin/bash
set -e  # Stoppt bei Fehlern

echo "📦 Starte Lambda-Build-Prozess …"

# 1. Vorbereitungen
echo "🧼 Entferne alte Verzeichnisse (falls vorhanden) …"
rm -rf build deployment.zip

echo "📁 Erstelle Build-Verzeichnis …"
mkdir -p build

# 2. Kopiere bereits erstelltes package/ (aus Docker-Container) in Build oder pip install openai --platform manylinux2014_x86_64 -t ./package --only-binary=:all: --upgrade
# dotnev
echo "📦 Kopiere vorhandenes package/ nach build/ …"
cp -r package/* build/

# 3. Kopiere Lambda-Code
echo "📂 Kopiere Lambda-Code …"
cp backend/lambda_function.py build/

mkdir -p build/gpt
cp backend/gpt/__init__.py build/gpt/
cp backend/gpt/gpt_prompt_v3.py build/gpt/

mkdir -p build/validation
cp backend/validation/__init__.py build/validation/
cp backend/validation/validate_gpt.py build/validation/

# 4. Deployment ZIP erstellen
echo "🗜️ Erzeuge deployment.zip …"
cd build
zip -r ../deployment.zip . > /dev/null
cd ..

# 5. Optional: build/ entfernen
echo "🧹 Entferne temporäre Dateien …"
rm -rf build

echo "✅ Fertig: deployment.zip ist bereit für AWS Lambda."
