// utils/portada.js
export const colorPortada = (clave) =>
  `var(--${String(clave).replace("/", "-")})`; // "portada/6" -> var(--portada-6)