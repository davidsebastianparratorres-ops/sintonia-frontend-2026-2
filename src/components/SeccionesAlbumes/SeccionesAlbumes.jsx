import Flecha from "../Flecha/Flecha.jsx";
import TarjetaAlbum from "../TarjetaAlbum/TarjetaAlbum.jsx";
import "./SeccionesAlbumes.css";
export default function SeccionAlbumes({
  textos,
  visibles,
  genero,
  generos = [],
  en,
  setGenero,
  onSeleccionar,
}) {
  const destacados = textos?.paginas?.inicioPublico?.destacados;
  const generoSeleccionado = generos.find((item) => {
    const id = typeof item === "object" ? item?.id : item;
    return id === genero;
  });
  const tituloGenero = generoSeleccionado?.nombre || genero;

  return (
    <section
      className="ancho-home seccion-albumes"
      id="albumes"
      aria-labelledby="albumes-titulo"
    >
      <div className="titulo-seccion">
        <h2 id="albumes-titulo">{genero ? tituloGenero : destacados?.titulo}</h2>
        {genero ? (
          <button className="enlace-home" onClick={() => setGenero(null)}>
            {en ? "View all" : "Ver todos"} <Flecha />
          </button>
        ) : (
          <a className="enlace-home" href="#generos">
            {destacados?.enlaces?.descubrirMas} <Flecha />
          </a>
        )}
      </div>
      <div className="albumes-grid">
        {visibles.slice(0,6).map((album) => (
          <TarjetaAlbum
            key={album.id || album.nombre}
            album={album}
            onSeleccionar={onSeleccionar}
          />
        ))}
      </div>
      {!visibles.length && (
        <p role="status">
          {en
            ? "No albums in this genre yet."
            : "Todavía no hay álbumes de este género en la selección semanal."}
        </p>
      )}
    </section>
  );
}