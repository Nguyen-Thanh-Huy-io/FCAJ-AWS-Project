import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AppInitializer } from "./components/AppInitializer";
import { Toaster } from "sonner";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppInitializer />
    <App />
    <Toaster position="top-right" richColors />
  </BrowserRouter>
);
