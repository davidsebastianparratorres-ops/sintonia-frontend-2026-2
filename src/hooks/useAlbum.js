import { useCallback, useEffect, useState } from "react";
import { API_BASE } from "../config/api.js";

const INICIAL = {
  album: null,
  cargando: true,
  error: false,
  noEncontrado: false,
};

/**
 * GET /albumes/:id
 * - 404 (no_encontrado) -> noEncontrado: true (la página muestra "no encontrado")
 * - cualquier otro fallo -> error: true (con recargar() para reintentar)
 */
export default function useAlbum(id) {
  const [estado, setEstado] = useState(INICIAL);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    if (!id) return undefined;
    const controlador = new AbortController();
    setEstado(INICIAL);

    const base = String(API_BASE).replace(/\/$/, "");

    fetch(`${base}/albumes/${encodeURIComponent(id)}`, {
      signal: controlador.signal,
    })
      .then(async (respuesta) => {
        if (respuesta.status === 404) {
          setEstado({ ...INICIAL, cargando: false, noEncontrado: true });
          return;
        }
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
        const album = await respuesta.json();
        setEstado({ ...INICIAL, cargando: false, album });
      })
      .catch((falla) => {
        if (falla.name === "AbortError") return;
        setEstado({ ...INICIAL, cargando: false, error: true });
      });

    return () => controlador.abort();
  }, [id, intento]);

  const recargar = useCallback(() => setIntento((n) => n + 1), []);

  return { ...estado, recargar };
}