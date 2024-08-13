// src/components/ProtectedRoute.js
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebaseConfig";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null); // Estado para almacenar el usuario actual
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false); // Deja de cargar cuando se obtiene el usuario
    });

    // Limpiar el listener al desmontar el componente
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Mostrar un indicador de carga mientras se obtiene el usuario
  }

  if (!user) {
    return <Navigate to="/login" />; // Redirigir al login si no hay usuario autenticado
  }

  return children; // Renderizar los hijos (el componente protegido) si el usuario está autenticado
};

export default ProtectedRoute;
