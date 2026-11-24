import CollagePortadas from "../CollagePortadas/CollagePortadas.jsx";
import { Link } from "react-router-dom";
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
        

        <p className="cuerpo-g">{hero?.subtitulo}</p>

        <div className="grupo-botones">
          <Link className="btn btn-secundario-g" to="/catalogo">
            {hero?.botones?.explorarCatalogo}
          </Link>
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
