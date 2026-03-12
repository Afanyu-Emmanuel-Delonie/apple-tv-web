import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyBOi1Ja8p58-E2c-wR0vs_SSt-VjuVV-SY',
  authDomain: 'apple-tv-d4927.firebaseapp.com',
  projectId: 'apple-tv-d4927',
  storageBucket: 'apple-tv-d4927.firebasestorage.app',
  messagingSenderId: '380540066854',
  appId: '1:380540066854:web:cd8b8a325e09291d749ae7',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
