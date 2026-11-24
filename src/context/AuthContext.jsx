import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  limpiarSesionAnterior,
  obtenerSesion,
  postCerrarSesion,
  postIniciarSesion,
  registrarManejadorNoAutenticado,
  redirigirAIngresoSiCorresponde,
} from "../services/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const sesionModificada = useRef(false);

  useEffect(
    () =>
      registrarManejadorNoAutenticado(() => {
        sesionModificada.current = true;
        setSesion(null);
        setCargandoSesion(false);
        redirigirAIngresoSiCorresponde();
      }),
    [],
  );

  useEffect(() => {
    let activa = true;

    try {
      limpiarSesionAnterior();
    } catch (error) {
      console.error("No se pudo limpiar la sesión local anterior.", error);
    }

    obtenerSesion()
      .then((usuario) => {
        if (activa && !sesionModificada.current) {
          setSesion(usuario ? { usuario } : null);
        }
      })
      .catch((error) => {
        if (activa && !sesionModificada.current) {
          console.error("No se pudo restaurar la sesión.", error);
          setSesion(null);
        }
      })
      .finally(() => {
        if (activa) setCargandoSesion(false);
      });

    return () => {
      activa = false;
    };
  }, []);

  async function iniciarSesion({ correo, clave }) {
    const datos = await postIniciarSesion({ correo, clave });
    const nuevaSesion = { usuario: datos.usuario };
    sesionModificada.current = true;
    setSesion(nuevaSesion);
    return nuevaSesion;
  }

  async function cerrarSesion() {
    try {
      await postCerrarSesion();
      sesionModificada.current = true;
      setSesion(null);
    } catch (error) {
      console.error("No se pudo cerrar la sesión en el servidor.", error);
    }
  }

  const valor = {
    usuario: sesion?.usuario ?? null,
    estaAutenticado: Boolean(sesion?.usuario),
    cargandoSesion,
    iniciarSesion,
    cerrarSesion,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return contexto;
}