import API_BASE_URL from "../config/api.js";

const CLAVE_SESION = "sintonia_sesion";

// --- PERSISTENCIA (localStorage vs sessionStorage) ---

export function guardarSesion({ usuario, token }, recordar = true) {
  limpiarSesion();
  const almacenamiento = recordar ? localStorage : sessionStorage;
  almacenamiento.setItem(CLAVE_SESION, JSON.stringify({ usuario, token }));
}

export function leerSesion() {
  const raw =
    localStorage.getItem(CLAVE_SESION) || sessionStorage.getItem(CLAVE_SESION);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    limpiarSesion();
    return null;
  }
}

export function limpiarSesion() {
  localStorage.removeItem(CLAVE_SESION);
  sessionStorage.removeItem(CLAVE_SESION);
}

// --- HELPER DE PETICIONES ---

async function peticionAuth(ruta, cuerpo) {
  let respuesta;
  try {
    respuesta = await fetch(`${API_BASE_URL}${ruta}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo),
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
    throw {
      tipo: "api",
      status: respuesta.status,
      codigo: datos?.error || datos?.codigo || null,
      mensaje: datos?.mensaje || null,
      campos: datos?.campos || {},
      retryAfter: retryAfter ? Number(retryAfter) : null,
    };
  }

  return datos;
}

// --- ENDPOINTS DEL CONTRATO ---

export function postIniciarSesion({ correo, clave }) {
  return peticionAuth("/sesion", { correo, clave });
}

export function postSolicitarRecuperacion({ correo }) {
  return peticionAuth("/recuperacion", { correo });
}

export function postNuevaClave({ correo, codigo, clave }) {
  return peticionAuth("/recuperacion/nueva-clave", { correo, codigo, clave });
}