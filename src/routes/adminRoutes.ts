import { Application, Router } from 'express';
import * as adminController from '../controllers/adminController';

export function setAdminRoutes(app: Application) {
    const router = Router();

    // Route untuk inisialisasi admin default
    router.post('/admin/init', (req, res) => adminController.initializeAdmin(req, res));
    
    // Route untuk login admin
    router.post('/admin/login', (req, res) => adminController.loginAdmin(req, res));


    // Routes untuk admin
    router.post('/admin', (req, res) => adminController.createAdmin(req, res));
    router.put('/admin/:id', (req, res) => adminController.updateAdmin(req, res));

    // Routes untuk mengelola volunteers (admin only)
    router.get('/volunteers', (req, res) => adminController.getAllVolunteers(req, res));
    router.put('/volunteers/:id/status', (req, res) => adminController.updateVolunteerStatus(req, res));

    app.use('/api', router);
}

