import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔑 Tvoja konfiguracija (kopiraš iz Firebase konzole)
const firebaseConfig = {
  apiKey: "AIzaSyBy5uMmMxMzqTW6qzFwuRyEjpAXqvs5I4M",
  authDomain: "auction-house-9dbf2.firebaseapp.com",
  projectId: "auction-house-9dbf2",
  storageBucket: "auction-house-9dbf2.firebasestorage.app",
  messagingSenderId: "948639571128",
  appId: "1:948639571128:web:bde052e81eff112743684d"
};

// 🔥 Inicijalizacija Firebase-a
const app = initializeApp(firebaseConfig);

// 📦 Inicijalizacija servisa
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;