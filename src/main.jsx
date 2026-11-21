import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./styles/tokens.css";
import "./styles/buttons.css"
import "./styles/global.css";

import LayoutPublico from "./layouts/LayoutPublico.jsx";
import Home from "./pages/Home/Home.jsx";
import Catalogo from "./pages/Catalog/Catalog.jsx";
import DetalleAlbum from "./pages/DetalleAlbum/DetalleAlbum.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutPublico />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route
            path="/albumes/:id"
            element={<DetalleAlbum />}
          />
        </Route>

        {/* Redirige cualquier ruta desconocida al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);