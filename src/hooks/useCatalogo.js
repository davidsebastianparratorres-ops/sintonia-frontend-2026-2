import { useCallback, useEffect, useState } from "react";
import { esErrorNoAutenticado, peticionApi } from "../services/auth.js";

export function useCatalogo({ orden = "populares", limite = 6 } = {}) {
  const [albumes, setAlbumes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();

    async function cargar() {
      setCargando(true);
      setError(false);
      try {
        const params = new URLSearchParams({ orden, limite });
        const json = await peticionApi(`/albumes?${params}`, {
          method: "GET",
          signal: controlador.signal,
        });
        setAlbumes(json?.datos ?? json);
      } catch (err) {
        if (err.name !== "AbortError") {
          if (!esErrorNoAutenticado(err)) {
            console.error("Error al cargar álbumes:", err);
            setError(true);
          }
        }
      } finally {
        if (!controlador.signal.aborted) setCargando(false);
      }
    }

    cargar();
    return () => controlador.abort();
  }, [orden, limite, intento]);

  const recargar = useCallback(() => setIntento((n) => n + 1), []);

  return { albumes, cargando, error, recargar };
}
