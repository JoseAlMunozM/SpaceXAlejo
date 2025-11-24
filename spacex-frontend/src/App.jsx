import { useEffect, useState } from "react";
import { fetchLaunches } from "./services/spacexService";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const result = await fetchLaunches();
      setData(result);
    }
    load();
  }, []);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial", color: "white" }}>
      <h1>SpaceX Launches</h1>

      {!data && <p>Cargando datos...</p>}

      {data && (
        <div>
          <p><strong>Mensaje:</strong> {data.message}</p>
          <p><strong>Items escritos:</strong> {data.items_written}</p>
        </div>
      )}
    </div>
  );
}

export default App;
