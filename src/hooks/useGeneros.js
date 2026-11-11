import { useEffect, useState } from "react";
import API_BASE_URL from "../config/api";

export function useGeneros() {
  const [generos, setGeneros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let activo = true;

    async function cargar() {
      try {
        const respuesta = await fetch(`${API_BASE_URL}/generos`);
        if (!respuesta.ok) throw new Error(respuesta.status);
        const json = await respuesta.json();
        if (activo) setGeneros(json.datos ?? []);
      } catch {
        if (activo) setError(true);
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargar();
    return () => {
      activo = false;
    };
  }, []);

  return { generos, cargando, error };
}