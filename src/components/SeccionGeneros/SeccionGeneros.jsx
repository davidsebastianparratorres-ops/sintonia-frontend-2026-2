import Flecha from "../Flecha/Flecha.jsx";
import TarjetaGenero from "../TarjetaGenero/TarjetaGenero.jsx";
import "./SeccionGeneros.css";

export default function SeccionGeneros({
  textos,
  generos = [],
  genero,
  setGenero,
  filtrar,
}) {
  const textosGeneros = textos?.paginas?.inicioPublico?.generos;

  return (
    <section
      className="ancho-home seccion-generos"
      id="generos"
      aria-labelledby="generos-titulo"
    >
      <div className="titulo-seccion">
        <h2 id="generos-titulo">{textosGeneros?.titulo}</h2>
        <a
          className="enlace-home"
          href="#albumes"
          onClick={() => setGenero(null)}
        >
          {textosGeneros?.enlaces?.verCatalogo} <Flecha />
        </a>
      </div>
      <div className="generos-grid">
        {generos.slice(0,8).map((itemGenero, i) => {
          // Extraer id y nombre según si llega como Objeto { id, nombre } o String
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