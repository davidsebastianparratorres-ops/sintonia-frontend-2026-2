import API_BASE_URL from "../config/api.js";

const CLAVE_SESION_ANTERIOR = "sintonia_sesion";
const RUTAS_SIN_REDIRECCION = [
  "/ingresar",
  "/crear-cuenta",
  "/recuperar-clave",
];
const manejadoresNoAutenticado = new Set();

export function registrarManejadorNoAutenticado(manejador) {
  manejadoresNoAutenticado.add(manejador);
  return () => manejadoresNoAutenticado.delete(manejador);
}

export function esErrorNoAutenticado(error) {
  return error?.status === 401 && error?.codigo === "no_autenticado";
}

function interceptarNoAutenticado() {
  manejadoresNoAutenticado.forEach((manejador) => {
    try {
      manejador();
    } catch (error) {
      console.error("No se pudo procesar el cierre de sesión.", error);
    }
  });
}

function estaEnRutaPublicaDeSesion() {
  const rutaActual = window.location.pathname;
  return RUTAS_SIN_REDIRECCION.some(
    (ruta) => rutaActual === ruta || rutaActual.startsWith(`${ruta}/`),
  );
}

export function redirigirAIngresoSiCorresponde() {
  if (!estaEnRutaPublicaDeSesion()) {
    window.location.replace("/ingresar");
  }
}

export function limpiarSesionAnterior() {
  localStorage.removeItem(CLAVE_SESION_ANTERIOR);
  sessionStorage.removeItem(CLAVE_SESION_ANTERIOR);
}

// --- HELPER DE PETICIONES ---

export async function peticionApi(
  ruta,
  { method = "GET", cuerpo, signal, headers } = {},
) {
  let respuesta;
  try {
    respuesta = await fetch(`${API_BASE_URL}${ruta}`, {
      method,
      credentials: "include",
      signal,
      ...(headers ? { headers } : {}),
      ...(cuerpo === undefined
        ? {}
        : {
            headers: {
              "Content-Type": "application/json",
              ...(headers ?? {}),
            },
            body: JSON.stringify(cuerpo),
          }),
    });
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    // Sin respuesta (no hay red)
    throw { tipo: "red", status: 0 };
  }

  let datos = null;
  try {
    datos = await respuesta.json();
  } catch {
    datos = null;
  }

  if (!respuesta.ok) {
    const retryAfter = respuesta.headers.get("Retry-After");
    const error =
      datos?.error && typeof datos.error === "object" ? datos.error : datos;
    const codigoError =
      error?.codigo ||
      datos?.codigo ||
      (typeof datos?.error === "string" ? datos.error : null);
    const esNoAutenticado =
      respuesta.status === 401 && codigoError === "no_autenticado";

    if (
      esNoAutenticado &&
      !(
        ruta.split("?")[0] === "/sesion" &&
        ["GET", "POST"].includes(method.toUpperCase())
      )
    ) {
      interceptarNoAutenticado();
    }

    throw {
      tipo: "api",
      status: respuesta.status,
      codigo: codigoError,
      mensaje: error?.mensaje || datos?.mensaje || null,
      campos: error?.campos || datos?.campos || {},
      retryAfter: retryAfter ? Number(retryAfter) : null,
    };
  }

  return datos;
}

async function peticionAuth(ruta, opciones = {}) {
  return peticionApi(ruta, opciones);
}

// --- ENDPOINTS DEL CONTRATO ---

export function postIniciarSesion({ correo, clave }) {
  return peticionAuth("/sesion", {
    method: "POST",
    cuerpo: { correo, clave },
  });
}

export async function obtenerSesion() {
  try {
    return await peticionAuth("/sesion", { method: "GET" });
  } catch (error) {
    if (error?.status === 401) return null;
    throw error;
  }
}

export function postCerrarSesion() {
  return peticionAuth("/sesion", { method: "DELETE" });
}

export function postSolicitarRecuperacion({ correo }) {
  return peticionAuth("/recuperacion", {
    method: "POST",
    cuerpo: { correo },
  });
}

export function postNuevaClave({ correo, codigo, clave }) {
  return peticionAuth("/recuperacion/nueva-clave", {
    method: "POST",
    cuerpo: { correo, codigo, clave },
  });
}