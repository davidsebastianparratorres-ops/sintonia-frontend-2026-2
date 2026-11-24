// hooks/useGenero.js
import { useCallback, useEffect, useState } from "react";
import { esErrorNoAutenticado, peticionApi } from "../services/auth.js";

export function useGenero(id) {
  const [detalle, setDetalle] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(false);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    if (!id) {
      setDetalle(null);
      setCargando(false);
      setError(false);
      return;
    }
    const controlador = new AbortController();
    setCargando(true);
    setError(false);

    async function cargar() {
      try {
        const json = await peticionApi(`/generos/${encodeURIComponent(id)}`, {
          method: "GET",
          signal: controlador.signal,
        });
        setDetalle(json?.datos ?? json);
      } catch (e) {
        if (
          e.name !== "AbortError" &&
          !esErrorNoAutenticado(e)
        ) setError(true);
      } finally {
        if (!controlador.signal.aborted) setCargando(false);
      }
    }

    cargar();

    return () => controlador.abort();
  }, [id, intento]);

  const recargar = useCallback(() => setIntento((n) => n + 1), []);

  return { detalle, cargando, error, recargar };
}
