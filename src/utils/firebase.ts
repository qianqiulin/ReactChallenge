// src/utils/firebase.ts
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User
} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAuqNVFkC7hEmqc7hIdzagaaZZG03VTOg8",
  authDomain: "peterreact-93f6f.firebaseapp.com",
  databaseURL: "https://peterreact-93f6f-default-rtdb.firebaseio.com", // ensure this is present
  projectId: "peterreact-93f6f",
  storageBucket: "peterreact-93f6f.firebasestorage.app",
  messagingSenderId: "746915374378",
  appId: "1:746915374378:web:b8a6cce0e2b070bc5daa53",
  measurementId: "G-Y30JGFS6RC"
};

export const app: FirebaseApp = initializeApp(firebaseConfig);
export const db: Database = getDatabase(app);
export default app;

// Authentication
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<User> {
  const res = await signInWithPopup(auth, provider);
  return res.user;
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

// Re-export onAuthStateChanged for subscribers
export { onAuthStateChanged, type User };