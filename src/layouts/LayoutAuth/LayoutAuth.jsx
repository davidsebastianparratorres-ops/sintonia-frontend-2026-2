import { useEffect } from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTextos } from "../../hooks/useTextos.js";
import { leerCookie } from "../../services/cookies.js";
import PortadaAlbum from "../../components/PortadaAlbum/PortadaAlbum.jsx";
import Logo from "../../assets/logo.svg";
import "./LayoutAuth.css";

/* Cuadrícula 4x2 del panel derecho (según Figma).
   color = variable de tokens.css, patron = 0..3 */
const PORTADAS_GRILLA = [
  { portada: { fondo: "var(--portada-3)", figura: "var(--fijo-negro)", patron: 2 } },
  { portada: { fondo: "var(--portada-5)", figura: "var(--portada-6)", patron: 0 }},
  { portada: { fondo: "var(--portada-2)", figura: "var(--portada-4)", patron: 1 }},
  { portada: { fondo: "var(--portada-6)", figura: "var(--portada-3)", patron: 1 } },
  { portada: { fondo: "var(--portada-4)", figura: "var(--portada-2)", patron: 3 } },
  { portada: { fondo: "var(--fijo-negro)", figura: "var(--portada-5)", patron: 3 } },
  { portada: { fondo: "var(--portada-3)", figura: "var(--portada-4)", patron: 0 } },
  { portada: { fondo: "var(--portada-6)", figura: "var(--portada-5)", patron: 2 } },
];

/* Collage móvil: izquierda inclinada, centro grande, derecha inclinada */
const PORTADAS_COLLAGE = [
  {
    portada: { fondo: "var(--portada-5)", figura: "var(--portada-6)", patron: 0 },
    clase: "izquierda",
  },
  {
    portada: { fondo: "var(--portada-3)", figura: "var(--fijo-negro)", patron: 2 },
    clase: "centro",
  },
  {
    portada: { fondo: "var(--portada-2)", figura: "var(--portada-4)", patron: 1 },
    clase: "derecha",
  },
];

const LayoutAuth = () => {
  const { estaAutenticado, cargandoSesion } = useAuth();
  const idioma = leerCookie("idioma") === "en" ? "en" : "es";
  const datos = useTextos(idioma);

  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  if (cargandoSesion) return null;
  if (estaAutenticado) return <Navigate to="/" replace />;

  const textos = datos?.textos;
  const presentacion = textos?.paginas?.ingresar?.presentacion;
  const legal = textos?.footer?.legal;
  const derechos = legal?.derechos?.replace("{anio}", new Date().getFullYear());

  return (
    <div className="auth">
      <div className="auth-principal">
        <div className="auth-collage" aria-hidden="true">
          {PORTADAS_COLLAGE.map(({ portada, clase }) => (
            <div key={clase} className={`auth-collage-item auth-collage-${clase}`}>
              <PortadaAlbum portada={portada} />
            </div>
          ))}
        </div>

        <Link to="/" className="auth-logo" aria-label="Sintonía">
          <img src={Logo} alt="Sintonía" />
        </Link>

        <main className="auth-contenido">
          <Outlet context={{ datos, idioma }} />
        </main>

        <footer className="auth-legal detalle-nota">
          {derechos && <p>{derechos}</p>}
          {legal?.nota && <p>{legal.nota}</p>}
        </footer>
      </div>

      <aside className="auth-presentacion" aria-hidden="true">
        <div className="auth-grilla">
          {PORTADAS_GRILLA.map(({ portada }, i) => (
            <div key={i} className="auth-grilla-item">
              <PortadaAlbum portada={portada} />
            </div>
          ))}
        </div>
        {presentacion?.titulo && (
          <h2 className="auth-presentacion-titulo titular-h1">{presentacion.titulo}</h2>
        )}
        {presentacion?.texto && (
          <p className="auth-presentacion-texto cuerpo-g">{presentacion.texto}</p>
        )}
      </aside>
    </div>
  );
};

export default LayoutAuth;