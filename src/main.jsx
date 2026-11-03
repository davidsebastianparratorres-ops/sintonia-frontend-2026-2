import { StrictMode } from "react"; 
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import "./styles/global.css";
import Home from "./Home";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Home/>
    </StrictMode>
);