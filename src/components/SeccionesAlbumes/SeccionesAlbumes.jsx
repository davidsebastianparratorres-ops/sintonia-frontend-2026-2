import Flecha from "../Flecha/Flecha.jsx";
import TarjetaAlbum from "../TarjetaAlbum/TarjetaAlbum.jsx";
import "./SeccionesAlbumes.css";

export default function SeccionAlbumes({
  textos,
  visibles = [],
  titulo,          // Recibe el título ya procesado (ideal para el Catálogo o Inicio)
  limite,          // Permite controlar cuántos mostrar (en catálogo se muestran todos, en inicio 6)
  limiteMovil,
  onSeleccionar,
}) {
  const destacados = textos?.paginas?.inicioPublico?.destacados;
  const tituloFinal = titulo || destacados?.titulo || "Álbumes destacados";

  // Si se pasa un límite se aplica, de lo contrario muestra todos los visibles (útil para el catálogo)
  const albumesAMostrar = limite ? visibles.slice(0, limite) : visibles;

  return (
    <section
      className="ancho-home seccion-albumes"
      id="albumes"
      aria-labelledby="albumes-titulo"
    >
      <div className="titulo-seccion">
        <h2 id="albumes-titulo">{tituloFinal}</h2>
      </div>

      <div
        className={`albumes-grid${
          limiteMovil === 2 ? " albumes-grid-limite-movil" : ""
        }`}
      >
        {albumesAMostrar.map((album) => (
          <TarjetaAlbum
            key={album.id || album.nombre}
            album={album}
            onSeleccionar={onSeleccionar}
          />
        ))}
      </div>

      {visibles.length === 0 && (
        <p role="status" className="texto-vacio">
          {textos?.paginas?.catalogo?.vacio?.texto || "No hay álbumes disponibles en esta selección."}
        </p>
      )}
    </section>
  );
}