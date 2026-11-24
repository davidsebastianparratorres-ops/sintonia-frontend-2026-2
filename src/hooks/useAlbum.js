import { useCallback, useEffect, useState } from "react";
import { esErrorNoAutenticado, peticionApi } from "../services/auth.js";

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

    peticionApi(`/albumes/${encodeURIComponent(id)}`, {
      method: "GET",
      signal: controlador.signal,
    })
      .then((album) => {
        setEstado({ ...INICIAL, cargando: false, album });
      })
      .catch((falla) => {
        if (falla.name === "AbortError") return;
        if (falla.status === 404) {
          setEstado({ ...INICIAL, cargando: false, noEncontrado: true });
        } else if (!esErrorNoAutenticado(falla)) {
          setEstado({ ...INICIAL, cargando: false, error: true });
        } else {
          setEstado({ ...INICIAL, cargando: false, error: false });
        }
      });

    return () => controlador.abort();
  }, [id, intento]);

  const recargar = useCallback(() => setIntento((n) => n + 1), []);

  return { ...estado, recargar };
}