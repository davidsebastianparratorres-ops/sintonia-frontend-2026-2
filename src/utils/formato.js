// Funciones puras de formato para la vista de detalle de álbum.

/** 70 -> "1:10" */
export function formatearDuracion(segundos = 0) {
  const total = Math.max(0, Math.round(segundos));
  const minutos = Math.floor(total / 60);
  const resto = String(total % 60).padStart(2, "0");
  return `${minutos}:${resto}`;
}

/** 363 -> 6 (minutos, mínimo 1 si hay duración) */
export function minutosTotales(segundos = 0) {
  if (!segundos) return 0;
  return Math.max(1, Math.round(segundos / 60));
}

/** "2025-08-20" -> "20 de agosto de 2025" (se construye en local para evitar desfases de zona horaria) */
export function formatearFecha(iso, idioma = "es") {
  if (!iso) return "";
  const [anio, mes, dia] = String(iso).slice(0, 10).split("-").map(Number);
  if (!anio || !mes || !dia) return "";
  return new Intl.DateTimeFormat(idioma === "en" ? "en-US" : "es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(anio, mes - 1, dia));
}

export function anioDe(iso) {
  return iso ? String(iso).slice(0, 4) : "";
}

/** 1204330 -> "1.204.330" (es) / "1,204,330" (en) */
export function formatearNumero(valor, idioma = "es") {
  if (valor == null) return "";
  return new Intl.NumberFormat(idioma === "en" ? "en-US" : "es-CO").format(
    valor,
  );
}

/** "Más de {artista}" + { artista: "Marea Baja" } -> "Más de Marea Baja" */
export function plantilla(texto = "", valores = {}) {
  return String(texto).replace(/\{(\w+)\}/g, (_, clave) => valores[clave] ?? "");
}