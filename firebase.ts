import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  setDoc,
  deleteDoc, 
  doc, 
  updateDoc, 
  query, 
  orderBy,
  onSnapshot
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB875pN8_OH7gPKgMigegT2sRHQUjSZXuQ",
  authDomain: "plataforma-colaborativa-sp.firebaseapp.com",
  projectId: "plataforma-colaborativa-sp",
  storageBucket: "plataforma-colaborativa-sp.firebasestorage.app",
  messagingSenderId: "286599278752",
  appId: "1:286599278752:web:383fd5e3844bca311c19c5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { 
  db,
  storage,
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  setDoc,
  deleteDoc, 
  doc, 
  updateDoc, 
  query, 
  orderBy,
  onSnapshot,
  ref,
  uploadBytes,
  getDownloadURL
};