import { useEffect, useState } from "react";
import { fetchLaunches } from "../api/spacexService";

export function useLaunches() {
  const [launches, setLaunches] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchLaunches();

        setLaunches(data.launches || []);
        setMeta({
          message: data.message,
          items_written: data.items_written
        });
      } catch (err) {
        console.error("Error cargando lanzamientos", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { launches, meta, loading };
}
