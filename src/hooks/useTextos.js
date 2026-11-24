import { useEffect,useState } from "react";
import { esErrorNoAutenticado, peticionApi } from "../services/auth.js";

const CLAVES_MENU_INVITADO= ["inicio","catalogo"]

function validarTextos(datos) {
  const textos = datos?.textos;
  const nav = textos?.navbar;
  const etiquetas = [
    nav?.logo?.texto,
    nav?.logo?.aria,
    ...CLAVES_MENU_INVITADO.map((clave) => nav?.enlaces?.[clave]),
    nav?.buscador?.placeholder,
    nav?.aria?.navegacion,
    nav?.aria?.idioma,
    textos?.menuMovil?.abrir,
    textos?.menuMovil?.cerrar,
  ];

  if (!etiquetas.every((valor) => typeof valor === "string" && valor.trim())){
    /*
    "Inicio"      // Válido
    "  Inicio "   // Válido
    ""            // Inválido
    "   "         // Inválido
    undefined     // Inválido
    42            // Inválido
    */
    throw new Error("La respuesta no contiene los textos del navbar.");
  }
  return textos;
}

export function useTextos(idioma) {
  const [textos, setTextos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    const limite = setTimeout(() => controlador.abort(), 12000);
    let vigente = true;
    setCargando(true);
    setError(false);
    setTextos(null);

    async function cargarTextosNavbar() {
      try {
        const datos = await peticionApi(`/textos?idioma=${encodeURIComponent(idioma)}`, {
          method: "GET",
          signal: controlador.signal,
        });
        const nuevosTextos = validarTextos(datos);
        if (vigente) setTextos(nuevosTextos);
      } catch (error) {
        if (vigente && !esErrorNoAutenticado(error)) {
          console.error("Error al cargar los textos:", error);
          setError(true);
        }
      } finally {
        clearTimeout(limite);
        if (vigente) setCargando(false);
        }
    }

    cargarTextosNavbar();
    return () => {
      vigente = false;
      clearTimeout(limite);
      controlador.abort();
    };
  }, [idioma, intento]);

  return {
    textos,
    cargando,
    error,
    recargar: () => setIntento((valor) => valor + 1),
  };
}


        
