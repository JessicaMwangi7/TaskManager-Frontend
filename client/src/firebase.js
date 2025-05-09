// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDteVY3T1leyFluPe3KH1x0yAJxt8T5PFg",
  authDomain: "task-flow-app-01.firebaseapp.com",
  databaseURL: "https://task-flow-app-01-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "task-flow-app-01",
  storageBucket: "task-flow-app-01.firebasestorage.app",
  messagingSenderId: "938054174691",
  appId: "1:938054174691:web:8f245ba0e03bbf550782d6",
  measurementId: "G-LRH8STYWWM"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, push, onValue };
