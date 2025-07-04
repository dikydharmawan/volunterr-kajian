import { Request, Response } from 'express';
import { db } from '../config/firebase';
import fs from 'fs';
import path from 'path';

export async function loginAdmin(req: Request, res: Response) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username dan password wajib diisi' });
        }
        const adminSnap = await db.collection('admins')
            .where('username', '==', username)
            .where('password', '==', password)
            .get();
        if (!adminSnap.empty) {
            const adminData = adminSnap.docs[0].data();
            return res.json({
                success: true,
                message: 'Login berhasil',
                admin: { username: adminData.username, email: adminData.email },
                token: 'admin-token-' + Date.now()
            });
        } else {
            return res.status(401).json({ message: 'Username atau password salah' });
        }
    } catch (error) {
        console.error('Error logging in admin:', error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat login' });
    }
}

export async function addAdmin(req: Request, res: Response) {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return res.status(400).json({ message: 'Semua field wajib diisi' });
        }
        // Cek apakah username sudah ada
        const existing = await db.collection('admins').where('username', '==', username).get();
        if (!existing.empty) {
            return res.status(409).json({ message: 'Username sudah terdaftar' });
        }
        await db.collection('admins').add({ username, password, email });
        // Simpan ke file JSON lokal
        const filePath = path.join(__dirname, '../../admins.json');
        let admins = [];
        if (fs.existsSync(filePath)) {
            admins = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        admins.push({ username, password, email });
        fs.writeFileSync(filePath, JSON.stringify(admins, null, 2));
        return res.json({ success: true, message: 'Admin berhasil ditambahkan' });
    } catch (error) {
        console.error('Error adding admin:', error);
        return res.status(500).json({ message: 'Gagal menambah admin' });
    }
}

export async function initializeAdmin(req: Request, res: Response) {
    res.json({ message: 'Fitur tidak tersedia. Admin sudah hardcode.' });
}

export async function replaceAdmin(req: Request, res: Response) {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return res.status(400).json({ message: 'Semua field wajib diisi' });
        }
        // Hapus semua admin lama
        const adminsSnap = await db.collection('admins').get();
        const batch = db.batch();
        adminsSnap.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        // Tambah admin baru
        await db.collection('admins').add({ username, password, email });
        // Update file JSON lokal
        const filePath = path.join(__dirname, '../../admins.json');
        const admins = [{ username, password, email }];
        fs.writeFileSync(filePath, JSON.stringify(admins, null, 2));
        return res.json({ success: true, message: 'Admin berhasil diganti' });
    } catch (error) {
        console.error('Error replacing admin:', error);
        return res.status(500).json({ message: 'Gagal mengganti admin' });
    }
}
