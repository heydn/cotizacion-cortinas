// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDazOIJdIkxpnfdndLxScDfaPrYEAOTMLw",
  authDomain: "cotizador2023-f241e.firebaseapp.com",
  projectId: "cotizador2023-f241e",
  storageBucket: "cotizador2023-f241e.firebasestorage.app",
  messagingSenderId: "837017709571",
  appId: "1:837017709571:web:0c7fad67b7af4088cb7236",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
