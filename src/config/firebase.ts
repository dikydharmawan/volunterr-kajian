import * as admin from 'firebase-admin';
import path from 'path';

// Path ke file service account
const serviceAccountPath = path.join(__dirname, '../../pendaftaran-volunterr-firebase-adminsdk-fbsvc-bc2cea7c02.json');

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
export const auth = admin.auth();
export default admin; 