import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ⚠️ IMPORTANT: Replace the values below with your specific config from the Firebase Console
// Go to Project Settings > General > Your apps > SDK setup and configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwrPy_SY8TJ0uJtuuONybd_ow5kP2tr7k",
  authDomain: "hsmarket-98217.firebaseapp.com",
  projectId: "hsmarket-98217",
  storageBucket: "hsmarket-98217.appspot.com",
  messagingSenderId: "94474594812",
  appId: "1:94474594812:web:56f5fc7065ee5e49346a79",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage
export const storage = getStorage(app);