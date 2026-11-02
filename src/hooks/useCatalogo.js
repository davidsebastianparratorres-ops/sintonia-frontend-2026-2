import { useState } from "react";

export function useCatalogo(albumes) {
  const [genero, setGenero] = useState(null);
  const visibles = genero
    ? albumes.filter((album) => album.genero === genero)
    : albumes;
  function filtrar(valor) {
    setGenero(valor === genero ? null : valor);
    document.getElementById("albumes")?.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  return { genero, setGenero, visibles, filtrar };
}
