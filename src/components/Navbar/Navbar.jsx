import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import Icono from "../Icono";
import Logo from "../../assets/logo.svg";
import { PanelAccesibilidad } from "../PanelAccesibilidad/PanelAccesibilidad.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const DESTINOS_INVITADO = {
  inicio: "/",
  catalogo: "/catalogo",
};

const Navbar = ({
  textos,
  cargando,
  cambiarIdioma,
  error,
  recargar,
  idioma,
}) => {
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(false); // Saber si el toggle de mobile está abierto
  const [accesibilidadAbierta, setAccesibilidadAbierta] = useState(false);
  const [perfilAbierto, setPerfilAbierto] = useState(false);
  const [posicionPanel, setPosicionPanel] = useState({ top: 80, right: 16 });
  const { usuario, estaAutenticado, cerrarSesion } = useAuth();
  const botonMenu = useRef(null);
  const botonAccesibilidad = useRef(null);
  const botonPerfil = useRef(null);
  const perfilRef = useRef(null);
  const nav = textos?.navbar;
  const ingles = idioma === "en";
  const inicialesUsuario = usuario?.iniciales ?? "";
  const primerNombre = usuario?.nombre?.trim().split(/\s+/)[0] ?? "";
  const etiquetaCerrarSesion =
    nav?.botones?.conSesion?.cerrarSesion ??
    (ingles ? "Sign out" : "Cerrar sesión");
  const etiquetaSesionIniciada = ingles ? "Signed in" : "Sesión iniciada";
  const abrir =
    textos?.menuMovil?.abrir ?? (ingles ? "Open menu" : "Abrir menu");
  const cerrar =
    textos?.menuMovil?.cerrar ?? (ingles ? "Close menu" : "Cerrar menu");
  const enlacesInvitado = Object.entries(nav?.enlaces ?? {}).filter(
    ([clave]) => DESTINOS_INVITADO[clave],
  );

  useEffect(() => {
    function cerrarConEscape(evento) {
      if (evento.key !== "Escape") return;
      if (accesibilidadAbierta) {
        setAccesibilidadAbierta(false);
        botonAccesibilidad.current?.focus();
      } else if (perfilAbierto) {
        setPerfilAbierto(false);
        botonPerfil.current?.focus();
      } else if (abierto) {
        setAbierto(false);
        botonMenu.current?.focus();
      }
    }
    document.addEventListener("keydown", cerrarConEscape);
    return () => document.removeEventListener("keydown", cerrarConEscape);
  }, [abierto, accesibilidadAbierta, perfilAbierto]);

  useEffect(() => {
    if (!perfilAbierto) return undefined;

    function cerrarAlHacerClicFuera(evento) {
      if (!perfilRef.current?.contains(evento.target)) {
        setPerfilAbierto(false);
      }
    }

    document.addEventListener("pointerdown", cerrarAlHacerClicFuera);
    return () =>
      document.removeEventListener("pointerdown", cerrarAlHacerClicFuera);
  }, [perfilAbierto]);

  useEffect(() => {
    if (!accesibilidadAbierta) return;

    function actualizarPosicionPanel() {
      const boton = botonAccesibilidad.current;
      if (!boton) return;
      const rect = boton.getBoundingClientRect();
      setPosicionPanel({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }

    actualizarPosicionPanel();
    window.addEventListener("resize", actualizarPosicionPanel);
    window.addEventListener("scroll", actualizarPosicionPanel, true);
    return () => {
      window.removeEventListener("resize", actualizarPosicionPanel);
      window.removeEventListener("scroll", actualizarPosicionPanel, true);
    };
  }, [accesibilidadAbierta]);

  return (
    <header className="navbar">
      <nav
        className="navbar-interior"
        aria-label={nav?.aria?.navegacion ?? "Navegación Principal"}
      >
        <Link
          to="/"
          className="navbar-marca"
          aria-label={nav?.logo?.aria ?? "Inicio"}
          onClick={() => setAbierto(false)}
        >
          <img src={Logo} alt="Logo de sintonia" />
        </Link>

        <div className="navbar-movil-acciones">
          {!abierto && estaAutenticado && (
            <button
              type="button"
              className="navbar-icono navbar-buscar-movil"
              aria-label={ingles ? "Search" : "Buscar"}
              onClick={() => navigate("/catalogo")}
            >
              <Icono nombre="buscar" />
            </button>
          )}
          <button
            type="button"
            ref={botonMenu}
            className={`navbar-icono${abierto ? " navbar-icono-abierto" : ""}`}
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
              <button
                type="button"
                className="btn btn-secundario"
                onClick={recargar}
              >
                {ingles ? "Try again" : "Reintentar"}
              </button>
            </div>
          )}
          {nav && (
            <ul className="navbar-enlaces">
              {enlacesInvitado.map(([clave, etiqueta]) => (
                <li key={clave}>
                  <NavLink
                    to={DESTINOS_INVITADO[clave]}
                    end={clave === "inicio"}
                    onClick={() => setAbierto(false)}
                  >
                    {estaAutenticado && (
                      <Icono
                        nombre={clave === "inicio" ? "inicio" : "buscar"}
                      />
                    )}
                    {etiqueta}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}

          <div className="navbar-accesibilidad-sesion">
            <div className="navbar-utilidades">
              <div className="navbar-utilidad-fila">
                <span>{textos?.menuMovil?.secciones?.idioma}</span>
                <div className="navbar-idiomas-movil">
                  <div className="navbar-idioma">
                    <button
                      type="button"
                      className="navbar-idioma-boton-es"
                      aria-pressed={idioma === "es"}
                      onClick={() => cambiarIdioma("es")}
                    >
                      ES
                    </button>
                    <button
                      type="button"
                      className="navbar-idioma-boton-en"
                      aria-pressed={idioma === "en"}
                      onClick={() => cambiarIdioma("en")}
                    >
                      EN
                    </button>
                  </div>
                </div>
              </div>

              <button
                ref={botonAccesibilidad}
                className="navbar-accesibilidad"
                type="button"
                aria-label={
                  ingles
                    ? "Accessibility options"
                    : "Opciones de accesibilidad"
                }
                aria-expanded={accesibilidadAbierta}
                aria-controls="panel-accesibilidad"
                onClick={() => setAccesibilidadAbierta((valor) => !valor)}
              >
                <span>{textos?.menuMovil?.secciones?.accesibilidad}</span>
                <div className="navbar-accesibilidad-movil">
                  <Icono nombre="accesibilidad" />
                </div>
              </button>
            </div>

            <div
              className={`navbar-sesion${estaAutenticado ? " navbar-sesion-conectada" : ""}`}
            >
              {estaAutenticado ? (
                <div className="navbar-sesion-autenticada">
                  <div className="navbar-sesion-identidad">
                    <span className="navbar-avatar-movil cuerpo-p-fuerte">
                      {inicialesUsuario}
                    </span>
                    <span className="navbar-sesion-datos">
                      <span className="cuerpo-m-fuerte">{primerNombre}</span>
                      <span className="detalle-nota">{etiquetaSesionIniciada}</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    className="navbar-cerrar-sesion-movil cuerpo-p-fuerte"
                    onClick={async () => {
                      await cerrarSesion();
                      setAbierto(false);
                      navigate("/");
                    }}
                  >
                    {etiquetaCerrarSesion}
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/ingresar"
                    className="btn btn-fantasma navbar-invitado-ingresar"
                    onClick={() => setAbierto(false)}
                  >
                    {nav?.botones?.invitado?.ingresar}
                  </Link>
                  <Link
                    to="/crear-cuenta"
                    className="btn btn-primario navbar-invitado-crear-cuenta"
                    onClick={() => setAbierto(false)}
                  >
                    {nav?.botones?.invitado?.crearCuenta}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {estaAutenticado && (
          <div className="navbar-perfil" ref={perfilRef}>
            <button
              ref={botonPerfil}
              type="button"
              className="navbar-avatar-desktop cuerpo-p-fuerte"
              aria-label={usuario?.nombre ?? (ingles ? "User menu" : "Menú de usuario")}
              aria-expanded={perfilAbierto}
              aria-haspopup="menu"
              aria-controls="navbar-menu-usuario"
              onClick={() => setPerfilAbierto((valor) => !valor)}
            >
              {inicialesUsuario}
            </button>
            {perfilAbierto && (
              <div
                id="navbar-menu-usuario"
                className="navbar-menu-usuario"
                role="menu"
              >
                <div className="navbar-menu-usuario-cabecera">
                  <span className="navbar-avatar-menu cuerpo-p-fuerte">
                    {inicialesUsuario}
                  </span>
                  <span className="navbar-menu-usuario-datos">
                    <span className="cuerpo-p-fuerte">{usuario?.nombre}</span>
                    <span className="detalle-nota">{usuario?.correo}</span>
                  </span>
                </div>
                <div className="navbar-menu-usuario-separador" role="separator" />
                <button
                  type="button"
                  className="navbar-menu-usuario-salir cuerpo-p-fuerte"
                  role="menuitem"
                  onClick={async () => {
                    await cerrarSesion();
                    setPerfilAbierto(false);
                    navigate("/");
                  }}
                >
                  <Icono nombre="salir" />
                  {etiquetaCerrarSesion}
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {accesibilidadAbierta &&
        createPortal(
          <div
            className="navbar-panel-accesibilidad"
            style={{
              "--panel-top": `${posicionPanel.top}px`,
              "--panel-right": `${posicionPanel.right}px`,
            }}
          >
            <PanelAccesibilidad
              textos={textos}
              onClose={() => {
                setAccesibilidadAbierta(false);
                botonAccesibilidad.current?.focus();
              }}
            />
          </div>,
          document.body,
        )}
    </header>
  );
};

export default Navbar;