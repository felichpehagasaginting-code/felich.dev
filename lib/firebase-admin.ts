import { getApps, initializeApp, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let _adminDb: Firestore | null | undefined;

/**
 * Lazy Firebase Admin SDK initialisation (server-only).
 * Bypasses Firestore security rules — used by API routes that validate
 * and rate-limit requests themselves.
 *
 * Returns `null` when the service-account env vars are not configured,
 * so routes can fall back to the client SDK path.
 */
export function getAdminDb(): Firestore | null {
  if (_adminDb !== undefined) return _adminDb;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    _adminDb = null;
    return null;
  }

  try {
    let app: App;
    if (getApps().length) {
      app = getApps()[0];
    } else {
      app = initializeApp(
        {
          credential: cert({
            projectId,
            clientEmail,
            privateKey: privateKey.replace(/\\n/g, '\n'),
          }),
        },
        'admin'
      );
    }
    _adminDb = getFirestore(app);
  } catch (err) {
    console.error('Firebase Admin init error:', err);
    _adminDb = null;
  }
  return _adminDb;
}