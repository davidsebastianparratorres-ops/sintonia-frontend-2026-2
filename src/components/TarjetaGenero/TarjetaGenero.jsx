import PortadaAlbum from "../PortadaAlbum/PortadaAlbum.jsx";
import "./TarjetaGenero.css";

const VARIANTES_GENERO = {
  "pop": 0,
  "lo-fi": 1, "lofi": 1,
  "rock": 2,
  "electronica": 3,
  "indie": 4,
  "jazz": 5,
  "instrumental": 6,
  "musica-andina": 7, "musica_andina": 7,
  "salsa": 8,
  "tropical": 9,
  "urbano": 10,
  "folk": 11,
};

function obtenerSlug(valor) {
  if (!valor) return "";
  return valor
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/^gen_/, "")            
    .replace(/[\s_]+/g, "-");        
}

export default function TarjetaGenero({
  nombre,
  idGenero,
  i = 0,
  genero,
  filtrar,
}) {
  const textoNombre = typeof nombre === "object" ? nombre?.nombre : nombre;
  const valorId = idGenero || (typeof nombre === "object" ? nombre?.id : nombre);

  const valorGeneroActivo = typeof genero === "object" ? genero?.id || genero?.nombre : genero;
  const estaActivo = valorGeneroActivo === valorId || valorGeneroActivo === textoNombre;

  const slugId = obtenerSlug(valorId);
  const slugTexto = obtenerSlug(textoNombre);
  const slugFinal = slugId || slugTexto;

  const variante = VARIANTES_GENERO[slugId] ?? VARIANTES_GENERO[slugTexto] ?? (i % 12);

  return (
    <button
      className={`tarjeta-genero genero-${slugFinal}`}
      type="button"
      aria-pressed={estaActivo}
      onClick={() => filtrar(valorId || textoNombre)}
    >
      <span>{textoNombre}</span>
      <PortadaAlbum variante={variante} />
    </button>
  );
}