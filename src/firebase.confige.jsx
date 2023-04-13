// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCi2gacJWpr438U3nD5yyrxwEAj2AogjSI",
  authDomain: "facebook-clone-a2891.firebaseapp.com",
  projectId: "facebook-clone-a2891",
  storageBucket: "facebook-clone-a2891.appspot.com",
  messagingSenderId: "449995755578",
  appId: "1:449995755578:web:6f345139f8642565eba503",
};

// Initialize Firebase
const app = initializeApp( firebaseConfig );
export const auth = getAuth(app);
export const storage = getStorage( app );
export const db = getFirestore(app);
