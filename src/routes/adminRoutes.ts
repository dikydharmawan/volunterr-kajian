import { Application, Router } from 'express';
import * as adminController from '../controllers/adminController';

export function setAdminRoutes(app: Application) {
    const router = Router();
    
    // Route untuk login admin
    router.post('/admin/login', (req, res) => adminController.loginAdmin(req, res));
    // Route untuk tambah admin
    router.post('/admin/add', (req, res) => adminController.addAdmin(req, res));
    // Route untuk ganti admin (replace)
    router.post('/admin/replace', (req, res) => adminController.replaceAdmin(req, res));

    app.use('/api', router);
}

