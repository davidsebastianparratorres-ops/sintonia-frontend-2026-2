import "./InvitacionRegistro.css";
export default function InvitacionRegistro({textos}) {
    const inv=textos?.paginas?.inicioPublico?.cta ;
  return (
    <section className="ancho-home registro-sintonia">
      <div>
        <h2 className="titular-h2">
          {inv?.titulo}
        </h2>
        <p>
          {inv?.texto}
        </p>
      </div>
      <button
        className="btn btn-inverso-g"
      >
        {inv?.botones.crearCuentaGratis}
      </button>
    </section>
  );
}
