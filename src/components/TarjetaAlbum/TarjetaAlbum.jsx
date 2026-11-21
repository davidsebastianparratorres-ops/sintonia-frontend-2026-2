import PortadaAlbum from "../PortadaAlbum/PortadaAlbum.jsx";
import "./TarjetaAlbum.css";

export default function TarjetaAlbum({ album, onSeleccionar, indice = 0 }) {
  return (
    <button
      className="tarjeta-album"
      type="button"
      onClick={() => {
        if (typeof album?.id === "string" && album.id && onSeleccionar) {
          onSeleccionar(album);
        }
      }}
    >
      <PortadaAlbum portada={album.portada}/>
      <span>{album.titulo || album.nombre}</span>
      <small>{album.artista?.nombre || album.artista}</small>
    </button>
  );
}