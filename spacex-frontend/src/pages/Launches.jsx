import Layout from "../components/Layout";
import Loader from "../components/Loader";
import Table from "../components/Table";
import { useLaunches } from "../hooks/useLaunches";
import { useState } from "react";
import Modal from "../components/Modal";

export default function Launches() {
  const { launches, meta, loading } = useLaunches();
  const [selected, setSelected] = useState(null);

  // BUSCA Y FILTROS
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // PAGINAS A 25 campos 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25; // cantidad de filas por página en caso de que se requieran modificar cambiamo ese 25 por la cantidad a filas

  if (loading) return <Loader />;

  const columns = ["Misión", "Fecha", "Cohete lanzado", "Estado Mision"];

  const tableData = launches.map((launch) => ({
    ...launch,
    ID: launch.id,
    "Misión": launch.mission_name,
    "Fecha": new Date(launch.launch_date).toLocaleDateString(),
    "Cohete lanzado": launch.rocket_name,
    "Estado Mision": launch.success === "True" ? "EXITO" : "FALLIDO",
  }));

  // FILTROS de la propia tabla
  const filteredData = tableData.filter((item) => {
    const matchesSearch =
      item["Misión"].toLowerCase().includes(search.toLowerCase()) ||
      item["Cohete lanzado"].toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "ALL" ? true : item["Estado Mision"] === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // ----------- PAGINACIÓN-----------
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goPrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">🚀🔥 Bienvenido 🚀🔥 a  Consulta XSPACE </h1>

      <div className="card p-6 rounded-lg mb-6 border border-blue-900 shadow-xl">
        <p>
          <strong className="text-blue-400">Mensaje:</strong> {meta?.message}
        </p>
        <p>
          <strong className="text-blue-400">Lanzamientos Registrados:</strong>{" "}
          {meta?.items_written}
        </p>
      </div>

      {/* CONTROLES */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar misión o cohete..."
          className="px-4 py-2 rounded bg-gray-800 border border-blue-900 text-white w-1/2"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset cuando ponemos cosas en el buscador de textoi 
          }}
        />

        <select
          className="px-4 py-2 rounded bg-gray-800 border border-blue-900 text-white"
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1); // reset de filtros 
          }}
        >
          <option value="ALL">Todos</option>
          <option value="EXITO">ÉXITO</option>
          <option value="FALLIDO">FALLIDO</option>
        </select>
      </div>

      <Table 
        columns={columns}
        data={paginatedData}
        onRowClick={setSelected}
      />

      {/* BOTONES DE PAGINACIÓN */}
      <div className="flex justify-between items-center mt-6 px-2">
        <button
          className="px-4 py-2 bg-gray-800 border border-blue-900 rounded disabled:opacity-40"
          onClick={goPrev}
          disabled={currentPage === 1}
        >
          Anterior
        </button>

        <span className="text-blue-400">
          Página {currentPage} de {totalPages}
        </span>

        <button
          className="px-4 py-2 bg-gray-800 border border-blue-900 rounded disabled:opacity-40"
          onClick={goNext}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>

      {/* MODAL */}
      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div>
            <h2 className="text-2xl font-bold mb-2">{selected.mission_name}</h2>

            <p><strong>Fecha:</strong> {new Date(selected.launch_date).toLocaleString()}</p>
            <p><strong>Cohete:</strong> {selected.rocket_name}</p>
            <p><strong>Estado:</strong> {selected.success === "True" ? "Éxito" : "Fallido"}</p>

            {selected.details && (
              <p className="mt-2"><strong>Detalles:</strong> {selected.details}</p>
            )}

            {selected.rocket_description && (
              <p className="mt-2"><strong>Descripción del cohete:</strong> {selected.rocket_description}</p>
            )}

            {selected.rocket_images?.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {selected.rocket_images.slice(0, 4).map((img, idx) => (
                  <img key={idx} src={img} alt="Rocket" className="rounded-lg border border-gray-700" />
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </Layout>
  );
}
