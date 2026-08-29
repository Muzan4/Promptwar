import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let app: App;

if (!getApps().length) {
  try {
    if (process.env.FIREBASE_PRIVATE_KEY) {
      // Handle both escaped \n and actual newlines from .env parsing
      const formattedKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
      
      app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: formattedKey,
        }),
      });
    } else {
      // Fallback for Next.js static build time when env vars might be missing
      app = initializeApp({ projectId: 'demo-project' }); 
    }
  } catch (error) {
    console.error('Firebase admin init error:', error);
    // Absolute fallback to prevent build crash
    app = getApps()[0] || initializeApp({ projectId: 'demo-project' });
  }
} else {
  app = getApps()[0];
}

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
