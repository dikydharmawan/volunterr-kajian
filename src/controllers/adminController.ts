import { Request, Response, Application } from 'express';
import { db } from '../config/firebase';
import { verifyAdminLogin, createDefaultAdmin } from '../config/adminAuth';

class AdminController {
    private collectionName = 'admins';

    async createAdmin(name: string, email: string, password: string) {
        try {
            const newAdmin = {
                name,
                email,
                password, // Dalam produksi, password harus di-hash
                createdAt: new Date(),
                role: 'admin'
            };

            const docRef = await db.collection(this.collectionName).add(newAdmin);
            return { id: docRef.id, ...newAdmin };
        } catch (error) {
            console.error('Error creating admin:', error);
            throw error;
        }
    }

    async getAdmin(id: string) {
        try {
            const doc = await db.collection(this.collectionName).doc(id).get();
            if (doc.exists) {
                return { id: doc.id, ...doc.data() };
            }
            return null;
        } catch (error) {
            console.error('Error getting admin:', error);
            throw error;
        }
    }

    async updateAdmin(id: string, name?: string, email?: string) {
        try {
            const updateData: any = { updatedAt: new Date() };
            if (name) updateData.name = name;
            if (email) updateData.email = email;

            await db.collection(this.collectionName).doc(id).update(updateData);
            return await this.getAdmin(id);
        } catch (error) {
            console.error('Error updating admin:', error);
            throw error;
        }
    }

    async deleteAdmin(id: string) {
        try {
            await db.collection(this.collectionName).doc(id).delete();
            return true;
        } catch (error) {
            console.error('Error deleting admin:', error);
            throw error;
        }
    }

    async getAllVolunteers() {
        try {
            const snapshot = await db.collection('volunteers').get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting all volunteers:', error);
            throw error;
        }
    }

    async getVolunteerById(id: string) {
        try {
            const doc = await db.collection('volunteers').doc(id).get();
            if (doc.exists) {
                return { id: doc.id, ...doc.data() };
            }
            return null;
        } catch (error) {
            console.error('Error getting volunteer:', error);
            throw error;
        }
    }

    async updateVolunteerStatus(id: string, status: string) {
        try {
            await db.collection('volunteers').doc(id).update({
                status,
                updatedAt: new Date()
            });
            return await this.getVolunteerById(id);
        } catch (error) {
            console.error('Error updating volunteer status:', error);
            throw error;
        }
    }
}

export default AdminController;

export async function createAdmin(req: Request, res: Response) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username dan password wajib diisi' });
        }
        if (username === 'admin_volunteer' && password === 'adminimam2025') {
            res.json({
                success: true,
                message: 'Login berhasil',
                admin: { username: 'admin_volunteer' },
                token: 'admin-token-' + Date.now()
            });
        } else {
            res.status(401).json({ message: 'Username atau password salah' });
        }
    } catch (error) {
        console.error('Error logging in admin:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat login' });
    }
}


export async function updateAdmin(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        const adminController = new AdminController();
        const updatedAdmin = await adminController.updateAdmin(id, name, email);
        
        if (updatedAdmin) {
            res.json({ message: 'Admin berhasil diperbarui', admin: updatedAdmin });
        } else {
            res.status(404).json({ message: 'Admin tidak ditemukan' });
        }
    } catch (error) {
        console.error('Error updating admin:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui admin' });
    }
}

export async function getAllVolunteers(req: Request, res: Response) {
    try {
        const adminController = new AdminController();
        const volunteers = await adminController.getAllVolunteers();
        res.json(volunteers);
    } catch (error) {
        console.error('Error getting volunteers:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data relawan' });
    }
}

export async function updateVolunteerStatus(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status wajib diisi' });
        }

        const adminController = new AdminController();
        const updatedVolunteer = await adminController.updateVolunteerStatus(id, status);
        
        if (updatedVolunteer) {
            res.json({ message: 'Status relawan berhasil diperbarui', volunteer: updatedVolunteer });
        } else {
            res.status(404).json({ message: 'Relawan tidak ditemukan' });
        }
    } catch (error) {
        console.error('Error updating volunteer status:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui status relawan' });
    }
}

export async function loginAdmin(req: Request, res: Response) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username dan password wajib diisi' });
        }
        if (username === 'admin_volunteer' && password === 'adminimam2025') {
            res.json({
                success: true,
                message: 'Login berhasil',
                admin: { username: 'admin_volunteer' },
                token: 'admin-token-' + Date.now()
            });
        } else {
            res.status(401).json({ message: 'Username atau password salah' });
        }
    } catch (error) {
        console.error('Error logging in admin:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat login' });
    }
}

export async function initializeAdmin(req: Request, res: Response) {
    try {
        await createDefaultAdmin();
        res.json({ message: 'Admin default berhasil dibuat atau sudah ada' });
    } catch (error) {
        console.error('Error initializing admin:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat membuat admin default' });
    }
}