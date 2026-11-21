import { useEffect } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import useAlbum from "../../hooks/useAlbum.js";
import EncabezadoAlbum from "../../components/EncabezadoAlbum/EncabezadoAlbum.jsx";
import ListaPistas from "../../components/ListaPistas/ListaPistas.jsx";
import SeccionAlbumes from "../../components/SeccionesAlbumes/SeccionesAlbumes.jsx";
import {
  anioDe,
  formatearFecha,
  minutosTotales,
  plantilla,
} from "../../utils/formato.js";
import "./DetalleAlbum.css";

export default function DetalleAlbum({ textos: textosProp, idioma: idiomaProp }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const contexto = useOutletContext();
  const datos = contexto?.datos ?? {};
  const textos = textosProp ?? datos.textos;
  const idioma = idiomaProp ?? contexto?.idioma ?? "es";
  const { album, cargando, error, noEncontrado } = useAlbum(id);

  // Todos los textos salen de la API: textos.paginas.album
  const t = textos?.paginas?.album;

  // Metadatos de la página: seo.titulo y seo.descripcion
  useEffect(() => {
    if (!album || !t?.seo) return undefined;

    const tituloAnterior = document.title;
    document.title = plantilla(t.seo.titulo, { titulo: album.titulo });

    let meta = document.querySelector('meta[name="description"]');
    const creada = !meta;
    if (creada) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    const descripcionAnterior = meta.content;
    meta.content = t.seo.descripcion ?? "";

    return () => {
      document.title = tituloAnterior;
      if (creada) meta.remove();
      else meta.content = descripcionAnterior;
    };
  }, [album, t]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  function volver() {
    // Si el usuario llegó directo por URL no hay historial previo
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate("/catalogo");
  }

  // Sin textos de la API no se pinta nada de la vista
  if (cargando || !t) {
    return (
      <main className="detalle-album ancho-home" aria-busy="true">
        <p role="status" className="texto-vacio">
          {textos?.estados?.cargando?.titulo}
        </p>
      </main>
    );
  }

  if (noEncontrado) {
    return (
      <main className="detalle-album ancho-home detalle-album-estado">
        <h1 className="titular-h1">{t.noEncontrado?.titulo}</h1>
        <p className="cuerpo-m">{t.noEncontrado?.texto}</p>
        <Link className="enlace-home" to="/catalogo">
          {t.noEncontrado?.botones?.volver}
        </Link>
      </main>
    );
  }

  if (error || !album) {
    return (
      <main className="detalle-album ancho-home detalle-album-estado">
        <p role="alert" className="texto-vacio">
          {textos?.estados?.error?.titulo}
        </p>
      </main>
    );
  }

  const encabezado = t.encabezado;
  const cantidad = album.totalPistas ?? album.pistas?.length ?? 0;
  const minutos = minutosTotales(album.duracionSeg);

  const etiquetas = {
    tipo: encabezado?.etiquetas?.tipo?.[album.tipo],
    anio: anioDe(album.fechaPublicacion),
    canciones: plantilla(
      cantidad === 1 ? encabezado?.canciones?.uno : encabezado?.canciones?.otro,
      { cantidad },
    ),
    duracion: minutos ? plantilla(encabezado?.duracion, { minutos }) : "",
  };

  const fecha = formatearFecha(album.fechaPublicacion, idioma);
  const masDelArtista = album.masDelArtista ?? [];

  return (
    <main className="detalle-album">
      <div className="ancho-home detalle-album-contenido">
        <button
          type="button"
          className="detalle-album-volver"
          aria-label={t.botones?.volver}
          onClick={volver}
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <EncabezadoAlbum album={album} etiquetas={etiquetas} />

        <ListaPistas
          pistas={album.pistas}
          portada={album.portada}
          artistaAlbum={album.artista?.nombre}
          etiquetas={t.tabla?.etiquetas ?? {}}
          idioma={idioma}
        />

        {(fecha || album.copyright) && (
          <footer className="detalle-album-creditos">
            {fecha && <p className="cuerpo-p">{fecha}</p>}
            {album.copyright && (
              <p className="detalle-nota">{album.copyright}</p>
            )}
          </footer>
        )}
      </div>

      {masDelArtista.length > 0 && (
        <SeccionAlbumes
          albumes={masDelArtista}
          titulo={plantilla(t.masDelArtista?.titulo, {
            artista: album.artista?.nombre,
          })}
          filaHorizontal
          mostrarEnlaceDescubrirMas={false}
          textos={textos}
          onSeleccionar={(a) => navigate(`/albumes/${a.id ?? a}`)}
        />
      )}
    </main>
  );
}