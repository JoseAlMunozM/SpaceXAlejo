export default function Table({ columns, data, onRowClick }) {
  return (
    <div className="overflow-x-auto rounded-lg shadow-lg border border-blue-900">
      <table className="w-full border-collapse">

        {/* Encabezado */}
        <thead className="bg-blue-900/70 text-white">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-6 py-3 text-left text-sm font-bold tracking-wider"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        {/* Filas */}
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              onClick={() => onRowClick?.(row)}
              className="cursor-pointer hover:bg-blue-900/30 border-b border-blue-900 transition"
            >
              {columns.map((col) => (
                <td key={col} className="px-6 py-3 text-sm">
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
