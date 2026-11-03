import PortadaAlbum from "../PortadaAlbum/PortadaAlbum.jsx";
import "./TarjetaAlbum.css";

// Mapeo exacto entre el ID de género de la API y el diseño de la portada (0-11)
const VARIANTES_GENERO = {
  "gen_pop": 0,
  "gen_lo-fi": 1,
  "gen_rock": 2,
  "gen_electronica": 3,
  "gen_indie": 4,
  "gen_jazz": 5,
  "gen_instrumental": 6,
  "gen_musica-andina": 7,
  "gen_salsa": 8,
  "gen_tropical": 9,
  "gen_urbano": 10,
  "gen_folk": 11,
};

export default function TarjetaAlbum({ album, onSeleccionar, indice = 0 }) {
  const idGenero = album.genero?.id || album.genero;

  // 1. Busca por género, 2. o por el patron de la API, 3. o usa el índice secuencial
  const variante =
    VARIANTES_GENERO[idGenero] ?? album.portada?.patron ?? (indice % 12);

  return (
    <button
      className="tarjeta-album"
      type="button"
      onClick={() => onSeleccionar(album)}
    >
      <PortadaAlbum variante={variante} />
      <span>{album.titulo || album.nombre}</span>
      <small>{album.artista?.nombre || album.artista}</small>
    </button>
  );
}