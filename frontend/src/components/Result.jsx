import React from "react";

const Result = ({ planData, onReset }) => {

    if (
        !planData ||
        !planData.nutrition ||
        !planData.nutrition.macroDistribution ||
        !planData.exercise ||
        !planData.mentalHealth
      ) {
        return (
          <section className="text-center py-10 text-gray-500">
            <p>Die Antwort konnte nicht vollständig verarbeitet werden.</p>
            <button
              onClick={onReset}
              className="mt-4 px-6 py-2 border border-teal-600 text-teal-600 font-semibold rounded hover:bg-teal-50 transition"
            >
              Neue Eingabe starten
            </button>
          </section>
        );
      }
      console.warn("Unvollständiger Plan:", planData);

  const { nutrition, exercise, mentalHealth, recipes, extra } = planData;

  return (
    <section className="bg-white w-full max-w-3xl mx-auto rounded-2xl shadow-xl p-8 md:p-10 mt-10 mb-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-700 mb-8">
        Dein individueller Gesundheitsplan
      </h2>

      {/* Ernährung */}
      <Section title="🍏 Ernährung">
        <p className="mb-4 text-gray-700">{nutrition.summary}</p>

        <h4 className="font-semibold text-gray-800 mt-4 mb-1">Makronährstoffverteilung:</h4>
        <ul className="list-disc list-inside mb-4 text-gray-800">
          <li><strong>Kohlenhydrate:</strong> {nutrition.macroDistribution.carbs}</li>
          <li><strong>Fett:</strong> {nutrition.macroDistribution.fat}</li>
          <li><strong>Eiweiß:</strong> {nutrition.macroDistribution.protein}</li>
        </ul>

        <h4 className="font-semibold text-gray-800 mt-4 mb-1">Beispiel-Tagesplan:</h4>
        <ul className="space-y-2">
          {nutrition.dayPlan.map((entry, idx) => (
            <li key={idx}>
              <strong>{entry.meal}:</strong>
              <ul className="list-disc list-inside pl-4 text-sm text-gray-700">
                {entry.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {nutrition.supplements?.length > 0 && (
          <>
            <h4 className="font-semibold text-gray-800 mt-6 mb-1">Nahrungsergänzung:</h4>
            <ul className="list-disc list-inside text-gray-700 text-sm">
              {nutrition.supplements.map((supp, i) => (
                <li key={i}>{supp}</li>
              ))}
            </ul>
          </>
        )}
      </Section>

      {/* Bewegung */}
      <Section title="🏃 Bewegung">
        <ul className="list-disc list-inside text-gray-700 text-sm">
          <li><strong>Häufigkeit:</strong> {exercise.frequency}</li>
          <li><strong>Dauer:</strong> {exercise.duration}</li>
          <li><strong>Art:</strong> {exercise.type}</li>
        </ul>
      </Section>

      {/* Mentale Gesundheit */}
      <Section title="🧠 Mentales Wohlbefinden">
        <p className="text-gray-700">{mentalHealth}</p>
      </Section>

      {/* Rezepte */}
      {recipes?.length > 0 && (
        <Section title="🍽️ Rezeptideen">
          {recipes.map((recipe, idx) => (
            <div key={idx} className="mb-4">
              <h4 className="font-semibold text-gray-800">{recipe.title}</h4>
              <p className="text-sm text-gray-700 mt-1"><strong>Zutaten:</strong></p>
              <ul className="list-disc list-inside text-sm text-gray-700 mb-1">
                {recipe.ingredients.map((ingr, i) => (
                  <li key={i}>{ingr}</li>
                ))}
              </ul>
              <p className="text-sm text-gray-700"><strong>Zubereitung:</strong></p>
              <ol className="list-decimal list-inside text-sm text-gray-700">
                {recipe.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          ))}
        </Section>
      )}

      {/* Alltagstipps */}
      {extra?.length > 0 && (
        <Section title="📌 Alltagstipps">
          <ul className="list-disc list-inside text-sm text-gray-700">
            {extra.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Aktionen */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={onReset}
          className="px-6 py-3 border border-teal-600 text-teal-600 font-semibold rounded hover:bg-teal-50 transition"
        >
          Neue Eingabe starten
        </button>
      </div>
    </section>
  );
};

// Section Wrapper-Komponente
const Section = ({ title, children }) => (
  <div className="mb-10">
    <h3 className="text-xl font-semibold text-teal-700 mb-2">{title}</h3>
    <div className="bg-gray-50 p-4 rounded-lg shadow-inner">{children}</div>
  </div>
);

export default Result;
