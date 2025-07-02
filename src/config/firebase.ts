import * as admin from 'firebase-admin';
import path from 'path';

// Path ke file service account
const serviceAccountPath = 'D:/Coba/volunter/volunteer-management-app/firebase-key.json';

// Inisialisasi Firebase Admin SDK
const serviceAccount = require(serviceAccountPath);

// Cek apakah Firebase sudah diinisialisasi
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://pendaftaran-volunterr-default-rtdb.firebaseio.com'
  });
}

// Export instance Firebase Admin
export const db = admin.firestore();
export const firestore = admin.firestore();
export const auth = admin.auth();
export default admin; 