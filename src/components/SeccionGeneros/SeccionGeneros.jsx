import Flecha from "../Flecha/Flecha.jsx";
import TarjetaGenero from "../TarjetaGenero/TarjetaGenero.jsx";
import { Link, useNavigate } from "react-router-dom";
import "./SeccionGeneros.css";

export default function SeccionGeneros({
  textos,
  generos = [],
  genero,
  filtrar,
  esCatalogo = false,
}) {
  const navigate = useNavigate();
  const datosSeccion = esCatalogo
    ? textos?.paginas?.catalogo?.generos
    : textos?.paginas?.inicioPublico?.generos;

  const titulo = datosSeccion?.titulo;
  const textoEnlace = datosSeccion?.enlaces?.verCatalogo;

  const alSeleccionar = esCatalogo
    ? filtrar
    : (id) => navigate(`/catalogo?genero=${encodeURIComponent(id)}`);

  return (
    <section
      className={`ancho-home seccion-generos${esCatalogo ? " seccion-generos-catalogo" : ""}`}
      id="generos"
      aria-labelledby="generos-titulo"
    >
      <div className="titulo-seccion">
        <h2 id="generos-titulo">{titulo}</h2>

        {!esCatalogo && textoEnlace && (
          <Link className="enlace-home" to="/catalogo">
            {textoEnlace} <Flecha />
          </Link>
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
              datosGenero={itemGenero}
              genero={esCatalogo ? genero : null}
              filtrar={alSeleccionar}
            />
          );
        })}
      </div>
    </section>
  );
}