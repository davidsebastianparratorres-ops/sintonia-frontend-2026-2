import { useOutletContext } from "react-router-dom";
import { useCatalogo } from "../../hooks/useCatalogo.js";
import { useGeneros } from "../../hooks/useGeneros.js";

import HeroSintonia from "../../components/HeroSintonia/HeroSintonia.jsx";
import SeccionAlbumes from "../../components/SeccionesAlbumes/SeccionesAlbumes.jsx";
import SeccionGeneros from "../../components/SeccionGeneros/SeccionGeneros.jsx";
import InvitacionRegistro from "../../components/InvitacionRegistro/InvitacionRegistro.jsx";

export default function Home() {
  // Recibe los datos globales que ahora viven en LayoutPublico
  const { datos, abrirAlbum, abrirCuenta } = useOutletContext();

  const { albumes, cargando: cargandoAlbumes, error: errorAlbumes } = useCatalogo();
  const { generos } = useGeneros();

  return (
    <>
      <HeroSintonia
        {...datos}
        totalGeneros={generos.length}
        abrirCuenta={abrirCuenta}
      />
      <SeccionAlbumes
        {...datos}
        albumes={albumes}
        cargando={cargandoAlbumes}
        error={errorAlbumes}
        filaHorizontalMovil
        onSeleccionar={abrirAlbum}
      />
      <SeccionGeneros
        {...datos}
        generos={generos}
      />
      <InvitacionRegistro
        {...datos}
        abrirCuenta={abrirCuenta}
      />
    </>
  );
}