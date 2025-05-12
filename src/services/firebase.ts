// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getFunctions } from 'firebase/functions'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAbRunvAo-KY8hx0oWv4rC6NedGoT8rS9w',
  authDomain: 'boletin-automatizacion.firebaseapp.com',
  projectId: 'boletin-automatizacion',
  storageBucket: 'boletin-automatizacion.firebasestorage.app',
  messagingSenderId: '160642563243',
  appId: '1:160642563243:web:fa26ead2cc074401138bee',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)
export const functions = getFunctions(app)


