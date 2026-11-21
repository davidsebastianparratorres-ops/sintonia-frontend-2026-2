
export default function EncabezadoCatalogo({ generoSeleccionado, textos }) {
  const tCat = textos?.paginas?.catalogo;
  const tituloMovil = textos?.navbar?.enlaces?.catalogo;

  return (
    <header className="encabezado-catalogo titular-h1">
      {generoSeleccionado ? (
        <>
          <h1>{generoSeleccionado.nombre}</h1>
          <p className="cuerpo-m">{generoSeleccionado.descripcion}</p>
        </>
      ) : (
        <>
          <h1>
            <span className="titulo-catalogo-mobile ">{tituloMovil}</span>
            <span className="titulo-catalogo-completo">
              {tCat?.encabezado?.titulo }
            </span>
          </h1>
          <p className="cuerpo-m">{tCat?.encabezado?.subtitulo}</p>
        </>
      )}
    </header>
  );
}