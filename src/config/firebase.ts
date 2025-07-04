import admin from 'firebase-admin';
import path from 'path';

const serviceAccount = require(path.join(__dirname, '../../firebase-key.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export const db = admin.firestore();
export const firestore = db;
export const auth = admin.auth();

export default admin;
