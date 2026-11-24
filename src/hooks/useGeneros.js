import { useCallback, useEffect, useState } from "react";
import { esErrorNoAutenticado, peticionApi } from "../services/auth.js";

export function useGeneros() {
  const [generos, setGeneros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError(false);

    async function cargar() {
      try {
        const json = await peticionApi("/generos");
        if (activo) setGeneros(json.datos ?? []);
      } catch (error) {
        if (activo && !esErrorNoAutenticado(error)) setError(true);
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargar();
    return () => {
      activo = false;
    };
  }, [intento]);

  const recargar = useCallback(() => setIntento((n) => n + 1), []);

  return { generos, cargando, error, recargar };
}