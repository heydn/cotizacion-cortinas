// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Cotizador from "./components/Cotizador";
import AdminPanel from "./components/AdminPanel";
import Cotizaciones from "./components/CotizacionComponent";
import DetalleCotizacion from "./components/DetalleCotizacion";
import NavBar from "./components/NavBar";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route
          path="/cotizador"
          element={<Cotizador />}
        />
        <Route
          path="/admin"
          element={<AdminPanel />}
        />
        <Route
          path="/cotizaciones"
          element={<Cotizaciones />}
        />
        <Route
          path="/cotizaciones/:id"
          element={<DetalleCotizacion />}
        />{" "}
        {/* Ruta para el detalle */}
      </Routes>
    </Router>
  );
}

export default App;
