import { Request, Response } from 'express';
import { db } from '../config/firebase';
import fs from 'fs';
import path from 'path';

export async function addDivision(req: Request, res: Response) {
    try {
        let { name, description, quota, deadline, requirements, isActive, currentRegistered } = req.body;
        if (!name || !description || quota === undefined || !deadline) {
            return res.status(400).json({ message: 'Nama, deskripsi, kuota, dan deadline wajib diisi' });
        }
        // Set default values
        isActive = isActive !== undefined ? isActive : true;
        quota = quota !== undefined ? quota : 0;
        currentRegistered = currentRegistered !== undefined ? currentRegistered : 0;
        const data = { name, description, quota, deadline, requirements: requirements || [], isActive, currentRegistered };
        const docRef = await db.collection('divisions').add(data);
        // Simpan ke file JSON lokal
        const filePath = path.join(__dirname, '../../divisions.json');
        let divisions = [];
        if (fs.existsSync(filePath)) {
            divisions = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        divisions.push({ id: docRef.id, ...data });
        fs.writeFileSync(filePath, JSON.stringify(divisions, null, 2));
        return res.json({ success: true, message: 'Divisi berhasil ditambahkan', id: docRef.id });
    } catch (error) {
        console.error('Error adding division:', error);
        return res.status(500).json({ message: 'Gagal menambah divisi' });
    }
}

export async function getAllDivisions(req: Request, res: Response) {
    try {
        const snapshot = await db.collection('divisions').get();
        const divisions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.json(divisions);
    } catch (error) {
        console.error('Error getting divisions:', error);
        return res.status(500).json({ message: 'Gagal mengambil data divisi' });
    }
}

export async function getDivision(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const doc = await db.collection('divisions').doc(id).get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Divisi tidak ditemukan' });
        }
        return res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error('Error getting division:', error);
        return res.status(500).json({ message: 'Gagal mengambil data divisi' });
    }
}

export async function updateDivision(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { name, description, quota, deadline, requirements, isActive } = req.body;
        const docRef = db.collection('divisions').doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Divisi tidak ditemukan' });
        }
        const updateData: any = { updatedAt: new Date() };
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (quota !== undefined) {
            if (isNaN(Number(quota)) || Number(quota) < 0) {
                return res.status(400).json({ message: 'Kuota harus angka >= 0' });
            }
            updateData.quota = Number(quota);
        }
        if (deadline !== undefined) {
            const deadlineDate = new Date(deadline);
            if (isNaN(deadlineDate.getTime())) {
                return res.status(400).json({ message: 'Deadline tidak valid' });
            }
            updateData.deadline = deadlineDate;
        }
        if (requirements !== undefined) updateData.requirements = requirements;
        if (isActive !== undefined) updateData.isActive = isActive;
        await docRef.update(updateData);
        // Update file JSON lokal
        const filePath = path.join(__dirname, '../../divisions.json');
        let divisions = [];
        if (fs.existsSync(filePath)) {
            divisions = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        divisions = divisions.map((d: any) => d.id === id ? { ...d, ...updateData } : d);
        fs.writeFileSync(filePath, JSON.stringify(divisions, null, 2));
        return res.json({ success: true, message: 'Divisi berhasil diupdate' });
    } catch (error) {
        console.error('Error updating division:', error);
        return res.status(500).json({ message: 'Gagal mengupdate divisi' });
    }
}

export async function deleteDivision(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const docRef = db.collection('divisions').doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Divisi tidak ditemukan' });
        }
        await docRef.delete();
        // Update file JSON lokal
        const filePath = path.join(__dirname, '../../divisions.json');
        let divisions = [];
        if (fs.existsSync(filePath)) {
            divisions = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        divisions = divisions.filter((d: any) => d.id !== id);
        fs.writeFileSync(filePath, JSON.stringify(divisions, null, 2));
        return res.json({ success: true, message: 'Divisi berhasil dihapus' });
    } catch (error) {
        console.error('Error deleting division:', error);
        return res.status(500).json({ message: 'Gagal menghapus divisi' });
    }
}

export class DivisionController {
    private collectionName = 'divisions';

    public async createDivision(req: Request, res: Response): Promise<void> {
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

            const docRef = await db.collection(this.collectionName).add(newDivision);
            const division = { id: docRef.id, ...newDivision };
            
            res.status(201).json({ message: 'Divisi berhasil dibuat', division });
        } catch (error) {
            console.error('Error creating division:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat membuat divisi' });
        }
    }

    public async getAllDivisions(req: Request, res: Response): Promise<void> {
        try {
            const snapshot = await db.collection(this.collectionName).get();
            const divisions = snapshot.docs.map(doc => {
                const data = doc.data();
                if (!data) return null;
                return {
                    id: doc.id,
                    ...data,
                    deadline: data.deadline?.toDate ? data.deadline.toDate() : data.deadline,
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
                    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
                };
            }).filter(Boolean);
            
            res.status(200).json(divisions);
        } catch (error) {
            console.error('Error getting divisions:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data divisi' });
        }
    }

    public async getActiveDivisions(req: Request, res: Response): Promise<void> {
        try {
            const snapshot = await db.collection(this.collectionName)
                .where('isActive', '==', true)
                .get();
            
            const divisions = snapshot.docs.map(doc => {
                const data = doc.data();
                if (!data) return null;
                const deadline = data.deadline?.toDate ? data.deadline.toDate() : data.deadline;
                const isExpired = new Date() > deadline;
                const isFull = data.currentRegistered >= data.quota;
                
                return {
                    id: doc.id,
                    ...data,
                    deadline: deadline,
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
                    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
                    isExpired,
                    isFull,
                    isOpenForRegistration: data.isActive && !isFull && !isExpired,
                    remainingQuota: Math.max(0, data.quota - data.currentRegistered)
                };
            }).filter(Boolean);
            
            res.status(200).json(divisions);
        } catch (error) {
            console.error('Error getting active divisions:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data divisi aktif' });
        }
    }

    public async getDivision(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const doc = await db.collection(this.collectionName).doc(id).get();
            
            if (doc.exists) {
                const data = doc.data();
                if (!data) {
                    res.status(404).json({ message: 'Data divisi tidak valid' });
                    return;
                }
                const division = {
                    id: doc.id,
                    ...data,
                    deadline: data.deadline?.toDate ? data.deadline.toDate() : data.deadline,
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
                    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
                };
                res.status(200).json(division);
            } else {
                res.status(404).json({ message: 'Divisi tidak ditemukan' });
            }
        } catch (error) {
            console.error('Error getting division:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data divisi' });
        }
    }

    public async updateDivision(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { name, description, quota, deadline, requirements, isActive } = req.body;
            
            const updateData: any = { updatedAt: new Date() };
            
            if (name) updateData.name = name;
            if (description) updateData.description = description;
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
            if (requirements) updateData.requirements = requirements;
            if (isActive !== undefined) updateData.isActive = isActive;

            await db.collection(this.collectionName).doc(id).update(updateData);
            
            const doc = await db.collection(this.collectionName).doc(id).get();
            const division = { id: doc.id, ...doc.data() };
            
            res.status(200).json({ message: 'Divisi berhasil diperbarui', division });
        } catch (error) {
            console.error('Error updating division:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui divisi' });
        }
    }

    public async deleteDivision(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await db.collection(this.collectionName).doc(id).delete();
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting division:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat menghapus divisi' });
        }
    }

    public async incrementRegistration(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            
            const docRef = db.collection(this.collectionName).doc(id);
            await db.runTransaction(async (transaction) => {
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
        } catch (error) {
            console.error('Error incrementing registration:', error);
            const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat menambah registrasi';
            res.status(500).json({ message: errorMessage });
        }
    }

    public async exportDivisionsData(req: Request, res: Response): Promise<void> {
        try {
            const snapshot = await db.collection(this.collectionName).get();
            const divisions = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name,
                    description: data.description,
                    quota: data.quota,
                    currentRegistered: data.currentRegistered,
                    remainingQuota: data.quota - data.currentRegistered,
                    deadline: data.deadline?.toDate ? data.deadline.toDate().toISOString() : data.deadline,
                    requirements: data.requirements.join(', '),
                    isActive: data.isActive ? 'Aktif' : 'Tidak Aktif',
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
                    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt
                };
            });

            // Set headers for CSV download
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="divisions-data.csv"');
            
            // Create CSV content
            const csvHeaders = 'ID,Nama Divisi,Deskripsi,Kuota,Terdaftar,Sisa Kuota,Batas Waktu,Persyaratan,Status,Dibuat,Diperbarui\n';
            const csvContent = divisions.map(div => 
                `"${div.id}","${div.name}","${div.description}",${div.quota},${div.currentRegistered},${div.remainingQuota},"${div.deadline}","${div.requirements}","${div.isActive}","${div.createdAt}","${div.updatedAt}"`
            ).join('\n');
            
            res.send(csvHeaders + csvContent);
        } catch (error) {
            console.error('Error exporting divisions data:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat mengekspor data' });
        }
    }
} 