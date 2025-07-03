"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivisionController = void 0;
const firebase_1 = require("../config/firebase");
class DivisionController {
    constructor() {
        this.collectionName = 'divisions';
    }
    async createDivision(req, res) {
        try {
            const { name, description, quota, deadline, requirements } = req.body;
            // Validasi data
            if (!name || !description || !quota || !deadline) {
                res.status(400).json({ message: 'Nama, deskripsi, kuota, dan batas waktu wajib diisi' });
                return;
            }
            if (quota <= 0) {
                res.status(400).json({ message: 'Kuota harus lebih dari 0' });
                return;
            }
            const deadlineDate = new Date(deadline);
            if (deadlineDate <= new Date()) {
                res.status(400).json({ message: 'Batas waktu harus lebih dari waktu sekarang' });
                return;
            }
            const newDivision = {
                name,
                description,
                quota: parseInt(quota),
                currentRegistered: 0,
                deadline: deadlineDate,
                requirements: requirements || [],
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const docRef = await firebase_1.db.collection(this.collectionName).add(newDivision);
            const division = Object.assign({ id: docRef.id }, newDivision);
            res.status(201).json({ message: 'Divisi berhasil dibuat', division });
        }
        catch (error) {
            console.error('Error creating division:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat membuat divisi' });
        }
    }
    async getAllDivisions(req, res) {
        try {
            const snapshot = await firebase_1.db.collection(this.collectionName).get();
            const divisions = snapshot.docs.map(doc => {
                var _a, _b, _c;
                const data = doc.data();
                if (!data)
                    return null;
                return Object.assign(Object.assign({ id: doc.id }, data), { deadline: ((_a = data.deadline) === null || _a === void 0 ? void 0 : _a.toDate) ? data.deadline.toDate() : data.deadline, createdAt: ((_b = data.createdAt) === null || _b === void 0 ? void 0 : _b.toDate) ? data.createdAt.toDate() : data.createdAt, updatedAt: ((_c = data.updatedAt) === null || _c === void 0 ? void 0 : _c.toDate) ? data.updatedAt.toDate() : data.updatedAt });
            }).filter(Boolean);
            res.status(200).json(divisions);
        }
        catch (error) {
            console.error('Error getting divisions:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data divisi' });
        }
    }
    async getActiveDivisions(req, res) {
        try {
            const snapshot = await firebase_1.db.collection(this.collectionName)
                .where('isActive', '==', true)
                .get();
            const divisions = snapshot.docs.map(doc => {
                var _a, _b, _c;
                const data = doc.data();
                if (!data)
                    return null;
                const deadline = ((_a = data.deadline) === null || _a === void 0 ? void 0 : _a.toDate) ? data.deadline.toDate() : data.deadline;
                const isExpired = new Date() > deadline;
                const isFull = data.currentRegistered >= data.quota;
                return Object.assign(Object.assign({ id: doc.id }, data), { deadline: deadline, createdAt: ((_b = data.createdAt) === null || _b === void 0 ? void 0 : _b.toDate) ? data.createdAt.toDate() : data.createdAt, updatedAt: ((_c = data.updatedAt) === null || _c === void 0 ? void 0 : _c.toDate) ? data.updatedAt.toDate() : data.updatedAt, isExpired,
                    isFull, isOpenForRegistration: data.isActive && !isFull && !isExpired, remainingQuota: Math.max(0, data.quota - data.currentRegistered) });
            }).filter(Boolean);
            res.status(200).json(divisions);
        }
        catch (error) {
            console.error('Error getting active divisions:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data divisi aktif' });
        }
    }
    async getDivision(req, res) {
        var _a, _b, _c;
        try {
            const { id } = req.params;
            const doc = await firebase_1.db.collection(this.collectionName).doc(id).get();
            if (doc.exists) {
                const data = doc.data();
                if (!data) {
                    res.status(404).json({ message: 'Data divisi tidak valid' });
                    return;
                }
                const division = Object.assign(Object.assign({ id: doc.id }, data), { deadline: ((_a = data.deadline) === null || _a === void 0 ? void 0 : _a.toDate) ? data.deadline.toDate() : data.deadline, createdAt: ((_b = data.createdAt) === null || _b === void 0 ? void 0 : _b.toDate) ? data.createdAt.toDate() : data.createdAt, updatedAt: ((_c = data.updatedAt) === null || _c === void 0 ? void 0 : _c.toDate) ? data.updatedAt.toDate() : data.updatedAt });
                res.status(200).json(division);
            }
            else {
                res.status(404).json({ message: 'Divisi tidak ditemukan' });
            }
        }
        catch (error) {
            console.error('Error getting division:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data divisi' });
        }
    }
    async updateDivision(req, res) {
        try {
            const { id } = req.params;
            const { name, description, quota, deadline, requirements, isActive } = req.body;
            const updateData = { updatedAt: new Date() };
            if (name)
                updateData.name = name;
            if (description)
                updateData.description = description;
            if (quota !== undefined) {
                if (quota <= 0) {
                    res.status(400).json({ message: 'Kuota harus lebih dari 0' });
                    return;
                }
                updateData.quota = parseInt(quota);
            }
            if (deadline) {
                const deadlineDate = new Date(deadline);
                if (deadlineDate <= new Date()) {
                    res.status(400).json({ message: 'Batas waktu harus lebih dari waktu sekarang' });
                    return;
                }
                updateData.deadline = deadlineDate;
            }
            if (requirements)
                updateData.requirements = requirements;
            if (isActive !== undefined)
                updateData.isActive = isActive;
            await firebase_1.db.collection(this.collectionName).doc(id).update(updateData);
            const doc = await firebase_1.db.collection(this.collectionName).doc(id).get();
            const division = Object.assign({ id: doc.id }, doc.data());
            res.status(200).json({ message: 'Divisi berhasil diperbarui', division });
        }
        catch (error) {
            console.error('Error updating division:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui divisi' });
        }
    }
    async deleteDivision(req, res) {
        try {
            const { id } = req.params;
            await firebase_1.db.collection(this.collectionName).doc(id).delete();
            res.status(204).send();
        }
        catch (error) {
            console.error('Error deleting division:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat menghapus divisi' });
        }
    }
    async incrementRegistration(req, res) {
        try {
            const { id } = req.params;
            const docRef = firebase_1.db.collection(this.collectionName).doc(id);
            await firebase_1.db.runTransaction(async (transaction) => {
                const doc = await transaction.get(docRef);
                if (!doc.exists) {
                    throw new Error('Divisi tidak ditemukan');
                }
                const data = doc.data();
                if (!data) {
                    throw new Error('Data divisi tidak valid');
                }
                if (data.currentRegistered >= data.quota) {
                    throw new Error('Kuota divisi sudah penuh');
                }
                transaction.update(docRef, {
                    currentRegistered: data.currentRegistered + 1,
                    updatedAt: new Date()
                });
            });
            res.status(200).json({ message: 'Registrasi berhasil ditambahkan' });
        }
        catch (error) {
            console.error('Error incrementing registration:', error);
            const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat menambah registrasi';
            res.status(500).json({ message: errorMessage });
        }
    }
    async exportDivisionsData(req, res) {
        try {
            const snapshot = await firebase_1.db.collection(this.collectionName).get();
            const divisions = snapshot.docs.map(doc => {
                var _a, _b, _c;
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name,
                    description: data.description,
                    quota: data.quota,
                    currentRegistered: data.currentRegistered,
                    remainingQuota: data.quota - data.currentRegistered,
                    deadline: ((_a = data.deadline) === null || _a === void 0 ? void 0 : _a.toDate) ? data.deadline.toDate().toISOString() : data.deadline,
                    requirements: data.requirements.join(', '),
                    isActive: data.isActive ? 'Aktif' : 'Tidak Aktif',
                    createdAt: ((_b = data.createdAt) === null || _b === void 0 ? void 0 : _b.toDate) ? data.createdAt.toDate().toISOString() : data.createdAt,
                    updatedAt: ((_c = data.updatedAt) === null || _c === void 0 ? void 0 : _c.toDate) ? data.updatedAt.toDate().toISOString() : data.updatedAt
                };
            });
            // Set headers for CSV download
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="divisions-data.csv"');
            // Create CSV content
            const csvHeaders = 'ID,Nama Divisi,Deskripsi,Kuota,Terdaftar,Sisa Kuota,Batas Waktu,Persyaratan,Status,Dibuat,Diperbarui\n';
            const csvContent = divisions.map(div => `"${div.id}","${div.name}","${div.description}",${div.quota},${div.currentRegistered},${div.remainingQuota},"${div.deadline}","${div.requirements}","${div.isActive}","${div.createdAt}","${div.updatedAt}"`).join('\n');
            res.send(csvHeaders + csvContent);
        }
        catch (error) {
            console.error('Error exporting divisions data:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat mengekspor data' });
        }
    }
}
exports.DivisionController = DivisionController;
//# sourceMappingURL=divisionController.js.map