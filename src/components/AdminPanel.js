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
  const [materiales, setMateriales] = useState([]);
  const [tubos, setTubos] = useState([]);
  const [kits, setKits] = useState([]);
  const [mandos, setMandos] = useState([]);

  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingPrice, setEditingPrice] = useState("");

  // Función para obtener datos desde Firestore
  const fetchData = async (collectionName, setter) => {
    const collectionRef = await getDocs(collection(db, collectionName));
    setter(collectionRef.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchData("productos", setProductos);
    fetchData("materiales", setMateriales);
    fetchData("tubos", setTubos);
    fetchData("kits", setKits);
    fetchData("mandos", setMandos);
  }, []);

  // Agregar nuevo item a la colección especificada
  const handleAddItem = async (
    collectionName,
    newItemName,
    newItemPrice,
    setter
  ) => {
    if (newItemName.trim() === "" || newItemPrice.trim() === "") return;
    await addDoc(collection(db, collectionName), {
      name: newItemName,
      price: parseFloat(newItemPrice),
    });
    setNewItemName("");
    setNewItemPrice("");
    fetchData(collectionName, setter); // Recargar datos después de agregar
  };

  // Modificar item en la colección especificada
  const handleUpdateItem = async (collectionName, id, setter) => {
    const itemRef = doc(db, collectionName, id);
    await updateDoc(itemRef, {
      name: editingName,
      price: parseFloat(editingPrice),
    });
    setEditingItem(null);
    setEditingName("");
    setEditingPrice("");
    fetchData(collectionName, setter); // Recargar datos después de modificar
  };

  // Eliminar item de la colección especificada
  const handleDeleteItem = async (collectionName, id, setter) => {
    const itemRef = doc(db, collectionName, id);
    await deleteDoc(itemRef);
    fetchData(collectionName, setter); // Recargar datos después de eliminar
  };

  // Reutilizable para cada sección (Productos, Materiales, etc.)
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
          onClick={() =>
            handleAddItem(collectionName, newItemName, newItemPrice, setter)
          }
          className="bg-green-500 text-white p-2 rounded"
        >
          Agregar
        </button>
      </div>

      <div className="mt-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="mb-2"
          >
            {editingItem === item.id ? (
              <>
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
                  onClick={() =>
                    handleUpdateItem(collectionName, item.id, setter)
                  }
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Guardar
                </button>
              </>
            ) : (
              <>
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
                  onClick={() =>
                    handleDeleteItem(collectionName, item.id, setter)
                  }
                  className="bg-red-500 text-white p-2 ml-2 rounded"
                >
                  Eliminar
                </button>
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
          {["Productos", "Materiales", "Tubos", "Kits", "Mandos"].map((tab) => (
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

        {/* Contenido de los Tabs */}
        {activeTab === "Productos" &&
          renderSection("Productos", productos, "productos", setProductos)}
        {activeTab === "Materiales" &&
          renderSection("Materiales", materiales, "materiales", setMateriales)}
        {activeTab === "Tubos" &&
          renderSection("Tubos", tubos, "tubos", setTubos)}
        {activeTab === "Kits" && renderSection("Kits", kits, "kits", setKits)}
        {activeTab === "Mandos" &&
          renderSection("Mandos", mandos, "mandos", setMandos)}
      </div>
    </div>
  );
}

export default AdminPanel;
