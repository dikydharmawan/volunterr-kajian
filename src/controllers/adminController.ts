import { Request, Response } from 'express';

export async function loginAdmin(req: Request, res: Response) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username dan password wajib diisi' });
        }
        if (username === 'admin_volunteer' && password === 'adminimam2025') {
            return res.json({
                success: true,
                message: 'Login berhasil',
                admin: { username: 'admin_volunteer' },
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

export async function initializeAdmin(req: Request, res: Response) {
    res.json({ message: 'Fitur tidak tersedia. Admin sudah hardcode.' });
}
