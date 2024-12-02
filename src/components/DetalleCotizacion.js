// src/components/DetalleCotizacion.js
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useParams } from "react-router-dom";

function DetalleCotizacion() {
  const { id } = useParams(); // Obtener el ID de la cotización desde la URL
  const [cotizacion, setCotizacion] = useState(null);
  const [productos, setProductos] = useState([]); // Lista de productos
  const [materiales, setMateriales] = useState({}); // Materiales agrupados por producto

  // Función para obtener los productos desde Firestore
  const fetchProductos = async () => {
    const productosRef = await getDocs(collection(db, "productos"));
    const productosList = productosRef.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProductos(productosList);

    // Obtener los materiales de cada producto
    const materialesObj = {};
    for (const producto of productosList) {
      const materialesRef = await getDocs(
        collection(db, "productos", producto.id, "materiales")
      );
      materialesObj[producto.id] = materialesRef.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }
    setMateriales(materialesObj);
  };

  // Función para obtener los detalles de la cotización
  const fetchCotizacion = async () => {
    const cotizacionDoc = await getDoc(doc(db, "cotizaciones", id));
    if (cotizacionDoc.exists()) {
      setCotizacion(cotizacionDoc.data());
    }
  };

  useEffect(() => {
    fetchProductos();
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

      {/* Datos del cliente */}
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

      {/* Items de la cotización */}
      <div>
        <h3 className="text-xl mb-4">Items de la Cotización</h3>

        <table className="table-auto w-full mb-6 border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Localización</th>
              <th className="border px-4 py-2">Producto</th>
              <th className="border px-4 py-2">Material</th>
              <th className="border px-4 py-2">Motorizado</th>
              <th className="border px-4 py-2">Doble</th>
              <th className="border px-4 py-2">Cenefa</th>
              <th className="border px-4 py-2">Cadena Metálica</th>
              <th className="border px-4 py-2">Colocación</th>
              <th className="border px-4 py-2">Color Anclaje</th>
              <th className="border px-4 py-2">Ancho</th>
              <th className="border px-4 py-2">Largo</th>
              <th className="border px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {cotizacion.items.map((item, index) => {
              const producto = productos.find((p) => p.id === item.productoId);
              const material = materiales[item.productoId]?.find(
                (m) => m.id === item.materialId
              );
              return (
                <tr key={index}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{item.localizacion}</td>
                  <td className="border px-4 py-2">
                    {producto?.name || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {material?.name || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {item.motorizado ? "Sí" : "No"}
                  </td>
                  <td className="border px-4 py-2">
                    {item.doble ? "Sí" : "No"}
                  </td>
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
              );
            })}
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
