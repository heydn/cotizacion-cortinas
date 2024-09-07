// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginComponent from "./components/LoginComponent";
import CotizacionComponent from "./components/CotizacionComponent";
import AdminPanel from "./components/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import Cotizador from "./components/Cotizador";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={<LoginComponent />}
          />
          <Route
            path="/cotizacion"
            element={
              <ProtectedRoute>
                <Cotizador />
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
      </div>
    </Router>
  );
}

export default App;
