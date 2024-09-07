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
  const [items, setItems] = useState([]);
  const [totalCotizacion, setTotalCotizacion] = useState(0);

  // Función para obtener los productos desde Firestore
  const fetchProductos = async () => {
    const productosRef = await getDocs(collection(db, "productos"));
    setProductos(
      productosRef.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
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
    if (cotizacionesSnapshot.empty) {
      return 1;
    }
    const ultimoNumeroCotizacion =
      cotizacionesSnapshot.docs[0].data().numeroCotizacion;
    return ultimoNumeroCotizacion + 1;
  };

  // Manejar agregar nuevo item
  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: items.length + 1,
        localizacion: "",
        producto: null,
        material: null,
        motorizado: false,
        doble: false,
        cenefa: false,
        cadenaMetalica: false,
        colocacion: "oculta",
        colorAnclaje: "blanco",
        ancho: 0,
        largo: 0,
        total: 0,
      },
    ]);
  };

  // Manejar cambios en los items
  const handleItemChange = (id, field, value) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        item[field] = value;

        // Si se cambian ancho, largo o producto, recalculamos el total
        if (field === "ancho" || field === "largo" || field === "producto") {
          const productoSeleccionado = productos.find(
            (prod) => prod.id === item.producto
          );
          if (productoSeleccionado) {
            item.total =
              parseFloat(item.ancho) *
              parseFloat(item.largo) *
              parseFloat(productoSeleccionado.price);
          }
        }
      }
      return item;
    });
    setItems(updatedItems);

    // Recalcular el total de la cotización
    const total = updatedItems.reduce((acc, item) => acc + item.total, 0);
    setTotalCotizacion(total);
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

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Cotizador</h2>

      {/* Sección Datos del Cliente */}
      <div className="mb-6">
        <h3 className="text-xl">Datos del Cliente</h3>
        <input
          type="text"
          placeholder="Nombre del Proyecto"
          value={clienteData.nombreProyecto}
          onChange={(e) =>
            setClienteData({ ...clienteData, nombreProyecto: e.target.value })
          }
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Nombre del Cliente"
          value={clienteData.nombreCliente}
          onChange={(e) =>
            setClienteData({ ...clienteData, nombreCliente: e.target.value })
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
          placeholder="Correo electrónico"
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
            setClienteData({ ...clienteData, observacion: e.target.value })
          }
          className="border p-2 w-full mb-2"
        />
      </div>

      {/* Sección Cotización */}
      <div>
        <h3 className="text-xl mb-4">Cotización</h3>

        {items.map((item) => (
          <div
            key={item.id}
            className="mb-4 border p-4"
          >
            <h4 className="font-bold">Item {item.id}</h4>

            <input
              type="text"
              placeholder="Localización"
              value={item.localizacion}
              onChange={(e) =>
                handleItemChange(item.id, "localizacion", e.target.value)
              }
              className="border p-2 w-full mb-2"
            />

            <select
              value={item.producto}
              onChange={(e) =>
                handleItemChange(item.id, "producto", e.target.value)
              }
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

            {/* Checkbox y Selects para otras opciones */}
            <input
              type="checkbox"
              checked={item.motorizado}
              onChange={(e) =>
                handleItemChange(item.id, "motorizado", e.target.checked)
              }
            />
            <label> Motorizado </label>

            <input
              type="checkbox"
              checked={item.doble}
              onChange={(e) =>
                handleItemChange(item.id, "doble", e.target.checked)
              }
            />
            <label> Doble </label>

            <input
              type="checkbox"
              checked={item.cenefa}
              onChange={(e) =>
                handleItemChange(item.id, "cenefa", e.target.checked)
              }
            />
            <label> Cenefa </label>

            <input
              type="checkbox"
              checked={item.cadenaMetalica}
              onChange={(e) =>
                handleItemChange(item.id, "cadenaMetalica", e.target.checked)
              }
            />
            <label> Cadena metálica </label>

            <select
              value={item.colocacion}
              onChange={(e) =>
                handleItemChange(item.id, "colocacion", e.target.value)
              }
              className="border p-2 w-full mb-2"
            >
              <option value="oculta">Oculta</option>
              <option value="a_la_vista">A la vista</option>
            </select>

            <select
              value={item.colorAnclaje}
              onChange={(e) =>
                handleItemChange(item.id, "colorAnclaje", e.target.value)
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
              value={item.ancho}
              onChange={(e) =>
                handleItemChange(item.id, "ancho", e.target.value)
              }
              className="border p-2 w-full mb-2"
            />
            <input
              type="number"
              placeholder="Largo"
              value={item.largo}
              onChange={(e) =>
                handleItemChange(item.id, "largo", e.target.value)
              }
              className="border p-2 w-full mb-2"
            />
            <p>Total Item: ${item.total.toFixed(2)}</p>
          </div>
        ))}

        <button
          onClick={handleAddItem}
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
    </div>
  );
}

export default Cotizador;
