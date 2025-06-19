import { boot } from 'quasar/wrappers';
import { initializeApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBwDtmt3gMHC-XkKEoN5KBvXIyUaN1ysYk',
  authDomain: 'furlog.firebaseapp.com',
  projectId: 'furlog',
  storageBucket: 'furlog.appspot.com',
  messagingSenderId: '752027687102',
  appId: '1:752027687102:web:5efd0498894b9d389326ef',
  measurementId: 'G-JPBR8L6QNX',
};

let firebaseApp: FirebaseApp;
let auth: ReturnType<typeof getAuth>;
let db: ReturnType<typeof getFirestore>;
let analytics;

export default boot(({ app }) => {
  firebaseApp = initializeApp(firebaseConfig);
  auth = getAuth(firebaseApp);
  db = getFirestore(firebaseApp);
  app.config.globalProperties.$firebase = firebaseApp;
  app.config.globalProperties.$auth = auth;
  app.config.globalProperties.$db = db;

  if (typeof window !== 'undefined') {
    void import('firebase/analytics').then(({ getAnalytics }) => {
      analytics = getAnalytics(firebaseApp);
    });
  }
});

export { firebaseApp, auth, db, analytics };
