import { Router } from 'express';
import { DivisionController } from '../controllers/divisionController';
import { Application } from 'express';

const divisionController = new DivisionController();
const router = Router();

export function setDivisionRoutes(app: Application): void {
    // Routes untuk admin mengelola divisi
    router.post('/divisions', (req, res) => divisionController.createDivision(req, res));
    router.get('/divisions', (req, res) => divisionController.getAllDivisions(req, res));
    router.get('/divisions/active', (req, res) => divisionController.getActiveDivisions(req, res));
    router.get('/divisions/:id', (req, res) => divisionController.getDivision(req, res));
    router.put('/divisions/:id', (req, res) => divisionController.updateDivision(req, res));
    router.delete('/divisions/:id', (req, res) => divisionController.deleteDivision(req, res));
    
    // Route untuk eksport data divisi
    router.get('/divisions/export/csv', (req, res) => divisionController.exportDivisionsData(req, res));
    
    // Route untuk increment registrasi (dipanggil saat volunteer mendaftar)
    router.post('/divisions/:id/increment', (req, res) => divisionController.incrementRegistration(req, res));

    app.use('/api', router);
} 