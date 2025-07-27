import React from "react";

const Result = ({ planData, onReset }) => {

    if (
        !planData ||
        !planData.nutrition ||
        !planData.nutrition.nutritionSummary ||
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

const { nutrition, exercise, mentalHealth, recipeExample, extraTips } = planData;

  return (
    <section className="bg-white w-full max-w-3xl mx-auto rounded-2xl shadow-xl p-8 md:p-10 mt-10 mb-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-700 mb-8">
        Dein individueller Gesundheitsplan
      </h2>

      {/* Ernährung */}
      <Section title="🍏 Ernährung">
        <p className="mb-4 text-gray-700">{nutrition.nutritionSummary}</p>

        <h4 className="font-semibold text-gray-800 mt-4 mb-1">Makronährstoffverteilung:</h4>
        <ul className="list-disc list-inside mb-4 text-gray-800">
            <li><strong>Kohlenhydrate:</strong> {nutrition.macroDistribution.carbs}</li>
            <li><strong>Fett:</strong> {nutrition.macroDistribution.fat}</li>
            <li><strong>Eiweiß:</strong> {nutrition.macroDistribution.protein}</li>
        </ul>
        <p className="text-sm italic text-gray-600">{nutrition.macroDistribution.reasoning}</p>

        <h4 className="font-semibold text-gray-800 mt-4 mb-1">Beispiel-Tagesplan:</h4>
        {nutrition.dailyPlan.map((entry, idx) => (
            <div key={idx} className="mb-4">
            <p className="font-semibold text-teal-600">{entry.meal}</p>
            <ul className="list-disc list-inside text-sm text-gray-700 mb-1">
                {entry.items.map((item, i) => (
                <li key={i}>{item}</li>
                ))}
            </ul>
            <p className="text-xs italic text-gray-500">{entry.reasoning}</p>
            </div>
        ))}

        {nutrition.supplements?.length > 0 && (
            <>
            <h4 className="font-semibold text-gray-800 mt-6 mb-1">Nahrungsergänzung:</h4>
            <ul className="list-disc list-inside text-gray-700 text-sm">
                {nutrition.supplements.map((supp, i) => (
                <li key={i}>
                    <strong>{supp.name}</strong> ({supp.dosage}) – {supp.reasoning}
                </li>
                ))}
            </ul>
            </>
        )}
        </Section>


      {/* Bewegung */}
      <Section title="🏃 Bewegung">
        <p className="text-gray-700 mb-1">{exercise.recommendation}</p>
        <p className="text-sm text-gray-600 italic">{exercise.reasoning}</p>
      </Section>


      {/* Mentale Gesundheit */}
      <Section title="🧠 Mentales Wohlbefinden">
        <p className="text-gray-700 mb-1">{mentalHealth.recommendation}</p>
        <p className="text-sm text-gray-600 italic">{mentalHealth.reasoning}</p>
      </Section>


      {/* Rezepte */}
      {recipeExample && (
        <Section title="🍽️ Rezeptidee">
        <h4 className="font-semibold text-gray-800">{recipeExample.title}</h4>
        <p className="text-sm text-gray-700 mt-1"><strong>Zutaten:</strong></p>
        <ul className="list-disc list-inside text-sm text-gray-700 mb-1">
            {recipeExample.ingredients.map((ingr, i) => (
            <li key={i}>{ingr}</li>
            ))}
        </ul>
        <p className="text-sm text-gray-700"><strong>Zubereitung:</strong></p>
        <ol className="list-decimal list-inside text-sm text-gray-700">
            {recipeExample.steps.map((step, i) => (
            <li key={i}>{step}</li>
            ))}
        </ol>
        <p className="text-xs italic text-gray-500 mt-2">{recipeExample.reasoning}</p>
        </Section>
        )}


      {/* Alltagstipps */}
      {extraTips?.length > 0 && (
        <Section title="📌 Alltagstipps">
        <ul className="list-disc list-inside text-sm text-gray-700">
            {extraTips.map((tip, i) => (
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
