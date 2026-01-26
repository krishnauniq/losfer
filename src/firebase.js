import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBs-UGtLXB3Xr1wmM3QT3rA-h1VSM-cwqM",
  authDomain: "losfer-1b785.firebaseapp.com",
  projectId: "losfer-1b785",
  storageBucket: "losfer-1b785.firebasestorage.app",
  messagingSenderId: "36222500314",
  appId: "1:36222500314:web:cc352fcea399dfceded4e3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
