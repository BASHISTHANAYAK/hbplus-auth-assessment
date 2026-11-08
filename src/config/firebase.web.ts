import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

export const isFirestoreEnabled = Boolean(
  isFirebaseConfigured &&
  (process.env.EXPO_PUBLIC_ENABLE_FIRESTORE === 'true' ||
   process.env.EXPO_PUBLIC_FIRESTORE_ENABLED === 'true')
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);

    if (isFirestoreEnabled) {
      try {
        db = getFirestore(app);
      } catch (firestoreError) {
        console.warn('[Firebase Web] Firestore initialization error:', firestoreError);
      }
    }
  } catch (error) {
    console.warn('[Firebase Web] Initialization error:', error);
  }
}

export { app, auth, db };
