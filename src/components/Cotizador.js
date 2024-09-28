// src/components/Cotizador.js
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import NavBar from "./NavBar"; // Importamos el NavBar

function Cotizador() {
  const [clienteData, setClienteData] = useState({
    nombreProyecto: "",
    nombreCliente: "",
    ciudad: "",
    comuna: "",
    correo: "",
    telefono: "",
    direccion: "",
    observacion: "",
  });

  const [productos, setProductos] = useState([]);
  const [materiales, setMateriales] = useState({});
  const [items, setItems] = useState([]);
  const [totalCotizacion, setTotalCotizacion] = useState(0); // Suma total de la cotización
  const [showClienteModal, setShowClienteModal] = useState(false); // Modal para cliente
  const [showProductoModal, setShowProductoModal] = useState(false); // Modal para producto
  const [currentItem, setCurrentItem] = useState({
    id: null,
    localizacion: "",
    productoId: "",
    materialId: "",
    motorizado: false,
    doble: false,
    cenefa: false,
    cadenaMetalica: false,
    colocacion: "oculta",
    colorAnclaje: "blanco",
    ancho: 0,
    largo: 0,
    total: 0,
  });

  // Función para obtener los productos desde Firestore
  const fetchProductos = async () => {
    const productosRef = await getDocs(collection(db, "productos"));
    const productosList = productosRef.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setProductos(productosList);

    // Para cada producto, obtener sus materiales y almacenarlos en un objeto separado
    for (const producto of productosList) {
      const materialesRef = await getDocs(
        collection(db, "productos", producto.id, "materiales")
      );
      const materialesList = materialesRef.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMateriales((prevState) => ({
        ...prevState,
        [producto.id]: materialesList,
      }));
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Función para obtener el último número de cotización
  const obtenerUltimoNumeroCotizacion = async () => {
    const cotizacionesRef = collection(db, "cotizaciones");
    const cotizacionesQuery = query(
      cotizacionesRef,
      orderBy("numeroCotizacion", "desc"),
      limit(1)
    );
    const cotizacionesSnapshot = await getDocs(cotizacionesQuery);

    // Si no hay cotizaciones, comenzamos en 1
    if (cotizacionesSnapshot.empty) {
      return 1;
    }

    // Obtener el último número de cotización
    const ultimoNumeroCotizacion =
      cotizacionesSnapshot.docs[0].data().numeroCotizacion;
    return ultimoNumeroCotizacion + 1;
  };

  // Manejar agregar nuevo item desde el modal
  const handleAddItem = () => {
    const newItems = [...items, { ...currentItem, id: items.length + 1 }];
    setItems(newItems);
    setCurrentItem({
      id: null,
      localizacion: "",
      productoId: "",
      materialId: "",
      motorizado: false,
      doble: false,
      cenefa: false,
      cadenaMetalica: false,
      colocacion: "oculta",
      colorAnclaje: "blanco",
      ancho: 0,
      largo: 0,
      total: 0,
    });
    setShowProductoModal(false); // Cerrar modal al guardar
    calcularTotalCotizacion(newItems); // Recalcular el total de la cotización
  };

  // Función para recalcular el total de la cotización
  const calcularTotalCotizacion = (items) => {
    const total = items.reduce((acc, item) => acc + item.total, 0);
    setTotalCotizacion(total); // Actualizar el total de la cotización
  };

  // Manejar cambios en los items dentro del modal
  const handleItemChange = (field, value) => {
    setCurrentItem((prevItem) => {
      const updatedItem = { ...prevItem, [field]: value };

      // Si se cambia ancho, largo o producto, recalculamos el total
      if (field === "ancho" || field === "largo" || field === "productoId") {
        const productoSeleccionado = productos.find(
          (prod) => prod.id === updatedItem.productoId
        );
        if (productoSeleccionado) {
          updatedItem.total =
            parseFloat(updatedItem.ancho) *
            parseFloat(updatedItem.largo) *
            parseFloat(productoSeleccionado.price);
        }
      }
      return updatedItem;
    });
  };

  // Guardar la cotización con número correlativo
  const handleSaveCotizacion = async () => {
    try {
      const nuevoNumeroCotizacion = await obtenerUltimoNumeroCotizacion();
      await addDoc(collection(db, "cotizaciones"), {
        numeroCotizacion: nuevoNumeroCotizacion,
        clienteData,
        items,
        totalCotizacion,
        fecha: new Date().toISOString(),
      });

      alert(
        `Cotización guardada correctamente con el número: ${nuevoNumeroCotizacion}`
      );
    } catch (error) {
      console.error("Error guardando la cotización", error);
      alert("Error al guardar la cotización");
    }
  };

  // Funciones para abrir y cerrar los modales
  const handleOpenClienteModal = () => setShowClienteModal(true);
  const handleCloseClienteModal = () => setShowClienteModal(false);
  const handleOpenProductoModal = () => setShowProductoModal(true);
  const handleCloseProductoModal = () => setShowProductoModal(false);

  return (
    <div>
      <NavBar /> {/* Aquí se agrega el NavBar */}
      <div className="p-6">
        <h2 className="text-2xl mb-4">Cotizador</h2>

        {/* Sección Datos del Cliente */}
        <div className="mb-6">
          <h3 className="text-xl">Datos del Cliente</h3>

          {/* Botón para abrir el modal de datos del cliente */}
          <button
            onClick={handleOpenClienteModal}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Ingresar datos del cliente
          </button>

          {/* Mostrar datos del cliente en la pantalla */}
          <div className="mt-4">
            <p>
              <strong>Nombre del Proyecto:</strong> {clienteData.nombreProyecto}
            </p>
            <p>
              <strong>Nombre del Cliente:</strong> {clienteData.nombreCliente}
            </p>
            <p>
              <strong>Ciudad:</strong> {clienteData.ciudad}
            </p>
            <p>
              <strong>Comuna:</strong> {clienteData.comuna}
            </p>
            <p>
              <strong>Correo Electrónico:</strong> {clienteData.correo}
            </p>
            <p>
              <strong>Teléfono:</strong> {clienteData.telefono}
            </p>
            <p>
              <strong>Dirección:</strong> {clienteData.direccion}
            </p>
            <p>
              <strong>Observaciones:</strong> {clienteData.observacion}
            </p>
          </div>
        </div>

        {/* Tabla para mostrar los productos agregados */}
        {items.length > 0 && (
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
              {items.map((item, index) => (
                <tr key={item.id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{item.localizacion}</td>
                  <td className="border px-4 py-2">
                    {productos.find((p) => p.id === item.productoId)?.name}
                  </td>
                  <td className="border px-4 py-2">
                    {
                      materiales[item.productoId]?.find(
                        (m) => m.id === item.materialId
                      )?.name
                    }
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
              ))}
              {/* Fila para el total */}
              <tr>
                <td
                  colSpan="12"
                  className="text-right font-bold px-4 py-2"
                >
                  Total:
                </td>
                <td className="border px-4 py-2 font-bold">
                  ${totalCotizacion.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {/* Botón para abrir el modal del producto */}
        <button
          onClick={handleOpenProductoModal}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Agregar Producto
        </button>

        <h3 className="mt-6 font-bold">
          Total Cotización: ${totalCotizacion.toFixed(2)}
        </h3>

        <button
          onClick={handleSaveCotizacion}
          className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
        >
          Guardar Cotización
        </button>
      </div>
      {/* Modal para ingresar los datos del cliente */}
      {showClienteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Datos del Cliente</h3>
              <input
                type="text"
                placeholder="Nombre del Proyecto"
                value={clienteData.nombreProyecto}
                onChange={(e) =>
                  setClienteData({
                    ...clienteData,
                    nombreProyecto: e.target.value,
                  })
                }
                className="border p-2 w-full mb-2"
              />
              <input
                type="text"
                placeholder="Nombre del Cliente"
                value={clienteData.nombreCliente}
                onChange={(e) =>
                  setClienteData({
                    ...clienteData,
                    nombreCliente: e.target.value,
                  })
                }
                className="border p-2 w-full mb-2"
              />
              <input
                type="text"
                placeholder="Ciudad"
                value={clienteData.ciudad}
                onChange={(e) =>
                  setClienteData({ ...clienteData, ciudad: e.target.value })
                }
                className="border p-2 w-full mb-2"
              />
              <input
                type="text"
                placeholder="Comuna"
                value={clienteData.comuna}
                onChange={(e) =>
                  setClienteData({ ...clienteData, comuna: e.target.value })
                }
                className="border p-2 w-full mb-2"
              />
              <input
                type="email"
                placeholder="Correo Electrónico"
                value={clienteData.correo}
                onChange={(e) =>
                  setClienteData({ ...clienteData, correo: e.target.value })
                }
                className="border p-2 w-full mb-2"
              />
              <input
                type="text"
                placeholder="Teléfono"
                value={clienteData.telefono}
                onChange={(e) =>
                  setClienteData({ ...clienteData, telefono: e.target.value })
                }
                className="border p-2 w-full mb-2"
              />
              <input
                type="text"
                placeholder="Dirección"
                value={clienteData.direccion}
                onChange={(e) =>
                  setClienteData({ ...clienteData, direccion: e.target.value })
                }
                className="border p-2 w-full mb-2"
              />
              <textarea
                placeholder="Observaciones"
                value={clienteData.observacion}
                onChange={(e) =>
                  setClienteData({
                    ...clienteData,
                    observacion: e.target.value,
                  })
                }
                className="border p-2 w-full mb-2"
              />

              <button
                onClick={handleCloseClienteModal}
                className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
              >
                Guardar
              </button>
              <button
                onClick={handleCloseClienteModal}
                className="bg-red-500 text-white px-4 py-2 mt-4 ml-4 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal para ingresar los datos del producto */}
      {showProductoModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Agregar Producto</h3>
              <input
                type="text"
                placeholder="Localización"
                value={currentItem.localizacion}
                onChange={(e) =>
                  handleItemChange("localizacion", e.target.value)
                }
                className="border p-2 w-full mb-2"
              />
              <select
                value={currentItem.productoId}
                onChange={(e) => handleItemChange("productoId", e.target.value)}
                className="border p-2 w-full mb-2"
              >
                <option value="">Seleccionar Producto</option>
                {productos.map((producto) => (
                  <option
                    key={producto.id}
                    value={producto.id}
                  >
                    {producto.name} - ${producto.price}
                  </option>
                ))}
              </select>

              {currentItem.productoId && (
                <select
                  value={currentItem.materialId}
                  onChange={(e) =>
                    handleItemChange("materialId", e.target.value)
                  }
                  className="border p-2 w-full mb-2"
                >
                  <option value="">Seleccionar Material</option>
                  {materiales[currentItem.productoId]?.map((material) => (
                    <option
                      key={material.id}
                      value={material.id}
                    >
                      {material.name}
                    </option>
                  ))}
                </select>
              )}

              {/* Checkboxes */}
              <input
                type="checkbox"
                checked={currentItem.motorizado}
                onChange={(e) =>
                  handleItemChange("motorizado", e.target.checked)
                }
              />
              <label className="ml-2">Motorizado</label>

              <input
                type="checkbox"
                checked={currentItem.doble}
                onChange={(e) => handleItemChange("doble", e.target.checked)}
                className="ml-4"
              />
              <label className="ml-2">Doble</label>

              <input
                type="checkbox"
                checked={currentItem.cenefa}
                onChange={(e) => handleItemChange("cenefa", e.target.checked)}
                className="ml-4"
              />
              <label className="ml-2">Cenefa</label>

              <input
                type="checkbox"
                checked={currentItem.cadenaMetalica}
                onChange={(e) =>
                  handleItemChange("cadenaMetalica", e.target.checked)
                }
                className="ml-4"
              />
              <label className="ml-2">Cadena metálica</label>

              <select
                value={currentItem.colocacion}
                onChange={(e) => handleItemChange("colocacion", e.target.value)}
                className="border p-2 w-full mb-2"
              >
                <option value="oculta">Oculta</option>
                <option value="a_la_vista">A la vista</option>
              </select>

              <select
                value={currentItem.colorAnclaje}
                onChange={(e) =>
                  handleItemChange("colorAnclaje", e.target.value)
                }
                className="border p-2 w-full mb-2"
              >
                <option value="blanco">Blanco</option>
                <option value="negro">Negro</option>
                <option value="beige">Beige</option>
                <option value="gris">Gris</option>
              </select>

              <input
                type="number"
                placeholder="Ancho"
                value={currentItem.ancho}
                onChange={(e) => handleItemChange("ancho", e.target.value)}
                className="border p-2 w-full mb-2"
              />
              <input
                type="number"
                placeholder="Largo"
                value={currentItem.largo}
                onChange={(e) => handleItemChange("largo", e.target.value)}
                className="border p-2 w-full mb-2"
              />
              <p>Total Item: ${currentItem.total.toFixed(2)}</p>

              <button
                onClick={handleAddItem}
                className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
              >
                Guardar
              </button>
              <button
                onClick={handleCloseProductoModal}
                className="bg-red-500 text-white px-4 py-2 mt-4 ml-4 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cotizador;
