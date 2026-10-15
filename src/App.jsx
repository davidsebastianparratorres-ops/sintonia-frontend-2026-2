import { useTextos } from "./hooks/useTextos.js";
import "./App.css";
import Navbar from "./components/Navbar";
import { useState } from "react";

function App() {
  // Idioma por defecto español
  const [idioma, setIdioma] = useState("es");
  const datos = useTextos(idioma);
  console.log(datos);

  return (
    <div className="sitio">
      <Navbar />
    </div>
  );
}

export default App;
