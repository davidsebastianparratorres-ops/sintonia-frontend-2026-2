import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import Icono from "../../components/Icono";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Login.css";

/* El error de campos puede llegar como objeto {correo: "msg"} o como lista [{campo, mensaje}] */
function normalizarCampos(campos) {
  const salida = {};
  if (Array.isArray(campos)) {
    campos.forEach((c) => {
      const clave = c?.campo ?? c?.campos;
      const msg = c?.mensaje ?? c?.message;
      if (clave && msg) salida[clave] = msg;
    });
  } else if (campos && typeof campos === "object") {
    Object.entries(campos).forEach(([clave, valor]) => {
      salida[clave] = Array.isArray(valor) ? valor[0] : valor;
    });
  }
  return salida;
}

const Login = () => {
  const { datos } = useOutletContext();
  const navigate = useNavigate();
  const { iniciarSesion } = useAuth();
  const t = datos?.textos?.paginas?.ingresar;
  const form = t?.formulario;
  const errores = t?.errores;

  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [mantener, setMantener] = useState(true);
  const [verClave, setVerClave] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [alerta, setAlerta] = useState(null); // "obligatorios" | "credenciales" | "limite" | "conexion" | null
  const [erroresCampo, setErroresCampo] = useState({});
  const [segundos, setSegundos] = useState(0);
  const correoRef = useRef(null);
  const claveRef = useRef(null);

  function enfocarPrimerCampoConError(campos) {
    if (campos.correo) {
      correoRef.current?.focus();
    } else if (campos.clave) {
      claveRef.current?.focus();
    }
  }

  useEffect(() => {
    if (t?.seo?.titulo) document.title = t.seo.titulo;
  }, [t?.seo?.titulo]);

  /* Cuenta regresiva del 429 */
  useEffect(() => {
    if (segundos <= 0) return;
    const id = setTimeout(() => setSegundos((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [segundos]);

  useEffect(() => {
    if (alerta === "limite" && segundos <= 0) setAlerta(null);
  }, [alerta, segundos]);

  async function enviar() {
    setAlerta(null);
    setErroresCampo({});

    const vacios = {};
    if (!correo.trim()) vacios.correo = errores?.correoObligatorio;
    if (!clave) vacios.clave = errores?.claveObligatoria;
    if (Object.keys(vacios).length) {
      setErroresCampo(vacios);
      setAlerta("obligatorios");
      enfocarPrimerCampoConError(vacios);
      return;
    }

    setEnviando(true);
    try {
      await iniciarSesion({
        correo: correo.trim(),
        clave,
        recordar: mantener,
      });
      navigate("/", { replace: true });
    } catch (error) {
      if (error?.tipo === "red") {
        setAlerta("conexion");
      } else if (error?.status === 401) {
        setAlerta("credenciales");
      } else if (error?.status === 422) {
        const campos = normalizarCampos(error.campos);
        setErroresCampo(campos);
        enfocarPrimerCampoConError(campos);
      } else if (error?.status === 429) {
        setSegundos(Number(error.retryAfter) || 0);
        setAlerta("limite");
      } else {
        setAlerta("conexion");
      }
    } finally {
      setEnviando(false);
    }
  }

  function alEnviar(evento) {
    evento.preventDefault();
    if (enviando || segundos > 0) return;
    enviar();
  }

  const bloqueado = enviando || segundos > 0;
  const contenidoAlerta = {
    obligatorios: errores?.camposObligatorios,
    credenciales: errores?.credenciales,
    limite: errores?.demasiadosIntentos && {
      titulo: errores.demasiadosIntentos.titulo,
      texto: errores.demasiadosIntentos.texto?.replace("{segundos}", segundos),
    },
    conexion: errores?.conexion,
  }[alerta];

  return (
    <form className="login" onSubmit={alEnviar} noValidate>
      <h1 className="login-titulo titular-h1">{form?.titulo}</h1>
      <p className="login-subtitulo cuerpo-m">{form?.subtitulo}</p>

      <div className="login-alerta-zona" aria-live="polite">
        {contenidoAlerta && (
          <div className="login-alerta" role="alert">
            <p className="login-alerta-titulo cuerpo-p-fuerte">{contenidoAlerta.titulo}</p>
            <p className="cuerpo-p">{contenidoAlerta.texto}</p>
            {alerta === "conexion" && (
              <button
                type="button"
                className="login-alerta-boton cuerpo-p-fuerte"
                onClick={enviar}
                disabled={enviando}
              >
                {errores?.conexion?.botones?.reintentar}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="login-campo">
        <label htmlFor="login-correo" className="cuerpo-p-fuerte">
          {form?.etiquetas?.correo}
        </label>
        <input
          ref={correoRef}
          id="login-correo"
          className="login-input cuerpo-m"
          type="email"
          name="correo"
          autoComplete="email"
          value={correo}
          placeholder={form?.placeholders?.correo}
          onChange={(e) => setCorreo(e.target.value)}
          aria-invalid={erroresCampo.correo ? "true" : "false"}
          aria-describedby={erroresCampo.correo ? "login-correo-error" : undefined}
        />
        {erroresCampo.correo && (
          <p id="login-correo-error" className="login-error-campo detalle-nota" aria-live="polite">
            {erroresCampo.correo}
          </p>
        )}
      </div>

      <div className="login-campo">
        <label htmlFor="login-clave" className="cuerpo-p-fuerte">
          {form?.etiquetas?.clave}
        </label>
        <div className="login-input-envoltura">
          <input
            ref={claveRef}
            id="login-clave"
            className="login-input login-input-clave cuerpo-m"
            type={verClave ? "text" : "password"}
            name="clave"
            autoComplete="current-password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            aria-invalid={erroresCampo.clave ? "true" : "false"}
            aria-describedby={erroresCampo.clave ? "login-clave-error" : undefined}
          />
          <button
            type="button"
            className="login-ojo"
            aria-label={verClave ? form?.botones?.ocultarClave : form?.botones?.mostrarClave}
            aria-pressed={verClave}
            onClick={() => setVerClave((v) => !v)}
          >
            <Icono nombre={verClave ? "ojo-cerrado" : "ojo"} />
          </button>
        </div>
        {erroresCampo.clave && (
          <p id="login-clave-error" className="login-error-campo detalle-nota" aria-live="polite">
            {erroresCampo.clave}
          </p>
        )}
      </div>

      <div className="login-opciones">
        <label className="login-check cuerpo-p" htmlFor="login-mantener">
          <input
            id="login-mantener"
            type="checkbox"
            checked={mantener}
            onChange={(e) => setMantener(e.target.checked)}
          />
          <span>{form?.etiquetas?.mantenerSesion}</span>
        </label>
        <Link to="/recuperar-clave" className="login-enlace cuerpo-p-fuerte">
          {form?.enlaces?.olvidasteClave}
        </Link>
      </div>

      <button type="submit" className="login-enviar cuerpo-m-fuerte" disabled={bloqueado}>
        {enviando ? form?.mensajes?.ingresando : form?.botones?.ingresar}
      </button>

      <p className="login-pie cuerpo-p">
        <span>{form?.mensajes?.sinCuenta}</span>{" "}
        <Link to="/crear-cuenta" className="login-enlace cuerpo-p-fuerte">
          {form?.enlaces?.crearCuenta}
        </Link>
      </p>
    </form>
  );
};

export default Login;