import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useTextos } from "../hooks/useTextos.js";
import { useDetalle } from "../hooks/useDetalle.js";
import { leerCookie } from "../services/cookies.js";

import Navbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer/Footer.jsx";
import BannerCookies from "../components/BannerCookies/BannerCookies.jsx";
import PortadaAlbum from "../components/PortadaAlbum/PortadaAlbum.jsx";
import "./LayoutPublico.css";

export default function LayoutPublico() {
  const [idioma, setIdioma] = useState(() => {
    return leerCookie("idioma") === "en" ? "en" : "es";
  });

  const { pathname } = useLocation();
  const datos = useTextos(idioma);
  const { detalle, setDetalle, abrirCuenta } = useDetalle(idioma);
  const ingles = idioma === "en";

  // Sincroniza el atributo lang del documento con el idioma elegido
  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  // Sube el scroll al inicio cada vez que cambia la ruta (ej. / -> /catalogo)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  function abrirAlbum(album) {
    const tituloAlbum = album.titulo || album.nombre;
    const nombreArtista = album.artista?.nombre || album.artista;
    const nombreGenero = album.genero?.nombre || album.genero;

    setDetalle({
      titulo: tituloAlbum,
      descripcion: `${nombreArtista} · ${nombreGenero}`,
      contenido: <PortadaAlbum portada={album.portada} />,
      cerrar: ingles ? "Close" : "Cerrar",
    });
  }

  return (
    <div className="sitio">
      <Navbar
        {...datos}
        idioma={idioma}
        cambiarIdioma={setIdioma}
      />

      {/* Aquí se renderiza Home o Catalogo según la URL, recibiendo el contexto */}
      <Outlet
        context={{
          datos,
          idioma,
          detalle,
          setDetalle,
          abrirAlbum,
          abrirCuenta,
        }}
      />

      <BannerCookies {...datos} idioma={idioma} />
      <Footer {...datos} idioma={idioma} />
    </div>
  );
}