import { useState } from "react";

export default function Filters({ onFilter }) {
  const [text, setText] = useState("");
  const [success, setSuccess] = useState("all");
  const [year, setYear] = useState("all");

  const handleApply = () => {
    onFilter({
      text,
      success,
      year,
    });
  };

  return (
    <div className="bg-gray-800 p-4 mb-5 rounded grid grid-cols-1 md:grid-cols-3 gap-4">

      {/* TEXT BUSCADOR  */}
      <div>
        <label className="text-sm text-gray-300">Buscar misión</label>
        <input
          type="text"
          placeholder="Ej: Falcon"
          className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      {/* Filtro por ESTADO DE MISION */}
      <div>
        <label className="text-sm text-gray-300">Estado</label>
        <select
          className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
          value={success}
          onChange={(e) => setSuccess(e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="success">Éxito</option>
          <option value="fail">Fallo</option>
        </select>
      </div>

      {/* Filtro por ANUAL DE COHETES */}
      <div>
        <label className="text-sm text-gray-300">Año</label>
        <select
          className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="all">Todos</option>
          {Array.from({ length: 20 }).map((_, i) => {
            const y = 2024 - i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>
      </div>

      {/* btn */}
      <button
        onClick={handleApply}
        className="md:col-span-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Aplicar filtros
      </button>
    </div>
  );
}
