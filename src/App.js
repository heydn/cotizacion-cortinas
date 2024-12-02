// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginComponent from "./components/LoginComponent";
import ProtectedRoute from "./components/ProtectedRoute";
import Cotizador from "./components/Cotizador"; // Componente Cotizador
import Cotizaciones from "./components/Cotizaciones"; // Mantenedor de cotizaciones
import AdminPanel from "./components/AdminPanel"; // Admin de productos
import DetalleCotizacion from "./components/DetalleCotizacion"; // Detalle de cotización
import NavBar from "./components/NavBar"; // Menú

function App() {
  return (
    <Router>
      <NavBar /> {/* Menú de navegación */}
      <Routes>
        <Route
          path="/"
          element={<LoginComponent />}
        />{" "}
        {/* Inicio de sesión */}
        <Route
          path="/cotizador"
          element={
            <ProtectedRoute>
              <Cotizador />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cotizaciones"
          element={
            <ProtectedRoute>
              <Cotizaciones />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cotizaciones/:id"
          element={
            <ProtectedRoute>
              <DetalleCotizacion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
