import { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import Icono from "../Icono";
import Logo from "../../assets/logo.svg";
const DESTINOS_INVITADO = {
  inicio: "/inicio",
  catalogo: "/catalogo",
};


const Navbar = ({
  textos,
  cargando,
  cambiarIdioma,
  activo,
  error,
  recargar,
  idioma,
  onBuscar,
  textoGrande,
  alternarTexto,
}) => {
  const [abierto, setAbierto] = useState(false); //Saber si el toogle de mobile esta abierto
  const [busqueda, setBusqueda] = useState(""); //sin valor a buscar
  const botonMenu = useRef(null);
  const campoBusqueda = useRef(null);
  const nav = textos?.navbar;
  const ingles = idioma === "en"; //Toma el valor de la variable idioma solo si es ingles
  /* const etiquetaFavoritos =
    nav?.botones?.favoritos ?? (ingles ? "Favorites" : "Favoritos");
  const etiquetaBusqueda =
    nav?.buscador?.aria ?? (ingles ? "Search" : "Buscar");
  const botonBusqueda = nav?.buscador?.boton ?? (ingles ? "Search" : "Buscar"); */

  const abrir =
    textos?.menuMovil.abrir ?? (ingles ? "Open menu" : "Abrir menu");
  const cerrar =
    textos?.menuMovil.cerrar ?? (ingles ? "Close menu" : "Cerrar menu");
  const enlacesInvitado = Object.entries(nav?.enlaces ?? {}).filter(
    ([clave]) => DESTINOS_INVITADO[clave],
  );
  //convierte objeto en un arreglo de pares

  useEffect(() => {
    function cerrarConEscape(evento) {
      if (!abierto) return;
      if (evento.key === "Escape" && abierto) {
        setAbierto(false);
        botonMenu.current?.focus();
      }
    }
    document.addEventListener("keydown", cerrarConEscape); //Escucha las teclas en todo el documento
    return () => document.removeEventListener("keydown", cerrarConEscape);
  }, [abierto]);

  function abrirBusqueda(evento) {
    setAbierto(true);
    requestAnimationFrame(() => campoBusqueda.current?.focus());
  }

  function buscar(evento) {
    evento.preventDefault(); // cancelar la accion que el navegador haria por defecto antes ese evento
    const consulta = busqueda.trim();
    if (!consulta) return;
    onBuscar(consulta);
    setAbierto(false);
  }

  return (
    <header className="navbar ">
      <nav
        className="navbar-interior"
        aria-label={nav?.aria.navegacion ?? "Navegación Principal"}
      >
        <a
          href="#inicio"
          className="navbar-marca"
          aria-label={nav?.logo.aria ?? "Inicio"}
          onClick={() => setAbierto(false)}
        >
          <img src={Logo} alt="Logo de sintonia" />
        </a>

        <div className="navbar-movil-acciones">
          {/* <button
            type="button"
            className="navbar-icono"
            aria-label={etiquetaBusqueda}
            onClick={abrirBusqueda}
          >
            <Icono nombre="buscar" />
          </button> */}

          {/* {nav && (
            <a
              className="navbar-icono"
              href="#favoritos"
              aria-label={etiquetaFavoritos}
              onClick={() => setAbierto(false)}
            >
              <Icono nombre="favoritos" />
            </a>
          )} */}
          {!abierto && (
            <button type="button" className="navbar-ingresar-movil ">
              {nav?.botones?.invitado?.ingresar}
            </button>
          )}
          <button
            type="button"
            ref={botonMenu}
            className="navbar-icono"
            aria-label={abierto ? cerrar : abrir}
            aria-expanded={abierto}
            aria-controls="navbar-panel"
            onClick={() => setAbierto((valor) => !valor)}
          >
            <Icono nombre={abierto ? "cerrar" : "menu"} />
          </button>
        </div>
        <div
          id="navbar-panel"
          className={`navbar-panel${abierto ? " is-abierto" : ""}`}
          aria-busy={cargando}
        >
          {cargando && (
            <p className="navbar-estado" role="status">
              {ingles ? "Loading navigation…" : "Cargando navegación…"}
            </p>
          )}
          {error && (
            <div className="navbar-estado" role="alert">
              <p>
                {ingles
                  ? "Navigation could not be loaded."
                  : "No pudimos cargar el menú."}
              </p>
              <button type="button" onClick={recargar}>
                {ingles ? "Try again" : "Reintentar"}
              </button>
            </div>
          )}
          {nav && (
            <>
              <ul className="navbar-enlaces">
                {enlacesInvitado.map(([clave, etiqueta]) => (
                  <li key={clave}>
                    <a
                      href={DESTINOS_INVITADO[clave]}
                      aria-current={activo === clave ? "page" : undefined}
                      onClick={() => setAbierto(false)}
                    >
                      {etiqueta}
                    </a>
                  </li>
                ))}
              </ul>
              {/* <form className="navbar-buscador" role="search" aria-label={etiquetaBusqueda} onSubmit={buscar}>
              <button type="submit" aria-label={botonBusqueda}><Icono nombre="buscar" /></button>
              <input ref={campoBusqueda} type="search" value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} placeholder={nav.buscador.placeholder} aria-label={etiquetaBusqueda} required />
            </form> */}
            </>
          )}

          <div className="navbar-utilidades">
            <button
              className="navbar-accesibilidad"
              type="button"
              aria-label={ingles ? "Enlarge text" : "Aumentar texto"}
              aria-pressed={textoGrande}
              onClick={alternarTexto}
            >
              <span>{textos?.menuMovil?.secciones.accesibilidad}</span>
              <div className="navbar-accesibilidad-movil"><Icono nombre="accesibilidad" /></div>
              

            </button>
            <div className="navbar-utilidad-fila">
              <span>{textos?.menuMovil?.secciones?.idioma}</span>
               <div className="navbar-idiomas-movil">
                <label className="navbar-idioma">
                  <button
                  type="button"
                  className="navbar-idioma-boton-es"
                  aria-pressed={idioma==="es"}
                  onClick={() => cambiarIdioma("es")}
                >
                  ES
                </button>
                <button
                  type="button"
                  className="navbar-idioma-boton-en"
                  aria-pressed={idioma==="en"}
                  onClick={() => cambiarIdioma("en")}
                >
                  EN
                </button>
                </label>
                
                </div>
                

            </div>
          </div>
          <div className="navbar-sesion">
            <button
              href="#ingresar"
              type="submit"
              className="navbar-invitado-ingresar "
              onClick={() => setAbierto(false)}
            >
              {nav?.botones?.invitado?.ingresar}
            </button>
            <a
              href="#crear-cuenta"
              className="navbar-invitado-crear-cuenta "
              onClick={() => setAbierto(false)}
            >
              {nav?.botones?.invitado?.crearCuenta}
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
