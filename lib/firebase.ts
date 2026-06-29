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
let _db: any;
let _rtdb: any;
let _auth: any;
let _googleProvider: any;
let _initPromise: Promise<void> | null = null;

async function initFirebase() {
  if (_initPromise) return _initPromise;
  _initPromise = (async () => {
    const [{ initializeApp, getApps, getApp }, { getFirestore }, { getDatabase }, { getAuth, GoogleAuthProvider }] =
      await Promise.all([
        import('firebase/app'),
        import('firebase/firestore'),
        import('firebase/database'),
        import('firebase/auth'),
      ]);
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    _app = app;
    _db = getFirestore(app);
    _rtdb = getDatabase(app);
    _auth = getAuth(app);
    _googleProvider = new GoogleAuthProvider();
  })();
  return _initPromise;
}

export function getDb() { return initFirebase().then(() => _db); }
export function getRtdb() { return initFirebase().then(() => _rtdb); }
export function getAuth() { return initFirebase().then(() => _auth); }
export function getGoogleProvider() { return initFirebase().then(() => _googleProvider); }
