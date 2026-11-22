import { createContext, useContext, useState } from "react";
import {
  guardarSesion,
  leerSesion,
  limpiarSesion,
  postIniciarSesion,
} from "../services/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(() => leerSesion());

  async function iniciarSesion({ correo, clave, recordar }) {
    const datos = await postIniciarSesion({ correo, clave });
    const nuevaSesion = {
      usuario: datos.usuario,
      token: datos.token,
    };
    guardarSesion(nuevaSesion, recordar);
    setSesion(nuevaSesion);
    return nuevaSesion;
  }

  function cerrarSesion() {
    limpiarSesion();
    setSesion(null);
  }

  const valor = {
    usuario: sesion?.usuario ?? null,
    token: sesion?.token ?? null,
    estaAutenticado: Boolean(sesion?.token),
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