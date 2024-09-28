// src/components/Cotizaciones.js
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Cotizaciones() {
  const [cotizaciones, setCotizaciones] = useState([]);
  const navigate = useNavigate();

  // Función para obtener todas las cotizaciones desde Firestore
  const fetchCotizaciones = async () => {
    const cotizacionesRef = await getDocs(collection(db, "cotizaciones"));
    const cotizacionesList = cotizacionesRef.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCotizaciones(cotizacionesList);
  };

  // Cargar cotizaciones cuando el componente se monta
  useEffect(() => {
    fetchCotizaciones();
  }, []);

  // Función para eliminar una cotización
  const handleDelete = async (id) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar esta cotización?")
    ) {
      await deleteDoc(doc(db, "cotizaciones", id));
      fetchCotizaciones(); // Volver a cargar las cotizaciones después de eliminar
    }
  };

  // Función para ver el detalle de la cotización
  const handleViewDetail = (id) => {
    navigate(`/cotizaciones/${id}`); // Navega a la ruta del detalle de la cotización
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Cotizaciones</h2>

      {/* Tabla responsiva */}
      {cotizaciones.length > 0 ? (
        <table className="table-auto w-full mb-6">
          <thead>
            <tr>
              <th className="px-4 py-2">Número de Cotización</th>
              <th className="px-4 py-2">Nombre del Proyecto</th>
              <th className="px-4 py-2">Nombre del Cliente</th>
              <th className="px-4 py-2">Monto Total</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cotizaciones.map((cotizacion) => (
              <tr key={cotizacion.id}>
                <td className="border px-4 py-2">
                  {cotizacion.numeroCotizacion}
                </td>
                <td className="border px-4 py-2">
                  {cotizacion.clienteData.nombreProyecto}
                </td>
                <td className="border px-4 py-2">
                  {cotizacion.clienteData.nombreCliente}
                </td>
                <td className="border px-4 py-2">
                  ${cotizacion.totalCotizacion.toFixed(2)}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleViewDetail(cotizacion.id)}
                    className="bg-blue-500 text-white px-4 py-2 mr-2 rounded"
                  >
                    Ver Detalle
                  </button>
                  <button
                    onClick={() => handleDelete(cotizacion.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay cotizaciones disponibles.</p>
      )}
    </div>
  );
}

export default Cotizaciones;
