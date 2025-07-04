import React from "react";
import Form from "./components/Form";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center justify-start py-16 px-4">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12 tracking-tight">
        Dein persönlicher Gesundheitsplan
      </h1>
      <Form />
    </div>
  );
}

export default App;
