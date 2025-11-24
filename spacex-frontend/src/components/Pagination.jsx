export default function Pagination({ page, totalPages, onChange }) {
  return (
    <div className="flex gap-4 mt-5 justify-center">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="px-4 py-2 bg-gray-700 disabled:opacity-30 rounded"
      >
        Anterior
      </button>

      <span className="text-white">
        Página {page} de un total de {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="px-4 py-2 bg-gray-700 disabled:opacity-30 rounded"
      >
        Siguiente
      </button>
    </div>
  );
}
