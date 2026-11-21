import PortadaAlbum from "../PortadaAlbum/PortadaAlbum.jsx";
import "./EncabezadoAlbum.css";

export default function EncabezadoAlbum({ album, etiquetas }) {
  const { titulo, artista, portada } = album;

  const datos = [
    etiquetas.anio,
    etiquetas.canciones,
    etiquetas.duracion,
  ].filter(Boolean);

  return (
    <header className="encabezado-album">
      <div className="encabezado-album-portada">
        <PortadaAlbum portada={portada} />
      </div>

      <div className="encabezado-album-info">
        <span className="encabezado-album-tipo detalle-nota-fuerte">
          {etiquetas.tipo}
        </span>

        <h1 className="encabezado-album-titulo titular-display">{titulo}</h1>

        <p className="encabezado-album-meta cuerpo-p">
          <span className="encabezado-album-artista">
            <span className="encabezado-album-avatar" aria-hidden="true">
              <PortadaAlbum portada={portada} />
            </span>
            <strong className="cuerpo-p-fuerte">{artista?.nombre}</strong>
          </span>
          {datos.map((dato) => (
            <span key={dato} className="encabezado-album-dato">
              <span className="encabezado-album-separador" aria-hidden="true">
                ·
              </span>
              {dato}
            </span>
          ))}
        </p>
      </div>
    </header>
  );
}