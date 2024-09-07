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
  const [activeTab, setActiveTab] = useState("Productos");
  const [productos, setProductos] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingPrice, setEditingPrice] = useState("");

  // Estado de materiales, separado por producto
  const [materiales, setMateriales] = useState({});
  const [newMaterial, setNewMaterial] = useState({});

  // Función para obtener productos
  const fetchProductos = async () => {
    const productosCollection = await getDocs(collection(db, "productos"));
    const productosList = productosCollection.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setProductos(productosList);

    // Cargar subcolecciones de materiales por producto
    for (const producto of productosList) {
      const materialesCollection = await getDocs(
        collection(db, "productos", producto.id, "materiales")
      );
      setMateriales((prevState) => ({
        ...prevState,
        [producto.id]: materialesCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      }));
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Agregar producto
  const handleAddProduct = async () => {
    if (newItemName.trim() === "" || newItemPrice.trim() === "") return;
    await addDoc(collection(db, "productos"), {
      name: newItemName,
      price: parseFloat(newItemPrice),
    });
    setNewItemName("");
    setNewItemPrice("");
    fetchProductos(); // Refrescar la lista
  };

  // Editar producto
  const handleUpdateProduct = async (id) => {
    const productRef = doc(db, "productos", id);
    await updateDoc(productRef, {
      name: editingName,
      price: parseFloat(editingPrice),
    });
    setEditingItem(null);
    setEditingName("");
    setEditingPrice("");
    fetchProductos(); // Refrescar la lista
  };

  // Eliminar producto
  const handleDeleteProduct = async (id) => {
    const productRef = doc(db, "productos", id);
    await deleteDoc(productRef);
    fetchProductos(); // Refrescar la lista
  };

  // Agregar material a un producto
  const handleAddMaterial = async (productId) => {
    if (newMaterial[productId]?.trim() === "") return;

    await addDoc(collection(db, "productos", productId, "materiales"), {
      name: newMaterial[productId],
    });

    setNewMaterial((prevState) => ({
      ...prevState,
      [productId]: "", // Limpiar el campo de material
    }));

    fetchProductos(); // Recargar la lista de productos con materiales
  };

  // Eliminar material
  const handleDeleteMaterial = async (productId, materialId) => {
    await deleteDoc(doc(db, "productos", productId, "materiales", materialId));
    fetchProductos(); // Recargar la lista de productos con materiales
  };

  // Manejar el cambio de entrada del material por producto
  const handleMaterialChange = (productId, value) => {
    setNewMaterial((prevState) => ({
      ...prevState,
      [productId]: value,
    }));
  };

  const renderSection = (title, items, collectionName, setter) => (
    <div className="mb-8">
      <h3 className="text-xl">{title}</h3>
      <div className="mb-4">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder={`Nombre de ${title.toLowerCase()}`}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          value={newItemPrice}
          onChange={(e) => setNewItemPrice(e.target.value)}
          placeholder="Precio"
          className="border p-2 mr-2"
        />
        <button
          onClick={handleAddProduct}
          className="bg-green-500 text-white p-2 rounded"
        >
          Agregar
        </button>
      </div>

      <div className="mt-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="mb-4"
          >
            {editingItem === item.id ? (
              <>
                {/* Modo edición de producto */}
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="border p-2 mr-2"
                />
                <input
                  type="number"
                  value={editingPrice}
                  onChange={(e) => setEditingPrice(e.target.value)}
                  className="border p-2 mr-2"
                />
                <button
                  onClick={() => handleUpdateProduct(item.id)}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditingItem(null)}
                  className="bg-gray-500 text-white p-2 ml-2 rounded"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                {/* Vista del producto */}
                <span>
                  {item.name} - ${item.price}
                </span>
                <button
                  onClick={() => {
                    setEditingItem(item.id);
                    setEditingName(item.name);
                    setEditingPrice(item.price);
                  }}
                  className="bg-yellow-500 text-white p-2 ml-2 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteProduct(item.id)}
                  className="bg-red-500 text-white p-2 ml-2 rounded"
                >
                  Eliminar
                </button>

                {/* Campo y botón para agregar material al producto */}
                <div className="mt-2">
                  <input
                    type="text"
                    value={newMaterial[item.id] || ""}
                    onChange={(e) =>
                      handleMaterialChange(item.id, e.target.value)
                    }
                    placeholder="Agregar material"
                    className="border p-2 mr-2"
                  />
                  <button
                    onClick={() => handleAddMaterial(item.id)}
                    className="bg-blue-500 text-white p-2 rounded"
                  >
                    Agregar Material
                  </button>
                </div>

                {/* Lista de materiales */}
                <div className="mt-2">
                  {materiales[item.id]?.map((material) => (
                    <div
                      key={material.id}
                      className="mt-2"
                    >
                      <span>{material.name}</span>
                      <button
                        onClick={() =>
                          handleDeleteMaterial(item.id, material.id)
                        }
                        className="bg-red-500 text-white p-2 ml-2 rounded"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <NavBar />
      <div className="p-6">
        <h2 className="text-2xl mb-4">Panel de Administración</h2>

        {/* Tabs */}
        <div className="mb-6">
          {["Productos"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`p-2 ${
                activeTab === tab ? "bg-gray-300" : "bg-gray-100"
              } hover:bg-gray-200 rounded mr-2`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Contenido del Tab */}
        {activeTab === "Productos" &&
          renderSection("Productos", productos, "productos", setProductos)}
      </div>
    </div>
  );
}

export default AdminPanel;
