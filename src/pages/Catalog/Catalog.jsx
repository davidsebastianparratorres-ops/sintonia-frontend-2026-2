import { useEffect, useState } from "react";
import EncabezadoCatalogo from "../../components/EncabezadoCatalogo/EncabezadoCatalogo";
import SeccionGeneros from "../../components/SeccionGeneros/SeccionGeneros.jsx";
import SeccionAlbumes from "../../components/SeccionesAlbumes/SeccionesAlbumes.jsx";
import TarjetaArtista from "../../components/TarjetaArtista/TarjetaArtista.jsx";
import ListaCanciones from "../../components/ListaCanciones/ListaCanciones.jsx";
import { useGenero } from "../../hooks/useGenero.js";
import { useCatalogo } from "../../hooks/useCatalogo.js";
import "./Catalog.css";

export default function Catalogo({
  datos,
  generos = [],
  onSeleccionarAlbum,
}) {
  const [generoActivo, setGeneroActivo] = useState(
    () => new URLSearchParams(window.location.search).get("genero") || null,
  );

  useEffect(() => {
    const url = new URL(window.location.href);
    if (generoActivo) url.searchParams.set("genero", generoActivo);
    else url.searchParams.delete("genero");
    window.history.replaceState({}, "", url);
  }, [generoActivo]);

  const { detalle, cargando, error } = useGenero(generoActivo);
  const {
    albumes: albumesGenerales,
    cargando: cargandoGenerales,
    error: errorGenerales,
  } = useCatalogo({ limite: 24 });

  const tCat = datos?.textos?.paginas?.catalogo;

  // Mientras carga el detalle, usamos lo básico que ya viene en la lista de géneros
  const generoSeleccionado =
    detalle ?? generos.find((g) => g?.id === generoActivo) ?? null;

  const artistas = detalle?.artistas ?? [];
  const albumesGenero = detalle?.albumes ?? [];
  const pistas = [...(detalle?.pistas ?? [])].sort(
    (a, b) => (b.reproducciones ?? 0) - (a.reproducciones ?? 0),
  );

  const alternarGenero = (id) =>
    setGeneroActivo((prev) => (prev === id ? null : id));

  const tituloAlbumes = generoActivo
    ? (tCat?.genero?.albumes?.titulo || "Álbumes de {genero}").replace(
        "{genero}",
        generoSeleccionado?.nombre ?? "",
      )
    : tCat?.destacados?.titulo;

  return (
    <main className="pagina-catalogo ancho-home">
      <EncabezadoCatalogo
        generoSeleccionado={generoSeleccionado}
        textos={datos?.textos}
      />

      <SeccionGeneros
        {...datos}
        generos={generos}
        genero={generoActivo}
        filtrar={alternarGenero}
        esCatalogo
      />

      {generoActivo && error && (
        <p role="alert" className="catalogo-error">
          {tCat?.error?.texto || "No pudimos cargar este género."}
        </p>
      )}

      {generoActivo && artistas.length > 0 && (
        <section className="seccion-artistas-catalogo">
          <h2>{tCat?.genero?.artistas?.titulo || "Artistas"}</h2>
          <div className="grid-artistas">
            {artistas.map((artista) => (
              <TarjetaArtista
                key={artista.id}
                artista={artista}
                textos={datos?.textos}
              />
            ))}
          </div>
        </section>
      )}

      {generoActivo ? (
        albumesGenero.length > 0 ? (
          <SeccionAlbumes
            textos={datos?.textos}
            albumes={albumesGenero}
            titulo={tituloAlbumes}
            filaHorizontal
            mostrarEnlaceDescubrirMas={false}
            onSeleccionar={onSeleccionarAlbum}
          />
        ) : (
          !cargando &&
          !error && (
            <div className="catalogo-vacio" role="status">
              <h3>{tCat?.vacio?.titulo}</h3>
              <p>{tCat?.vacio?.texto}</p>
            </div>
          )
        )
      ) : (
        <SeccionAlbumes
          textos={datos?.textos}
          albumes={albumesGenerales}
          cargando={cargandoGenerales}
          error={errorGenerales}
          titulo={tituloAlbumes}
          filaHorizontal
          onSeleccionar={onSeleccionarAlbum}
        />
      )}

      {generoActivo && pistas.length > 0 && (
        <ListaCanciones
          canciones={pistas}
          titulo={tCat?.genero?.canciones?.titulo || "Canciones más escuchadas"}
        />
      )}
    </main>
  );
}