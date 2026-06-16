import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth/react-native';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyA-Qo06AnGXQtJqquGMIDF8sIYc7kSDryE",
  authDomain: "seniorease-mobile.firebaseapp.com",
  projectId: "seniorease-mobile",
  storageBucket: "seniorease-mobile.firebasestorage.app",
  messagingSenderId: "331452744246",
  appId: "1:331452744246:web:d24456cb1dfe9ffd4f4e97"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with AsyncStorage persistence
export const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Cloud Firestore
export const db = getFirestore(firebaseApp);
