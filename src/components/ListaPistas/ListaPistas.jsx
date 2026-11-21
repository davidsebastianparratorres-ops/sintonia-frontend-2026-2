import PortadaAlbum from "../PortadaAlbum/PortadaAlbum.jsx";
import { formatearDuracion, formatearNumero } from "../../utils/formato.js";
import "./ListaPistas.css";

function IconoReloj() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="8" cy="8" r="6.25" />
      <path d="M8 4.5V8l2.25 1.5" />
    </svg>
  );
}

export default function ListaPistas({
  pistas = [],
  portada,
  artistaAlbum,
  etiquetas,
  idioma = "es",
}) {
  // La columna de reproducciones solo existe si la API la entrega
  const hayReproducciones = pistas.some((p) => p.reproducciones != null);

  return (
    <div
      className={`lista-pistas${hayReproducciones ? " lista-pistas-con-reproducciones" : ""}`}
      role="table"
      aria-label={etiquetas.tabla}
    >
      <div className="lista-pistas-fila lista-pistas-cabecera" role="row">
        <span role="columnheader" className="detalle-etiqueta lista-pistas-num">
          {etiquetas.numero}
        </span>
        <span role="columnheader" className="detalle-etiqueta">
          {etiquetas.titulo}
        </span>
        {hayReproducciones && (
          <span
            role="columnheader"
            className="detalle-etiqueta lista-pistas-reproducciones"
          >
            {etiquetas.reproducciones}
          </span>
        )}
        <span
          role="columnheader"
          className="lista-pistas-duracion"
          aria-label={etiquetas.duracion}
        >
          <IconoReloj />
        </span>
      </div>

      {pistas.map((pista) => {
        const artistas =
          pista.artistas?.map((a) => a.nombre).join(", ") || artistaAlbum;

        return (
          <div key={pista.id} className="lista-pistas-fila" role="row">
            <span role="cell" className="cuerpo-p lista-pistas-num">
              {pista.numero}
            </span>

            <div role="cell" className="lista-pistas-titulo">
              <span className="lista-pistas-portada" aria-hidden="true">
                <PortadaAlbum portada={pista.portada ?? portada} />
              </span>
              <div className="lista-pistas-textos">
                <span className="lista-pistas-nombre cuerpo-m-fuerte">
                  {pista.titulo}
                  {pista.explicita && (
                    <span
                      className="lista-pistas-explicita detalle-nota-fuerte"
                      title={etiquetas.explicita}
                      aria-label={etiquetas.explicita}
                    >
                      E
                    </span>
                  )}
                </span>
                <span className="lista-pistas-artista cuerpo-p">
                  {artistas}
                </span>
              </div>
            </div>

            {hayReproducciones && (
              <span
                role="cell"
                className="cuerpo-p lista-pistas-reproducciones"
              >
                {formatearNumero(pista.reproducciones, idioma)}
              </span>
            )}

            <span role="cell" className="cuerpo-p lista-pistas-duracion">
              {formatearDuracion(pista.duracionSeg)}
            </span>
          </div>
        );
      })}
    </div>
  );
}