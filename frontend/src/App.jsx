// src/App.jsx
import React, { useState } from "react";
import Form from "./components/Form";
import Result from "./components/Result";

function App() {
  const [planData, setPlanData] = useState(null); // Zustand für Ergebnis

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full py-16 px-4 bg-white shadow-md text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight mb-4">
          Dein persönlicher Gesundheitsplan
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Beantworte ein paar kurze Fragen zu deinem Lebensstil – wir erstellen dir in wenigen Sekunden deinen individuellen Gesundheitsplan.
        </p>
        <div className="mt-6">
          <a
            href="#formular"
            className="inline-block bg-teal-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow hover:bg-teal-700 transition"
          >
            Los geht's
          </a>
        </div>
      </header>

      {/* Hauptbereich */}
      <main id="formular" className="flex-grow flex items-start justify-center py-16 px-4">
        {!planData ? (
          <Form onSubmit={(planData) => setPlanData(planData)} />
        ) : (
          <Result planData={planData} onReset={() => setPlanData(null)} />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-400 py-6">
        &copy; {new Date().getFullYear()} Gesundheitsplan App. Alle Rechte vorbehalten.
      </footer>
    </div>
  );
}

export default App;