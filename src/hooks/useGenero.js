// hooks/useGenero.js
import { useCallback, useEffect, useState } from "react";
import API_BASE_URL from "../config/api";

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
        const respuesta = await fetch(`${API_BASE_URL}/generos/${id}`, {
          signal: controlador.signal,
        });
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
        const json = await respuesta.json();
        setDetalle(json?.datos ?? json);
      } catch (e) {
        if (e.name !== "AbortError") setError(true);
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
