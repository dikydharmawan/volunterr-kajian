import { Router, Application } from 'express';
import * as divisionController from '../controllers/divisionController';

const router = Router();

export function setDivisionRoutes(app: Application): void {
    // CRUD routes untuk divisi
    router.post('/division/add', (req, res) => divisionController.addDivision(req, res));
    router.get('/divisions', (req, res) => divisionController.getAllDivisions(req, res));
    router.get('/divisions/:id', (req, res) => divisionController.getDivision(req, res));
    router.put('/divisions/:id', (req, res) => divisionController.updateDivision(req, res));
    router.delete('/divisions/:id', (req, res) => divisionController.deleteDivision(req, res));

    app.use('/api', router);
} 