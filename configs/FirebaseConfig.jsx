// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0TQXlZ5H50Gfidh6-FrtGLhuDwh9CGmY",
  authDomain: "kindheart-1a693.firebaseapp.com",
  projectId: "kindheart-1a693",
  storageBucket: "kindheart-1a693.appspot.com",
  messagingSenderId: "32553421109",
  appId: "1:32553421109:web:a37f31a7ff4d33c9fd247c",
  measurementId: "G-EHNNLJTHRE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)
//const analytics = getAnalytics(app);