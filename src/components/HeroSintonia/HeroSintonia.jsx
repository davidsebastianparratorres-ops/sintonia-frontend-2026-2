import CollagePortadas from "../CollagePortadas/CollagePortadas.jsx";
import "./HeroSintonia.css";

export default function HeroSintonia({ textos, totalGeneros }) {
  const hero = textos?.paginas?.inicioPublico?.hero;
  const cifras = textos?.paginas?.inicioPublico?.cifras;

  return (
    <section className="ancho-home hero-sintonia" aria-busy={!hero}>
      <div className="texto-hero">
        <span className="etiqueta-sintonia ">{hero?.etiquetas?.temporada}</span>
        
            <h1 className="titular-gigante">
                {hero?.titulo}
            </h1>
        

        <p>{hero?.subtitulo}</p>

        <div className="grupo-botones">
          <button
            type="button"
            className="btn btn-primario-g"
            onClick={() => abrirCuenta("registro")}
          >
            {hero?.botones?.crearCuentaGratis}
          </button>
          <a className="btn btn-secundario-g" href="#catalogo">
            {hero?.botones?.explorarCatalogo}
          </a>
        </div>

        <dl className="cifras-sintonia">
          {Object.entries(cifras ?? {}).map(([clave, cifra]) => (
            <div key={clave}>
              <dt>{clave === "generos" ? totalGeneros : cifra.valor}</dt>
              <dd>{cifra.etiqueta}</dd>
            </div>
          ))}
        </dl>
      </div>
      <CollagePortadas />
    </section>
  );
}
