import { Request, Response } from 'express';
import { db } from '../config/firebase';
import fs from 'fs';
import path from 'path';

export class VolunteerController {
    private collectionName = 'volunteers';

    public async createVolunteer(req: Request, res: Response): Promise<void> {
        try {
            const { name, nim, prodi, noHp, divisionId } = req.body;
            // Validasi data
            if (!name || !nim || !prodi || !noHp || !divisionId) {
                res.status(400).json({ message: 'Semua field wajib diisi' });
                return;
            }
            // Validasi divisi
            const divisionDoc = await db.collection('divisions').doc(divisionId).get();
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
            const deadline = divisionData.deadline?.toDate ? divisionData.deadline.toDate() : divisionData.deadline;
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
            const docRef = await db.collection(this.collectionName).add(newVolunteer);
            // Increment kuota divisi
            try {
                await fetch(`http://localhost:3000/api/divisions/${divisionId}/increment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                console.error('Error incrementing division quota:', error);
            }
            res.status(201).json({ id: docRef.id, ...newVolunteer });
        } catch (error) {
            console.error('Error creating volunteer:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat mendaftarkan relawan' });
        }
    }

    public async getVolunteer(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const doc = await db.collection(this.collectionName).doc(id).get();
            if (doc.exists) {
                const volunteer = { id: doc.id, ...doc.data() };
                res.status(200).json(volunteer);
            } else {
                res.status(404).json({ message: 'Relawan tidak ditemukan' });
            }
        } catch (error) {
            console.error('Error getting volunteer:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data relawan' });
        }
    }

    public async getAllVolunteers(req: Request, res: Response): Promise<void> {
        try {
            const snapshot = await db.collection(this.collectionName).get();
            const volunteers = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            res.status(200).json(volunteers);
        } catch (error) {
            console.error('Error getting all volunteers:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data relawan' });
        }
    }

    public async getVolunteersByDivision(req: Request, res: Response): Promise<void> {
        try {
            const { divisionId } = req.params;
            const snapshot = await db.collection(this.collectionName)
                .where('divisionId', '==', divisionId)
                .get();
            const volunteers = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            res.status(200).json(volunteers);
        } catch (error) {
            console.error('Error getting volunteers by division:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data relawan' });
        }
    }

    public async updateVolunteer(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { name, nim, prodi, noHp, status, divisionId } = req.body;
            const updateData = {
                ...(name && { name }),
                ...(nim && { nim }),
                ...(prodi && { prodi }),
                ...(noHp && { noHp }),
                ...(status && { status }),
                ...(divisionId && { divisionId }),
                updatedAt: new Date()
            };
            await db.collection(this.collectionName).doc(id).update(updateData);
            const doc = await db.collection(this.collectionName).doc(id).get();
            const volunteer = { id: doc.id, ...doc.data() };
            res.status(200).json(volunteer);
        } catch (error) {
            console.error('Error updating volunteer:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui data relawan' });
        }
    }

    public async deleteVolunteer(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await db.collection(this.collectionName).doc(id).delete();
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting volunteer:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat menghapus relawan' });
        }
    }

    public async exportVolunteersData(req: Request, res: Response): Promise<void> {
        try {
            const snapshot = await db.collection(this.collectionName).get();
            const volunteers = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    nama: data.name,
                    nim: data.nim,
                    prodi: data.prodi,
                    noHp: data.noHp,
                    divisionId: data.divisionId,
                    status: data.status,
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
                    updatedAt: data.updatedAt ? (data.updatedAt.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt) : ''
                };
            });
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="volunteers-data.csv"');
            const csvHeaders = 'ID,Nama,NIM,Prodi,No HP,Divisi,Status,Dibuat,Diperbarui\n';
            const csvContent = volunteers.map(vol => 
                `"${vol.id}","${vol.nama}","${vol.nim}","${vol.prodi}","${vol.noHp}","${vol.divisionId}","${vol.status}","${vol.createdAt}","${vol.updatedAt}"`
            ).join('\n');
            res.send(csvHeaders + csvContent);
        } catch (error) {
            console.error('Error exporting volunteers data:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat mengekspor data' });
        }
    }
}

export async function addVolunteer(req: Request, res: Response) {
    try {
        const { name, email, divisionId } = req.body;
        if (!name || !email || !divisionId) {
            return res.status(400).json({ message: 'Semua field wajib diisi' });
        }
        const docRef = await db.collection('volunteers').add({ name, email, divisionId });
        // Simpan ke file JSON lokal
        const filePath = path.join(__dirname, '../../volunteers.json');
        let volunteers = [];
        if (fs.existsSync(filePath)) {
            volunteers = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        volunteers.push({ id: docRef.id, name, email, divisionId });
        fs.writeFileSync(filePath, JSON.stringify(volunteers, null, 2));
        return res.json({ success: true, message: 'Volunteer berhasil ditambahkan', id: docRef.id });
    } catch (error) {
        console.error('Error adding volunteer:', error);
        return res.status(500).json({ message: 'Gagal menambah volunteer' });
    }
}

export async function getAllVolunteers(req: Request, res: Response) {
    try {
        const snapshot = await db.collection('volunteers').get();
        const volunteers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.json(volunteers);
    } catch (error) {
        console.error('Error getting volunteers:', error);
        return res.status(500).json({ message: 'Gagal mengambil data volunteer' });
    }
}

export async function getVolunteer(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const doc = await db.collection('volunteers').doc(id).get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Volunteer tidak ditemukan' });
        }
        return res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error('Error getting volunteer:', error);
        return res.status(500).json({ message: 'Gagal mengambil data volunteer' });
    }
}

export async function updateVolunteer(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { name, email, divisionId } = req.body;
        const docRef = db.collection('volunteers').doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Volunteer tidak ditemukan' });
        }
        await docRef.update({ name, email, divisionId });
        // Update file JSON lokal
        const filePath = path.join(__dirname, '../../volunteers.json');
        let volunteers = [];
        if (fs.existsSync(filePath)) {
            volunteers = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        volunteers = volunteers.map((v: any) => v.id === id ? { ...v, name, email, divisionId } : v);
        fs.writeFileSync(filePath, JSON.stringify(volunteers, null, 2));
        return res.json({ success: true, message: 'Volunteer berhasil diupdate' });
    } catch (error) {
        console.error('Error updating volunteer:', error);
        return res.status(500).json({ message: 'Gagal mengupdate volunteer' });
    }
}

export async function deleteVolunteer(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const docRef = db.collection('volunteers').doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Volunteer tidak ditemukan' });
        }
        await docRef.delete();
        // Update file JSON lokal
        const filePath = path.join(__dirname, '../../volunteers.json');
        let volunteers = [];
        if (fs.existsSync(filePath)) {
            volunteers = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        volunteers = volunteers.filter((v: any) => v.id !== id);
        fs.writeFileSync(filePath, JSON.stringify(volunteers, null, 2));
        return res.json({ success: true, message: 'Volunteer berhasil dihapus' });
    } catch (error) {
        console.error('Error deleting volunteer:', error);
        return res.status(500).json({ message: 'Gagal menghapus volunteer' });
    }
}