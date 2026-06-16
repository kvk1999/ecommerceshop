import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <App />
              <Toaster
                position="top-right"
                toastOptions={{
                  className: "toast-glass",
                  duration: 3000,
                  style: {
                    background: "rgba(15,23,42,0.95)",
                    color: "#f8fafc",
                    border: "1px solid rgba(255,255,255,0.08)",
                  },
                  success: {
                    iconTheme: {
                      primary: "#22d3ee",
                      secondary: "#111827",
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: "#fb7185",
                      secondary: "#111827",
                    },
                  },
                }}
              />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ThemeProvider>
    </HashRouter>

  </React.StrictMode>
);
