import TarjetaAlbum from "../TarjetaAlbum/TarjetaAlbum.jsx";
import Flecha from "../Flecha/Flecha.jsx";
import { Link } from "react-router-dom";
import "./SeccionesAlbumes.css";

export default function SeccionAlbumes({
  textos,
  albumes = [],
  cargando = false,
  error = false,
  titulo,
  filaHorizontal = false,
  filaHorizontalMovil = false,
  mostrarEnlaceDescubrirMas = true,
  onSeleccionar,
  textoSecundarioAlbum,
  recargar,
}) {
  const destacados = textos?.paginas?.inicioPublico?.destacados;
  const tituloFinal = titulo || destacados?.titulo;
  const vacio = !cargando && !error && albumes.length === 0;
  const estadoError = textos?.estados?.error;

  return (
    <section
      className="ancho-home seccion-albumes"
      id="albumes"
      aria-labelledby="albumes-titulo"
      aria-busy={cargando}
    >
      <div className="titulo-seccion">
        <h2 id="albumes-titulo" className="titular-h2">{tituloFinal}</h2>
        {mostrarEnlaceDescubrirMas && destacados?.enlaces?.descubrirMas && (
          <Link className="enlace-home" to="/catalogo">
            {destacados.enlaces.descubrirMas} <Flecha />
          </Link>
        )}
      </div>

      {cargando && (
        <p
          role="status"
          aria-label={textos?.estados?.cargando?.aria}
          className="texto-vacio"
        >
          {textos?.estados?.cargando?.titulo}
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

      <div
        className={`albumes-grid${filaHorizontal ? " albumes-grid-fila" : ""}${filaHorizontalMovil ? " albumes-grid-fila-movil" : ""}`}
      >
        {albumes.map((album) => (
          <TarjetaAlbum
            key={album.id}
            album={album}
            onSeleccionar={onSeleccionar}
            textoSecundario={
              typeof textoSecundarioAlbum === "function"
                ? textoSecundarioAlbum(album)
                : undefined
            }
          />
        ))}
      </div>

      {vacio && (
        <p role="status" className="texto-vacio">
          {textos?.paginas?.catalogo?.vacio?.texto}
        </p>
      )}
    </section>
  );
}