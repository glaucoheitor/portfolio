// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtw2ynC9se54_ZQO6RgkFQ8eGbfdYoVWk",
  authDomain: "stocks.glaucoheitor.com",
  projectId: "stocks-glauco",
  storageBucket: "stocks-glauco.appspot.com",
  messagingSenderId: "330681151574",
  appId: "1:330681151574:web:8d9af3a6ce95c868e7cbf7",
  measurementId: "G-MJ53CTC7J8",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseDB = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
