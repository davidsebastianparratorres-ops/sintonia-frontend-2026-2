// utils/portada.js
export const colorPortada = (clave) =>
  `var(--${String(clave).replace("/", "-")})`; // "portada/6" -> var(--portada-6)

export const formatearDuracion = (segundos = 0) => {
  const m = Math.floor(segundos / 60);
  const s = String(segundos % 60).padStart(2, "0");
  return `${m}:${s}`;
};