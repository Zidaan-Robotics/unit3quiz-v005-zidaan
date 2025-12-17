// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7OVwMBsTQQsowKMs3sCBa0xmcv_U3hqw",
  authDomain: "zidaanquiz3.firebaseapp.com",
  projectId: "zidaanquiz3",
  storageBucket: "zidaanquiz3.firebasestorage.app",
  messagingSenderId: "177378994358",
  appId: "1:177378994358:web:1faacc50a7410e5d1fde17",
  measurementId: "G-QQ40Z4078E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;

