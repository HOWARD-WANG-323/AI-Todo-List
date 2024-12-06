// Import the functions you need from the SDKs you need
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2dRmQEAQrIzp7PrnAwc_9qpesgRwIVhc",
  authDomain: "ai-todo-list-15e6a.firebaseapp.com",
  projectId: "ai-todo-list-15e6a",
  storageBucket: "ai-todo-list-15e6a.firebasestorage.app",
  messagingSenderId: "261612951207",
  appId: "1:261612951207:web:b1869fed0083c8cd0ced82",
  measurementId: "G-DS5HKM33F7",
  databaseURL: "https://ai-todo-list-15e6a-default-rtdb.firebaseio.com/",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };