"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdmin = updateAdmin;
exports.getAllVolunteers = getAllVolunteers;
exports.updateVolunteerStatus = updateVolunteerStatus;
exports.loginAdmin = loginAdmin;
exports.initializeAdmin = initializeAdmin;
const firebase_1 = require("../config/firebase");
class AdminController {
    constructor() {
        this.collectionName = 'admins';
    }
    async getAdmin(id) {
        try {
            const doc = await firebase_1.db.collection(this.collectionName).doc(id).get();
            if (doc.exists) {
                return Object.assign({ id: doc.id }, doc.data());
            }
            return null;
        }
        catch (error) {
            console.error('Error getting admin:', error);
            throw error;
        }
    }
    async updateAdmin(id, name, email) {
        try {
            const updateData = { updatedAt: new Date() };
            if (name)
                updateData.name = name;
            if (email)
                updateData.email = email;
            await firebase_1.db.collection(this.collectionName).doc(id).update(updateData);
            return await this.getAdmin(id);
        }
        catch (error) {
            console.error('Error updating admin:', error);
            throw error;
        }
    }
    async deleteAdmin(id) {
        try {
            await firebase_1.db.collection(this.collectionName).doc(id).delete();
            return true;
        }
        catch (error) {
            console.error('Error deleting admin:', error);
            throw error;
        }
    }
    async getAllVolunteers() {
        try {
            const snapshot = await firebase_1.db.collection('volunteers').get();
            return snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        }
        catch (error) {
            console.error('Error getting all volunteers:', error);
            throw error;
        }
    }
    async getVolunteerById(id) {
        try {
            const doc = await firebase_1.db.collection('volunteers').doc(id).get();
            if (doc.exists) {
                return Object.assign({ id: doc.id }, doc.data());
            }
            return null;
        }
        catch (error) {
            console.error('Error getting volunteer:', error);
            throw error;
        }
    }
    async updateVolunteerStatus(id, status) {
        try {
            await firebase_1.db.collection('volunteers').doc(id).update({
                status,
                updatedAt: new Date()
            });
            return await this.getVolunteerById(id);
        }
        catch (error) {
            console.error('Error updating volunteer status:', error);
            throw error;
        }
    }
}
exports.default = AdminController;
async function updateAdmin(req, res) {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        const adminController = new AdminController();
        const updatedAdmin = await adminController.updateAdmin(id, name, email);
        if (updatedAdmin) {
            res.json({ message: 'Admin berhasil diperbarui', admin: updatedAdmin });
        }
        else {
            res.status(404).json({ message: 'Admin tidak ditemukan' });
        }
    }
    catch (error) {
        console.error('Error updating admin:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui admin' });
    }
}
async function getAllVolunteers(req, res) {
    try {
        const adminController = new AdminController();
        const volunteers = await adminController.getAllVolunteers();
        res.json(volunteers);
    }
    catch (error) {
        console.error('Error getting volunteers:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data relawan' });
    }
}
async function updateVolunteerStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: 'Status wajib diisi' });
        }
        const adminController = new AdminController();
        const updatedVolunteer = await adminController.updateVolunteerStatus(id, status);
        if (updatedVolunteer) {
            return res.json({ message: 'Status relawan berhasil diperbarui', volunteer: updatedVolunteer });
        }
        else {
            return res.status(404).json({ message: 'Relawan tidak ditemukan' });
        }
    }
    catch (error) {
        console.error('Error updating volunteer status:', error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui status relawan' });
    }
}
async function loginAdmin(req, res) {
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
        }
        else {
            return res.status(401).json({ message: 'Username atau password salah' });
        }
    }
    catch (error) {
        console.error('Error logging in admin:', error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat login' });
    }
}
async function initializeAdmin(req, res) {
    res.json({ message: 'Fitur tidak tersedia. Admin sudah hardcode.' });
}
//# sourceMappingURL=adminController.js.map