// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
        {/* Rutas para los componentes */}
        <Route
          path="/cotizador"
          element={<Cotizador />}
        />{" "}
        {/* Cotizador */}
        <Route
          path="/cotizaciones"
          element={<Cotizaciones />}
        />{" "}
        {/* Cotizaciones */}
        <Route
          path="/admin"
          element={<AdminPanel />}
        />{" "}
        {/* Admin */}
        <Route
          path="/cotizaciones/:id"
          element={<DetalleCotizacion />}
        />{" "}
        {/* Detalle de cotización */}
      </Routes>
    </Router>
  );
}

export default App;
