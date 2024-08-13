// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA18IEwg8YDa2xBUhe_-iPokPBaMUNnGoQ",
  authDomain: "cotizacion-cortinas.firebaseapp.com",
  projectId: "cotizacion-cortinas",
  storageBucket: "cotizacion-cortinas.appspot.com",
  messagingSenderId: "295276276691",
  appId: "1:295276276691:web:1d4fbc00268676b5eb5d26",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
