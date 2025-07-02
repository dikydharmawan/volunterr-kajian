import { db } from './firebase';

// Admin default credentials
export const DEFAULT_ADMIN = {
    email: 'admin@volunteer.com',
    password: 'admin123',
    name: 'Administrator'
};

// Fungsi untuk membuat admin default jika belum ada
export async function createDefaultAdmin() {
    try {
        // Cek apakah admin default sudah ada
        const snapshot = await db.collection('admins')
            .where('email', '==', DEFAULT_ADMIN.email)
            .get();

        if (snapshot.empty) {
            // Buat admin default
            await db.collection('admins').add({
                ...DEFAULT_ADMIN,
                createdAt: new Date(),
                role: 'admin',
                isDefault: true
            });
            console.log('Admin default berhasil dibuat');
        } else {
            console.log('Admin default sudah ada');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
}

// Fungsi untuk verifikasi login admin
export async function verifyAdminLogin(email: string, password: string) {
    try {
        const snapshot = await db.collection('admins')
            .where('email', '==', email)
            .where('password', '==', password)
            .get();

        if (!snapshot.empty) {
            const adminDoc = snapshot.docs[0];
            return {
                id: adminDoc.id,
                ...adminDoc.data()
            };
        }
        return null;
    } catch (error) {
        console.error('Error verifying admin login:', error);
        return null;
    }
} 