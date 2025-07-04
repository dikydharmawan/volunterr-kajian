import { Router, Application } from 'express';
import * as volunteerController from '../controllers/volunteerController';

const router = Router();

export function setVolunteerRoutes(app: Application): void {
    // CRUD routes untuk volunteer
    router.post('/volunteer/add', (req, res) => volunteerController.addVolunteer(req, res));
    router.get('/volunteers', (req, res) => volunteerController.getAllVolunteers(req, res));
    router.get('/volunteers/:id', (req, res) => volunteerController.getVolunteer(req, res));
    router.put('/volunteers/:id', (req, res) => volunteerController.updateVolunteer(req, res));
    router.delete('/volunteers/:id', (req, res) => volunteerController.deleteVolunteer(req, res));

    app.use('/api', router);
}

export function createVolunteer(req: Request, res: Response) {
    // implementation
}

export function updateVolunteer(req: Request, res: Response) {
    // implementation
}