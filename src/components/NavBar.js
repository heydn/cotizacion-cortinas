// src/components/NavBar.js
import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex justify-between items-center">
        <div className="text-white text-lg">
          {/* Enlaces del menú */}
          <Link
            to="/cotizador"
            className="mr-4"
          >
            Cotizador
          </Link>
          <Link
            to="/cotizaciones"
            className="mr-4"
          >
            Cotizaciones
          </Link>
          <Link
            to="/admin"
            className="mr-4"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
