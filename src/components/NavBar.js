// src/components/NavBar.js
import React from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex justify-between items-center">
        <div className="text-white text-lg">
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
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
