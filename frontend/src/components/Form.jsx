import React, { useState, useRef } from "react";

const Form = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        dietary_preference: "vegetarisch",
        intolerances: "Laktose",
        fruit_veg_servings: "3",
        goals: "fit bleiben",
        cooking_time: "4",
        cooking_skill: "3",
        work_context: "Bürojob mit wenig Bewegung",
        stress_level: "2",
        eating_out_frequency: "1–2x pro Woche",
        tiredness: "2",
        sleep_quality: "4",
        mood: "3",
        digestive_issues: "2",
        exercise_frequency: "2x/Woche Joggen",
        weekly_activity: "120",
        strength_training: "1",
        health_conditions: "Vitamin-B-Mangel",
        pregnancy_status: "nein",
        athlete_status: "nein",
        other_notes: "Wenig Zeit unter der Woche"
    });

    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({});

    const fieldRefs = {
        dietary_preference: useRef(null),
        fruit_veg_servings: useRef(null),
        goals: useRef(null),
        // weitere Pflichtfelder, falls nötig
    };      

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors = {};
      
        // Pflichtfelder (du kannst beliebig ergänzen)
        if (!formData.dietary_preference) newErrors.dietary_preference = "Bitte wähle deine Ernährungsweise.";
        if (!formData.goals) newErrors.goals = "Bitte gib dein Ziel an.";
        if (!formData.fruit_veg_servings) newErrors.fruit_veg_servings = "Bitte gib an, wie viele Portionen du isst.";
      
        return newErrors;
    };
    
    const hasErrors = Object.keys(errors).length > 0;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);

            const firstErrorKey = Object.keys(validationErrors)[0];
            const firstErrorRef = fieldRefs[firstErrorKey];
          
            if (firstErrorRef?.current) {
              firstErrorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
              firstErrorRef.current.focus?.();
            }
          
            return;
        }
      
        setErrors({});
        setLoading(true);
        //await new Promise((resolve) => setTimeout(resolve, 2000));// Simulate backend delay

        try {
            const response = await fetch("https://f4kw1ii854.execute-api.eu-central-1.amazonaws.com/dev/generate-plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData), // Achtung: Kein { body: formData }!
            });
        
            const result = await response.json();
            console.log("Antwort von Lambda:", result);
        
            const parsed = JSON.parse(result.recommendation);
            onSubmit(parsed);
            
        } catch (error) {
            console.error("Fehler beim Erstellen des Plans:", error);
            alert("Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section
            id="form"
            className="bg-white w-full max-w-3xl mx-auto rounded-2xl shadow-xl p-8 md:p-10"
        >
            <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-700 mb-8">
                Dein persönlicher Gesundheitsprofil
            </h2>

            <form onSubmit={handleSubmit}  className={`space-y-6 p-4 rounded-xl transition-all ${
                hasErrors ? 'border-2 border-red-400 shadow-red-200' : ''
                }`}
            >
                {/* Globale Fehlermeldung */}
                {hasErrors && (
                    <div className="bg-red-50 border border-red-300 text-red-700 text-sm p-3 rounded mb-6 text-center">
                        Bitte fülle alle Pflichtfelder korrekt aus.
                    </div>
                )}

                {/* Nutrition Section */}
                <fieldset>
                    <legend className="text-lg font-semibold text-gray-700 mb-4">
                        Ernährung
                    </legend>
                    <FormGroup
                        label="Ernährungsweise"
                        name="dietary_preference"
                        type="select"
                        value={formData.dietary_preference}
                        onChange={handleChange}
                        options={["omnivor", "vegetarisch", "vegan"]}
                        error={errors.dietary_preference}
                        inputRef={fieldRefs.dietary_preference}
                    />
                    <FormGroup
                        label="Unverträglichkeiten"
                        name="intolerances"
                        type="text"
                        value={formData.intolerances}
                        onChange={handleChange}
                    />
                    <FormGroup
                        label="Portionen Obst/Gemüse pro Tag"
                        name="fruit_veg_servings"
                        type="number"
                        value={formData.fruit_veg_servings}
                        onChange={handleChange}
                        error={errors.fruit_veg_servings}
                        inputRef={fieldRefs.fruit_veg_servings}
                    />
                </fieldset>

                {/* Goals & Lifestyle Section */}
                <fieldset>
                    <legend className="text-lg font-semibold text-gray-700 mb-4">
                        Ziele & Alltag
                    </legend>
                    <FormGroup
                        label="Ziele & Motivation"
                        name="goals"
                        type="text"
                        value={formData.goals}
                        onChange={handleChange}
                        error={errors.goals}
                        inputRef={fieldRefs.goals}
                    />
                    <FormGroup
                        label="Zeit zum Kochen (1 = keine Zeit – 5 = viel Zeit)"
                        name="cooking_time"
                        type="range"
                        value={formData.cooking_time}
                        onChange={handleChange}
                    />
                    <FormGroup
                        label="Kochkenntnisse (1 = keine – 5 = Profi)"
                        name="cooking_skill"
                        type="range"
                        value={formData.cooking_skill}
                        onChange={handleChange}
                    />
                    <FormGroup
                        label="Lebensstil / Arbeitsumfeld"
                        name="work_context"
                        type="text"
                        value={formData.work_context}
                        onChange={handleChange}
                    />
                    <FormGroup
                        label="Essverhalten außer Haus"
                        name="eating_out_frequency"
                        type="text"
                        value={formData.eating_out_frequency}
                        onChange={handleChange}
                    />
                </fieldset>

                {/* Well-being Section */}
                <fieldset>
                    <legend className="text-lg font-semibold text-gray-700 mb-4">
                        Wohlbefinden
                    </legend>
                    <FormGroup
                        label="Stresslevel"
                        name="stress_level"
                        type="range"
                        value={formData.stress_level}
                        onChange={handleChange}
                    />
                    <FormGroup
                        label="Müdigkeit / Energielevel"
                        name="tiredness"
                        type="range"
                        value={formData.tiredness}
                        onChange={handleChange}
                    />
                    <FormGroup
                        label="Schlafqualität"
                        name="sleep_quality"
                        type="range"
                        value={formData.sleep_quality}
                        onChange={handleChange}
                    />
                    <FormGroup
                        label="Stimmung"
                        name="mood"
                        type="range"
                        value={formData.mood}
                        onChange={handleChange}
                    />
                    <FormGroup
                        label="Verdauung"
                        name="digestive_issues"
                        type="range"
                        value={formData.digestive_issues}
                        onChange={handleChange}
                    />
                </fieldset>

                {/* Movement & Health Section */}
                <fieldset>
                    <legend className="text-lg font-semibold text-gray-700 mb-4">
                        Bewegung & Gesundheit
                    </legend>
                    <FormGroup
                        label="Sporthäufigkeit (z. B. 2x/Woche Joggen)"
                        name="exercise_frequency"
                        type="text"
                        value={formData.exercise_frequency}
                        onChange={handleChange}
                    />
                    <FormGroup
                        label="Bewegung pro Woche (in Minuten)"
                        name="weekly_activity"
                        type="number"
                        value={formData.weekly_activity}
                        onChange={handleChange}
                    />
                    <FormGroup
                        label="Krafttraining pro Woche (Anzahl Einheiten)"
                        name="strength_training"
                        type="number"
                        value={formData.strength_training}
                        onChange={handleChange}
                    />
                    <FormGroup
                        label="Bekannte Erkrankungen oder Nährstoffmängel"
                        name="health_conditions"
                        type="text"
                        value={formData.health_conditions}
                        onChange={handleChange}
                    />
                    <FormGroup
                        label="Schwangerschaft / Stillen / Kinderwunsch"
                        name="pregnancy_status"
                        type="select"
                        value={formData.pregnancy_status}
                        onChange={handleChange}
                        options={["ja", "nein"]}
                    />
                    <FormGroup
                        label="Leistungssport oder harte körperliche Arbeit?"
                        name="athlete_status"
                        type="select"
                        value={formData.athlete_status}
                        onChange={handleChange}
                        options={["ja", "nein"]}
                    />
                </fieldset>

                {/* Miscellaneous Section */}
                <fieldset>
                    <legend className="text-lg font-semibold text-gray-700 mb-4">
                        Sonstiges
                    </legend>
                    <FormGroup
                        label="Sonstige Hinweise"
                        name="other_notes"
                        type="textarea"
                        value={formData.other_notes}
                        onChange={handleChange}
                    />
                </fieldset>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-6 font-semibold rounded-lg transition-colors ${
                            loading
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                : "bg-teal-600 text-white hover:bg-teal-700"
                        }`}
                    >
                        {loading ? "Wird erstellt…" : "Empfehlung generieren"}
                    </button>
                </div>
            </form>
        </section>
    );
};

// Helper component for consistent styling
const FormGroup = ({
    label,
    name,
    type,
    value,
    onChange,
    options,
    min = 1,
    max = 5,
    error,
    inputRef
}) => (
    <div className="mb-4" ref={inputRef}>
        <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-600 mb-1"
        >
            {label}
        </label>

        {type === "select" ? (
            <>
            <select
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                className={`w-full p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 focus:ring-teal-400`}
            >
                <option value="">Bitte wählen</option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                ))}
            </select>
            {error && <p className="text-sm text-orange-600 mt-1">{error}</p>}
            </>
        ) : type === "textarea" ? (
            <>
            <textarea
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                rows={4}
                className={`w-full p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 focus:ring-teal-400`}
            />
            {error && <p className="text-sm text-orange-600 mt-1">{error}</p>}
            </>
        ) : type === "range" ? (
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{min}</span>
                <input
                    type="range"
                    name={name}
                    id={name}
                    min={min}
                    max={max}
                    value={value}
                    onChange={onChange}
                    className="w-full"
                />
                <span className="text-sm text-gray-500">{max}</span>
            </div>
        ) : (
            <>
            <input
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                className={`w-full p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 focus:ring-teal-400`}
            />
            {error && <p className="text-sm text-orange-600 mt-1">{error}</p>}
            </>
        )}
    </div>
);

export default Form;
