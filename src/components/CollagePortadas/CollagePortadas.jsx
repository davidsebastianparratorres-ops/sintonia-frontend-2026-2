import PortadaAlbum from "../PortadaAlbum/PortadaAlbum.jsx";
import "./CollagePortadas.css";
export default function CollagePortadas({}) {
  return (
    <div className="collage-sintonia" aria-hidden="true">
      <PortadaAlbum className="album-principal" />
      <PortadaAlbum variante={4} className="album-superior" />
      <PortadaAlbum variante={1} className="album-inferior" />
      <div className="nota-sintonia">
        <b>
          Sube la niebla
          <br />
          por la montaña
        </b>
        <br />y el camino canta
      </div>
    </div>
  );
}
