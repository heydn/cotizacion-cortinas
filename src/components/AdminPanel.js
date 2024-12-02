// src/components/AdminPanel.js
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import NavBar from "./NavBar";

function AdminPanel() {
  const [productos, setProductos] = useState([]);
  const [materiales, setMateriales] = useState({});
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingPrice, setEditingPrice] = useState("");

  const [newMaterialName, setNewMaterialName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");

  // Obtener productos y materiales desde Firestore
  const fetchProductos = async () => {
    const productosRef = await getDocs(collection(db, "productos"));
    const productosList = productosRef.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProductos(productosList);

    // Obtener materiales para cada producto
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

  useEffect(() => {
    fetchProductos();
  }, []);

  // Agregar un nuevo producto
  const handleAddProduct = async () => {
    if (!newProductName.trim() || !newProductPrice.trim()) return;
    const newProduct = await addDoc(collection(db, "productos"), {
      name: newProductName,
      price: parseFloat(newProductPrice),
    });
    setNewProductName("");
    setNewProductPrice("");
    fetchProductos(); // Actualizar la lista de productos
  };

  // Actualizar un producto
  const handleUpdateProduct = async (id) => {
    const productRef = doc(db, "productos", id);
    await updateDoc(productRef, {
      name: editingName,
      price: parseFloat(editingPrice),
    });
    setEditingProduct(null);
    setEditingName("");
    setEditingPrice("");
    fetchProductos();
  };

  // Eliminar un producto
  const handleDeleteProduct = async (id) => {
    const productRef = doc(db, "productos", id);
    await deleteDoc(productRef);
    fetchProductos();
  };

  // Agregar un material a un producto
  const handleAddMaterial = async () => {
    if (!newMaterialName.trim() || !selectedProductId) return;
    await addDoc(collection(db, "productos", selectedProductId, "materiales"), {
      name: newMaterialName,
    });
    setNewMaterialName("");
    setSelectedProductId("");
    fetchProductos();
  };

  return (
    <div>
      {/* <NavBar /> */}
      <div className="p-6">
        <h2 className="text-2xl mb-4">Panel de Administración</h2>

        {/* Formulario para agregar un producto */}
        <div className="mb-6">
          <h3 className="text-xl mb-2">Agregar Producto</h3>
          <input
            type="text"
            placeholder="Nombre del Producto"
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
            className="border p-2 mr-2"
          />
          <input
            type="number"
            placeholder="Precio"
            value={newProductPrice}
            onChange={(e) => setNewProductPrice(e.target.value)}
            className="border p-2 mr-2"
          />
          <button
            onClick={handleAddProduct}
            className="bg-green-500 text-white p-2 rounded"
          >
            Agregar Producto
          </button>
        </div>

        {/* Tabla responsiva para productos */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2">Nombre</th>
                <th className="border px-4 py-2">Precio</th>
                <th className="border px-4 py-2">Materiales</th>
                <th className="border px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td className="border px-4 py-2">
                    {editingProduct === producto.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="border p-2"
                      />
                    ) : (
                      producto.name
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editingProduct === producto.id ? (
                      <input
                        type="number"
                        value={editingPrice}
                        onChange={(e) => setEditingPrice(e.target.value)}
                        className="border p-2"
                      />
                    ) : (
                      `$${producto.price.toFixed(2)}`
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    <ul>
                      {materiales[producto.id]?.map((material) => (
                        <li key={material.id}>{material.name}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="border px-4 py-2">
                    {editingProduct === producto.id ? (
                      <button
                        onClick={() => handleUpdateProduct(producto.id)}
                        className="bg-blue-500 text-white p-2 rounded"
                      >
                        Guardar
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingProduct(producto.id);
                          setEditingName(producto.name);
                          setEditingPrice(producto.price);
                        }}
                        className="bg-yellow-500 text-white p-2 mr-2 rounded"
                      >
                        Editar
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteProduct(producto.id)}
                      className="bg-red-500 text-white p-2 rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Formulario para agregar material */}
        <div className="mt-6">
          <h3 className="text-xl mb-2">Agregar Material a Producto</h3>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="border p-2 mr-2"
          >
            <option value="">Seleccionar Producto</option>
            {productos.map((producto) => (
              <option
                key={producto.id}
                value={producto.id}
              >
                {producto.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Nombre del Material"
            value={newMaterialName}
            onChange={(e) => setNewMaterialName(e.target.value)}
            className="border p-2 mr-2"
          />
          <button
            onClick={handleAddMaterial}
            className="bg-green-500 text-white p-2 rounded"
          >
            Agregar Material
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
