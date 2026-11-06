import { colorPortada } from "../../utils/portada.js";
import "./TarjetaArtista.css";

export default function TarjetaArtista({ artista, textos }) {
  const etiqueta =
    textos?.paginas?.catalogo?.genero?.artistas?.etiqueta || "Artista";
  const fondo = artista.portada?.colores?.[0];

  return (
    <article className="tarjeta-artista">
      <div
        className="avatar-artista"
        style={fondo ? { backgroundColor: colorPortada(fondo) } : undefined}
        aria-hidden="true"
      />
      <h3>{artista.nombre}</h3>
      <span>{etiqueta}</span>
    </article>
  );
}