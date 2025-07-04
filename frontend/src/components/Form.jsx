import React, { useState } from "react";

const Form = () => {
  const [formData, setFormData] = useState({
    dietary_preference: "",
    intolerances: "",
    fruit_veg_servings: "",
    goals: "",
    cooking_time: "3",
    cooking_skill: "3",
    work_context: "",
    stress_level: "3",
    eating_out_frequency: "",
    tiredness: "3",
    sleep_quality: "3",
    mood: "3",
    digestive_issues: "3",
    exercise_frequency: "",
    weekly_activity: "",
    strength_training: "",
    health_conditions: "",
    pregnancy_status: "",
    athlete_status: "",
    other_notes: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("https://<DEINE-LAMBDA-URL>", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: formData })
    });

    const result = await response.json();
    console.log("Antwort:", result);
  };

return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl p-8 bg-white shadow-xl rounded-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Ernährung & Gesundheit</h2>


            {/* Helper for repeated structure */}
            {[
                { label: "Ernährungsweise", name: "dietary_preference", type: "select", options: ["omnivor", "vegetarisch", "vegan"] },
                { label: "Unverträglichkeiten", name: "intolerances", type: "text" },
                { label: "Portionen Obst/Gemüse pro Tag", name: "fruit_veg_servings", type: "number" },
                { label: "Ziele & Motivation", name: "goals", type: "text" },
                { label: "Zeit zum Kochen (1 = keine Zeit – 5 = viel Zeit)", name: "cooking_time", type: "range", min: 1, max: 5 },
                { label: "Kochkenntnisse (1 = keine – 5 = Profi)", name: "cooking_skill", type: "range", min: 1, max: 5 },
                { label: "Lebensstil / Arbeitsumfeld", name: "work_context", type: "text" },
                { label: "Stresslevel", name: "stress_level", type: "range", min: 1, max: 5 },
                { label: "Essverhalten außer Haus", name: "eating_out_frequency", type: "text" },
                { label: "Müdigkeit / Energielevel", name: "tiredness", type: "range", min: 1, max: 5 },
                { label: "Schlafqualität", name: "sleep_quality", type: "range", min: 1, max: 5 },
                { label: "Stimmung", name: "mood", type: "range", min: 1, max: 5 },
                { label: "Verdauung", name: "digestive_issues", type: "range", min: 1, max: 5 },
                { label: "Sporthäufigkeit (z. B. \"2x/Woche Joggen\")", name: "exercise_frequency", type: "text" },
                { label: "Bewegung pro Woche (in Minuten)", name: "weekly_activity", type: "number" },
                { label: "Krafttraining pro Woche (Anzahl Einheiten)", name: "strength_training", type: "number" },
                { label: "Bekannte Erkrankungen oder Nährstoffmängel", name: "health_conditions", type: "text" },
                { label: "Schwangerschaft / Stillen / Kinderwunsch", name: "pregnancy_status", type: "select", options: ["ja", "nein"] },
                { label: "Leistungssport oder harte körperliche Arbeit?", name: "athlete_status", type: "select", options: ["ja", "nein"] },
                { label: "Sonstige Hinweise", name: "other_notes", type: "textarea" }
            ].map(({ label, name, type, options, min, max }) => (
                <div key={name} className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-600" htmlFor={name}>{label}</label>
                    {type === "select" ? (
                        <select
                            name={name}
                            id={name}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData[name]}
                            onChange={handleChange}
                        >
                            <option value="">Bitte wählen</option>
                            {options.map(opt => (
                                <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                            ))}
                        </select>
                    ) : type === "textarea" ? (
                        <textarea
                            name={name}
                            id={name}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData[name]}
                            onChange={handleChange}
                            rows={4}
                        />
                    ) : type === "range" ? (
                        <input
                            type="range"
                            name={name}
                            id={name}
                            min={min}
                            max={max}
                            value={formData[name]}
                            onChange={handleChange}
                            className="w-full"
                        />
                    ) : (
                        <input
                            type={type}
                            name={name}
                            id={name}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData[name]}
                            onChange={handleChange}
                        />
                    )}
                </div>
            ))}

            <button
                type="submit"
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
                Empfehlung generieren
            </button>
        </form>
    </div>
);
};

export default Form;
