import { db } from './firebase';

// Admin default credentials
export const DEFAULT_ADMIN = {
    email: 'admin@volunteer.com',
    password: 'admin123',
    name: 'Admin Volunteer'
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
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        const snapshot = await db.collection('admins')
            .where('email', '==', trimmedEmail)
            .where('password', '==', trimmedPassword)
            .get();

        if (!snapshot.empty) {
            const adminDoc = snapshot.docs[0];
            return {
                id: adminDoc.id,
                ...adminDoc.data()
            };
        }
        // Tambahkan log untuk debugging
        console.log('Login gagal. Email atau password salah.', { email: trimmedEmail, password: trimmedPassword });
        return null;
    } catch (error) {
        console.error('Error verifying admin login:', error);
        return null;
    }
} 