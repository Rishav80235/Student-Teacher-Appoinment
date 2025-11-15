// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getDatabase } from 'firebase/database'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA8LO26ccMKFH318ujuxhVECYLwHwMCXl4',
  authDomain: 'studebt-teacher-appoinment.firebaseapp.com',
  databaseURL: 'https://studebt-teacher-appoinment-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'studebt-teacher-appoinment',
  storageBucket: 'studebt-teacher-appoinment.firebasestorage.app',
  messagingSenderId: '178435462336',
  appId: '1:178435462336:web:99c78b646acbfa3c65c925',
  measurementId: 'G-V2DEPJ8S45'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
// Analytics should only be initialized in the browser
let analytics = null
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app)
}

const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)
const database = getDatabase(app)

export { app, analytics, auth, db, storage, database }
