import { Application, Router } from 'express';
import * as adminController from '../controllers/adminController';

export function setAdminRoutes(app: Application) {
    const router = Router();
    
    // Route untuk login admin
    router.post('/admin/login', (req, res) => adminController.loginAdmin(req, res));

    app.use('/api', router);
}

