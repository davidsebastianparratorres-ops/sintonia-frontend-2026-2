import { useEffect, useState } from "react";

const API = "https://yanethm-sintonia-api.fly.dev/api/v1";

const IDS_ALBUMES = [
  "alb_luz-de-paramo",
  "alb_tejados-mojados",
  "alb_todo-el-ruido",
  "alb_ventana-empanada",
  "alb_sabado-en-la-plaza",
  "alb_domingo-de-feria",
  "alb_neon-y-neblina",
  "alb_subestacion",
  "alb_domingo-lento",
  "alb_sobremesa",
  "alb_canto-de-guadua",
  "alb_fiesta-en-la-vereda",
  "alb_cuerdas-y-voltios",
  "alb_onda-corta",
  "alb_flor-de-escarcha",
  "alb_barrio-arriba",
  "alb_mapa-de-curvas",
  "alb_ascensor-danado",
];

export function useCatalogo() {
  const [albumes, setAlbumes] = useState([]);
  const [genero, setGenero] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controlador = new AbortController();
    let activo = true;

    async function cargarPorIds() {
      setCargando(true);
      setError(false);

      try {
        const peticiones = IDS_ALBUMES.map((id) =>
          fetch(`${API}/albumes/${id}`, { signal: controlador.signal })
            .then((respuesta) => {
              if (!respuesta.ok) return null;
              return respuesta.json();
            })
            .then((json) => json?.datos ?? json)
            .catch(() => null)
        );

        const resultados = await Promise.all(peticiones);
        const listaValida = resultados.filter(Boolean);

        if (activo) {
          setAlbumes(listaValida);
        }
      } catch (err) {
        if (err.name !== "AbortError" && activo) {
          console.error("Error al cargar álbumes por ID:", err);
          setError(true);
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarPorIds();

    return () => {
      activo = false;
      controlador.abort();
    };
  }, []);

  // CORRECCIÓN AQUÍ: Soporta género si viene como Objeto { id, nombre } o String
  const visibles = genero
    ? albumes.filter((album) => {
        const idGen = album.genero?.id || album.genero;
        const nombreGen = album.genero?.nombre;
        return idGen === genero || nombreGen === genero;
      })
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

  return {
    albumes,
    genero,
    setGenero,
    visibles,
    filtrar,
    cargando,
    error,
  };
}