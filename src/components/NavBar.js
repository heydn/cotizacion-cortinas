// src/components/NavBar.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar el menú desplegable
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Cerrar sesión con Firebase
      navigate("/login"); // Redirigir al login después de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold mr-6 hidden md:block">
          Cotizador de Cortinas
        </h1>
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`md:flex items-center ${
          isOpen ? "block" : "hidden"
        } md:block`}
      >
        <Link
          to="/cotizacion"
          className="text-white hover:underline md:mr-4"
        >
          Cotizador
        </Link>
        <Link
          to="/admin"
          className="text-white hover:underline"
        >
          Panel de Administración
        </Link>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Cerrar Sesión
      </button>
    </nav>
  );
}

export default NavBar;
