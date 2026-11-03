import { useTextos } from "./hooks/useTextos.js";
import { useCatalogo } from "./hooks/useCatalogo.js";
import { useGeneros } from "./hooks/useGeneros.js";
import { useDetalle } from "./hooks/useDetalle.js";
import "./App.css";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import HeroSintonia from "./components/HeroSintonia/HeroSintonia.jsx";
import SeccionAlbumes from "./components/SeccionesAlbumes/SeccionesAlbumes.jsx";
import SeccionGeneros from "./components/SeccionGeneros/SeccionGeneros.jsx";
import PortadaAlbum from "./components/PortadaAlbum/PortadaAlbum.jsx"; 
import { useEffect, useState } from "react";

function leerSeccion() {
  return window.location.hash.slice(1) || "inicio";
}

function App() {
  // Idioma por defecto español
  const [idioma, setIdioma] = useState("es");
  const [sesion, setSesion] = useState("invitado");
  const [activo, setActivo] = useState(leerSeccion);
  const [consulta, setConsulta] = useState("");
  const [textoGrande, setTextoGrande] = useState(false);
  const datos = useTextos(idioma);
  const { detalle, setDetalle, abrirCuenta } = useDetalle(idioma);
  const { genero, setGenero, visibles, cargando: cargandoAlbumes, filtrar } = useCatalogo();
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

  useEffect(() => {
    document.documentElement.style.fontSize = textoGrande ? "112%" : "";
    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [textoGrande]);

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
        texto={textoGrande}
        alternarTexto={() => setTextoGrande((valor) => !valor)}
      />
      <HeroSintonia {...datos} totalGeneros={generos.length} />
      <SeccionAlbumes
        {...datos}
        en={ingles}
        visibles={visibles}
        genero={genero}
        generos={generos}
        setGenero={setGenero}
        onSeleccionar={abrirAlbum}
      />
      <SeccionGeneros
        {...datos}
        generos={generos}
        genero={genero}
        setGenero={setGenero}
        filtrar={filtrar}
      />
      <Footer {...datos} idioma={idioma} />
    </>
  );
}

export default App;