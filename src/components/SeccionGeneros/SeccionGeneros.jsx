import Flecha from "../Flecha/Flecha.jsx";
import TarjetaGenero from "../TarjetaGenero/TarjetaGenero.jsx";
import "./SeccionGeneros.css";

export default function SeccionGeneros({
  textos,
  generos = [],
  genero,
  setGenero,
  filtrar,
  esCatalogo = false, // Identifica si estamos en la página de catálogo
}) {
  // Extraemos los datos de la API según la ruta correspondiente de cada página
  const datosSeccion = esCatalogo
    ? textos?.paginas?.catalogo?.generos
    : textos?.paginas?.inicioPublico?.generos;

  const titulo = datosSeccion?.titulo;
  const textoEnlace = datosSeccion?.enlaces?.verCatalogo; // Solo existe en inicioPublico

  return (
    <section
      className={`ancho-home seccion-generos${
        esCatalogo ? " seccion-generos-catalogo" : ""
      }`}
      id="generos"
      aria-labelledby="generos-titulo"
    >
      <div className="titulo-seccion">
        <h2 id="generos-titulo">{titulo}</h2>

        {/* El enlace de la flecha solo se pinta si existe en la API para esa sección (Inicio) */}
        {!esCatalogo && textoEnlace && (
          <a
            className="enlace-home"
            href="#catalogo"
            onClick={() => setGenero(null)}
          >
            {textoEnlace} <Flecha />
          </a>
        )}
      </div>

      <div className="generos-grid">
        {generos.slice(0, esCatalogo ? 12 : 8).map((itemGenero, i) => {
          const idGen = itemGenero?.id || itemGenero;
          const nombreGen = itemGenero?.nombre || itemGenero;

          return (
            <TarjetaGenero
              key={idGen || i}
              nombre={nombreGen}
              idGenero={idGen}
              i={i}
              genero={genero}
              filtrar={filtrar}
            />
          );
        })}
      </div>
    </section>
  );
}