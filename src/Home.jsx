import { useTextos } from "./hooks/useTextos.js";
import { useCatalogo } from "./hooks/useCatalogo.js";
import { useDetalle } from "./hooks/useDetalle.js";
import { useGeneros } from "./hooks/useGeneros.js";
import { leerCookie } from "./services/cookies.js";
import "./Home.css";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import HeroSintonia from "./components/HeroSintonia/HeroSintonia.jsx";
import SeccionAlbumes from "./components/SeccionesAlbumes/SeccionesAlbumes.jsx";
import SeccionGeneros from "./components/SeccionGeneros/SeccionGeneros.jsx";
import PortadaAlbum from "./components/PortadaAlbum/PortadaAlbum.jsx";
import InvitacionRegistro from "./components/InvitacionRegistro/InvitacionRegistro.jsx";
import BannerCookies from "./components/BannerCookies/BannerCookies.jsx";
import Catalogo from "./pages/Catalog/Catalog.jsx";
import { useEffect, useState } from "react";

function leerSeccion() {
  return window.location.hash.slice(1) || "inicio";
}

function Home() {
  // Idioma por defecto español
  const [idioma, setIdioma] = useState(() => {
    return leerCookie("idioma") === "en" ? "en" : "es";
  });
  const [activo, setActivo] = useState(leerSeccion);
  const datos = useTextos(idioma);
  const { detalle, setDetalle, abrirCuenta } = useDetalle(idioma);
  const {
    albumes,
    genero,
    setGenero,
    visibles,
    cargando: cargandoAlbumes,
    filtrar,
  } = useCatalogo();
  const { generos } = useGeneros();

  const ingles = idioma === "en";
  const titulo =
    activo === "favoritos"
      ? datos.textos?.navbar.botones.favoritos
      : datos.textos?.navbar.enlaces[activo];

  useEffect(() => {
    function actualizar() {
      setActivo(leerSeccion());
      setConsulta("");
    }
    window.addEventListener("hashchange", actualizar);
    return () => window.removeEventListener("hashchange", actualizar);
  }, []);

  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  function buscar(valor) {
    setConsulta(valor);
    setActivo("heroes");
    window.history.replaceState(null, "", "#heroes");
  }

  function abrirAlbum(album) {
    const tituloAlbum = album.titulo || album.nombre;
    const nombreArtista = album.artista?.nombre || album.artista;
    const nombreGenero = album.genero?.nombre || album.genero;
    const variantePortada = album.portada?.patron ?? album.arte;

    setDetalle({
      titulo: tituloAlbum,
      descripcion: `${nombreArtista} · ${nombreGenero}`,
      contenido: <PortadaAlbum variante={variantePortada} />,
      cerrar: ingles ? "Close" : "Cerrar",
    });
  }

  return (
    <>
      <Navbar
        {...datos}
        idioma={idioma}
        cambiarIdioma={setIdioma}
        activo={activo}
        onBuscar={buscar}
      />
      {activo === "catalogo" ? (
        <Catalogo datos={datos} generos={generos} albumes={albumes} onSeleccionarAlbum={abrirAlbum} />
      ) : (
        <>
          <HeroSintonia {...datos} totalGeneros={generos.length} />
          <SeccionAlbumes
            {...datos}
            en={ingles}
            visibles={visibles}
            genero={genero}
            generos={generos}
            setGenero={setGenero}
            onSeleccionar={abrirAlbum}
            limite={6}
          />
          <SeccionGeneros
            {...datos}
            generos={generos}
            genero={genero}
            setGenero={setGenero}
            filtrar={filtrar}
          />
          <InvitacionRegistro {...datos} abrirCuenta={abrirCuenta} />
        </>
      )}
      <BannerCookies {...datos} idioma={idioma} />
      <Footer {...datos} idioma={idioma} />
    </>
  );
}

export default Home;
