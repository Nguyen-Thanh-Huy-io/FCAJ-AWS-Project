import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { PostCreatorProvider } from "./context/PostCreatorContext";
import { ConnectionsProvider } from "./context/ConnectionsContext";
import { AuthProvider } from "./context/AuthContext";
import { BrandProvider } from "./context/BrandContext";
import { Toaster } from "sonner";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <BrandProvider>
        <ConnectionsProvider>
          <PostCreatorProvider>
            <App />
            <Toaster position="top-right" richColors />
          </PostCreatorProvider>
        </ConnectionsProvider>
      </BrandProvider>
    </AuthProvider>
  </BrowserRouter>
);
