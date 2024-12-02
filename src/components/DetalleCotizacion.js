// src/components/DetalleCotizacion.js
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

function DetalleCotizacion() {
  const { id } = useParams(); // Obtener el ID de la cotización desde la URL
  const [cotizacion, setCotizacion] = useState(null);

  // Función para obtener los detalles de la cotización
  const fetchCotizacion = async () => {
    const cotizacionDoc = await getDoc(doc(db, "cotizaciones", id));
    if (cotizacionDoc.exists()) {
      setCotizacion(cotizacionDoc.data());
    }
  };

  useEffect(() => {
    fetchCotizacion();
  }, [id]);

  if (!cotizacion) {
    return <p>Cargando detalles de la cotización...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">
        Detalle de la Cotización #{cotizacion.numeroCotizacion}
      </h2>

      <div className="mb-6">
        <h3 className="text-xl">Datos del Cliente</h3>
        <p>
          <strong>Nombre del Proyecto:</strong>{" "}
          {cotizacion.clienteData.nombreProyecto}
        </p>
        <p>
          <strong>Nombre del Cliente:</strong>{" "}
          {cotizacion.clienteData.nombreCliente}
        </p>
        <p>
          <strong>Ciudad:</strong> {cotizacion.clienteData.ciudad}
        </p>
        <p>
          <strong>Comuna:</strong> {cotizacion.clienteData.comuna}
        </p>
        <p>
          <strong>Correo Electrónico:</strong> {cotizacion.clienteData.correo}
        </p>
        <p>
          <strong>Teléfono:</strong> {cotizacion.clienteData.telefono}
        </p>
        <p>
          <strong>Dirección:</strong> {cotizacion.clienteData.direccion}
        </p>
        <p>
          <strong>Observaciones:</strong> {cotizacion.clienteData.observacion}
        </p>
      </div>

      <div>
        <h3 className="text-xl mb-4">Items de la Cotización</h3>

        <table className="table-auto w-full mb-6">
          <thead>
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Localización</th>
              <th className="px-4 py-2">Producto</th>
              <th className="px-4 py-2">Material</th>
              <th className="px-4 py-2">Motorizado</th>
              <th className="px-4 py-2">Doble</th>
              <th className="px-4 py-2">Cenefa</th>
              <th className="px-4 py-2">Cadena Metálica</th>
              <th className="px-4 py-2">Colocación</th>
              <th className="px-4 py-2">Color Anclaje</th>
              <th className="px-4 py-2">Ancho</th>
              <th className="px-4 py-2">Largo</th>
              <th className="px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {cotizacion.items.map((item, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{item.localizacion}</td>
                <td className="border px-4 py-2">{item.productoId}</td>
                <td className="border px-4 py-2">{item.materialId}</td>
                <td className="border px-4 py-2">
                  {item.motorizado ? "Sí" : "No"}
                </td>
                <td className="border px-4 py-2">{item.doble ? "Sí" : "No"}</td>
                <td className="border px-4 py-2">
                  {item.cenefa ? "Sí" : "No"}
                </td>
                <td className="border px-4 py-2">
                  {item.cadenaMetalica ? "Sí" : "No"}
                </td>
                <td className="border px-4 py-2">{item.colocacion}</td>
                <td className="border px-4 py-2">{item.colorAnclaje}</td>
                <td className="border px-4 py-2">{item.ancho}</td>
                <td className="border px-4 py-2">{item.largo}</td>
                <td className="border px-4 py-2">${item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="mt-6 font-bold">
          Total Cotización: ${cotizacion.totalCotizacion.toFixed(2)}
        </h3>
      </div>
    </div>
  );
}

export default DetalleCotizacion;
