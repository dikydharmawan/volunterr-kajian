"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolunteerController = void 0;
const firebase_1 = require("../config/firebase");
class VolunteerController {
    constructor() {
        this.collectionName = 'volunteers';
    }
    async createVolunteer(req, res) {
        var _a;
        try {
            const { name, nim, prodi, noHp, divisionId } = req.body;
            // Validasi data
            if (!name || !nim || !prodi || !noHp || !divisionId) {
                res.status(400).json({ message: 'Semua field wajib diisi' });
                return;
            }
            // Validasi divisi
            const divisionDoc = await firebase_1.db.collection('divisions').doc(divisionId).get();
            if (!divisionDoc.exists) {
                res.status(400).json({ message: 'Divisi tidak ditemukan' });
                return;
            }
            const divisionData = divisionDoc.data();
            if (!divisionData) {
                res.status(400).json({ message: 'Data divisi tidak valid' });
                return;
            }
            if (!divisionData.isActive) {
                res.status(400).json({ message: 'Divisi tidak aktif' });
                return;
            }
            if (divisionData.currentRegistered >= divisionData.quota) {
                res.status(400).json({ message: 'Kuota divisi sudah penuh' });
                return;
            }
            const deadline = ((_a = divisionData.deadline) === null || _a === void 0 ? void 0 : _a.toDate) ? divisionData.deadline.toDate() : divisionData.deadline;
            if (new Date() > deadline) {
                res.status(400).json({ message: 'Pendaftaran divisi sudah ditutup' });
                return;
            }
            const newVolunteer = {
                name,
                nim,
                prodi,
                noHp,
                divisionId,
                createdAt: new Date(),
                status: 'active'
            };
            const docRef = await firebase_1.db.collection(this.collectionName).add(newVolunteer);
            // Increment kuota divisi
            try {
                await fetch(`http://localhost:3000/api/divisions/${divisionId}/increment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            catch (error) {
                console.error('Error incrementing division quota:', error);
            }
            res.status(201).json(Object.assign({ id: docRef.id }, newVolunteer));
        }
        catch (error) {
            console.error('Error creating volunteer:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat mendaftarkan relawan' });
        }
    }
    async getVolunteer(req, res) {
        try {
            const { id } = req.params;
            const doc = await firebase_1.db.collection(this.collectionName).doc(id).get();
            if (doc.exists) {
                const volunteer = Object.assign({ id: doc.id }, doc.data());
                res.status(200).json(volunteer);
            }
            else {
                res.status(404).json({ message: 'Relawan tidak ditemukan' });
            }
        }
        catch (error) {
            console.error('Error getting volunteer:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data relawan' });
        }
    }
    async getAllVolunteers(req, res) {
        try {
            const snapshot = await firebase_1.db.collection(this.collectionName).get();
            const volunteers = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
            res.status(200).json(volunteers);
        }
        catch (error) {
            console.error('Error getting all volunteers:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data relawan' });
        }
    }
    async getVolunteersByDivision(req, res) {
        try {
            const { divisionId } = req.params;
            const snapshot = await firebase_1.db.collection(this.collectionName)
                .where('divisionId', '==', divisionId)
                .get();
            const volunteers = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
            res.status(200).json(volunteers);
        }
        catch (error) {
            console.error('Error getting volunteers by division:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data relawan' });
        }
    }
    async updateVolunteer(req, res) {
        try {
            const { id } = req.params;
            const { name, nim, prodi, noHp, status, divisionId } = req.body;
            const updateData = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (name && { name })), (nim && { nim })), (prodi && { prodi })), (noHp && { noHp })), (status && { status })), (divisionId && { divisionId })), { updatedAt: new Date() });
            await firebase_1.db.collection(this.collectionName).doc(id).update(updateData);
            const doc = await firebase_1.db.collection(this.collectionName).doc(id).get();
            const volunteer = Object.assign({ id: doc.id }, doc.data());
            res.status(200).json(volunteer);
        }
        catch (error) {
            console.error('Error updating volunteer:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui data relawan' });
        }
    }
    async deleteVolunteer(req, res) {
        try {
            const { id } = req.params;
            await firebase_1.db.collection(this.collectionName).doc(id).delete();
            res.status(204).send();
        }
        catch (error) {
            console.error('Error deleting volunteer:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat menghapus relawan' });
        }
    }
    async exportVolunteersData(req, res) {
        try {
            const snapshot = await firebase_1.db.collection(this.collectionName).get();
            const volunteers = snapshot.docs.map(doc => {
                var _a;
                const data = doc.data();
                return {
                    id: doc.id,
                    nama: data.name,
                    nim: data.nim,
                    prodi: data.prodi,
                    noHp: data.noHp,
                    divisionId: data.divisionId,
                    status: data.status,
                    createdAt: ((_a = data.createdAt) === null || _a === void 0 ? void 0 : _a.toDate) ? data.createdAt.toDate().toISOString() : data.createdAt,
                    updatedAt: data.updatedAt ? (data.updatedAt.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt) : ''
                };
            });
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="volunteers-data.csv"');
            const csvHeaders = 'ID,Nama,NIM,Prodi,No HP,Divisi,Status,Dibuat,Diperbarui\n';
            const csvContent = volunteers.map(vol => `"${vol.id}","${vol.nama}","${vol.nim}","${vol.prodi}","${vol.noHp}","${vol.divisionId}","${vol.status}","${vol.createdAt}","${vol.updatedAt}"`).join('\n');
            res.send(csvHeaders + csvContent);
        }
        catch (error) {
            console.error('Error exporting volunteers data:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat mengekspor data' });
        }
    }
}
exports.VolunteerController = VolunteerController;
//# sourceMappingURL=volunteerController.js.map