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
  cargando = false,
  error = false,
  recargar,
}) {
  const navigate = useNavigate();
  const datosSeccion = esCatalogo
    ? textos?.paginas?.catalogo?.generos
    : textos?.paginas?.inicioPublico?.generos;

  const titulo = datosSeccion?.titulo;
  const textoEnlace = datosSeccion?.enlaces?.verCatalogo;
  const estadoCargando = textos?.estados?.cargando;
  const estadoError = textos?.estados?.error;

  const alSeleccionar = esCatalogo
    ? filtrar
    : (id) => navigate(`/catalogo?genero=${encodeURIComponent(id)}`);

  return (
    <section
      className={`ancho-home seccion-generos${esCatalogo ? " seccion-generos-catalogo" : ""}`}
      id="generos"
      aria-labelledby="generos-titulo"
      aria-busy={cargando}
    >
      <div className="titulo-seccion">
        <h2 id="generos-titulo" className="titular-h2">{titulo}</h2>

        {!esCatalogo && textoEnlace && (
          <Link className="enlace-home" to="/catalogo">
            {textoEnlace} <Flecha />
          </Link>
        )}
      </div>

      {cargando && (
        <p
          role="status"
          aria-label={estadoCargando?.aria}
          className="texto-vacio"
        >
          {estadoCargando?.titulo}
        </p>
      )}

      {error && (
        <div role="alert" className="texto-vacio">
          <p>{estadoError?.titulo}</p>
          {estadoError?.descripcion && <p>{estadoError.descripcion}</p>}
          {recargar && (
            <button
              type="button"
              className="seccion-albumes-reintentar"
              onClick={recargar}
            >
              {estadoError?.botones?.reintentar}
            </button>
          )}
        </div>
      )}

      {!cargando && !error && (
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
      )}
    </section>
  );
}