export default function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg shadow-2xl max-w-3xl w-full p-5 relative">
        
        <button
          className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded"
          onClick={onClose}
        >
          Cerrar
        </button>

        {children}
      </div>
    </div>
  );
}
