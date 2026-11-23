import API_BASE_URL from "../config/api.js";

const CLAVE_SESION_ANTERIOR = "sintonia_sesion";

export function limpiarSesionAnterior() {
  localStorage.removeItem(CLAVE_SESION_ANTERIOR);
  sessionStorage.removeItem(CLAVE_SESION_ANTERIOR);
}

// --- HELPER DE PETICIONES ---

async function peticionAuth(ruta, { method = "POST", cuerpo } = {}) {
  let respuesta;
  try {
    respuesta = await fetch(`${API_BASE_URL}${ruta}`, {
      method,
      credentials: "include",
      ...(cuerpo === undefined
        ? {}
        : {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cuerpo),
          }),
    });
  } catch {
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
    throw {
      tipo: "api",
      status: respuesta.status,
      codigo: error?.codigo || datos?.codigo || null,
      mensaje: error?.mensaje || datos?.mensaje || null,
      campos: error?.campos || datos?.campos || {},
      retryAfter: retryAfter ? Number(retryAfter) : null,
    };
  }

  return datos;
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