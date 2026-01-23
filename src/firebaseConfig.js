import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCdcj_56EdygidWa8pQm17fegnF39XB8Xg",
  authDomain: "taipan-680b2.firebaseapp.com",
  projectId: "taipan-680b2",
  storageBucket: "taipan-680b2.firebasestorage.app",
  messagingSenderId: "990538734233",
  appId: "1:990538734233:web:dbfe47aed6d87626207608",
  measurementId: "G-QFJTFTCNNY"
};

// Инициализация
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
