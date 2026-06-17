import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import {
  Auth,
  getAuth,
  // @ts-ignore - available at runtime in React Native builds
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';
import {
  Firestore,
  getFirestore,
  initializeFirestore,
} from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA-Qo06AnGXQtJqquGMIDF8sIYc7kSDryE',
  authDomain: 'seniorease-mobile.firebaseapp.com',
  projectId: 'seniorease-mobile',
  storageBucket: 'seniorease-mobile.firebasestorage.app',
  messagingSenderId: '331452744246',
  appId: '1:331452744246:web:d24456cb1dfe9ffd4f4e97',
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });

  // React Native / Expo often needs long polling for Firestore stability.
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
} else {
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
}

storage = getStorage(app);

export { app, auth, db, storage };
