import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

import "./styles/tokens.css";
import "./styles/buttons.css";
import "./styles/global.css";

import LayoutPublico from "./layouts/LayoutPublico/LayoutPublico.jsx";
import LayoutAuth from "./layouts/LayoutAuth/LayoutAuth.jsx";
import Home from "./pages/Home/Home.jsx";
import Catalogo from "./pages/Catalog/Catalog.jsx";
import DetalleAlbum from "./pages/DetalleAlbum/DetalleAlbum.jsx";
import Login from "./pages/Login/Login.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<LayoutPublico />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/albumes/:id" element={<DetalleAlbum />} />
          </Route>
          <Route element={<LayoutAuth />}>
            <Route path="/ingresar" element={<Login />} />
          </Route>

          {/* Redirige cualquier ruta desconocida al inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
