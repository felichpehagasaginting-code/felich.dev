const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 'https://demo-project-default-rtdb.firebaseio.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-project.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-ABCDEF',
};

let _app: any;
let _appPromise: Promise<any> | null = null;
let _db: any;
let _dbPromise: Promise<any> | null = null;
let _rtdb: any;
let _rtdbPromise: Promise<any> | null = null;
let _auth: any;
let _authPromise: Promise<any> | null = null;
let _googleProvider: any;

async function getAppInstance() {
  if (_app) return _app;
  if (!_appPromise) {
    _appPromise = (async () => {
      const { initializeApp, getApps, getApp } = await import('firebase/app');
      _app = getApps().length ? getApp() : initializeApp(firebaseConfig);
      return _app;
    })();
  }
  return _appPromise;
}

export async function getDb() {
  if (_db) return _db;
  if (!_dbPromise) {
    _dbPromise = (async () => {
      const app = await getAppInstance();
      const { getFirestore } = await import('firebase/firestore');
      _db = getFirestore(app);
      return _db;
    })();
  }
  return _dbPromise;
}

export async function getRtdb() {
  if (_rtdb) return _rtdb;
  if (!_rtdbPromise) {
    _rtdbPromise = (async () => {
      const app = await getAppInstance();
      const { getDatabase } = await import('firebase/database');
      _rtdb = getDatabase(app);
      return _rtdb;
    })();
  }
  return _rtdbPromise;
}

export async function getAuth() {
  if (_auth) return _auth;
  if (!_authPromise) {
    _authPromise = (async () => {
      const app = await getAppInstance();
      const { getAuth: getAuthSDK, GoogleAuthProvider } = await import('firebase/auth');
      _auth = getAuthSDK(app);
      _googleProvider = new GoogleAuthProvider();
      return _auth;
    })();
  }
  return _authPromise;
}

export async function getGoogleProvider() {
  if (_googleProvider) return _googleProvider;
  await getAuth();
  return _googleProvider;
}

