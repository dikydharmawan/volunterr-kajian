import { VolunteerController } from '../controllers/volunteerController';
import { Application, Request, Response, Router } from 'express';

const volunteerController = new VolunteerController();
const router = Router();

export function setVolunteerRoutes(app: Application): void {
    // Route untuk pendaftaran volunteer (POST)
    router.post('/volunteers', (req, res) => volunteerController.createVolunteer(req, res));
    
    // Route untuk mendapatkan semua volunteers (GET)
    router.get('/volunteers', (req, res) => volunteerController.getAllVolunteers(req, res));
    
    // Route untuk mendapatkan volunteer berdasarkan divisi (GET)
    router.get('/volunteers/division/:divisionId', (req, res) => volunteerController.getVolunteersByDivision(req, res));
    
    // Route untuk export data volunteers (GET)
    router.get('/volunteers/export/csv', (req, res) => volunteerController.exportVolunteersData(req, res));
    
    // Route untuk mendapatkan volunteer berdasarkan ID (GET)
    router.get('/volunteers/:id', (req, res) => volunteerController.getVolunteer(req, res));
    
    // Route untuk memperbarui data volunteer (PUT)
    router.put('/volunteers/:id', (req, res) => volunteerController.updateVolunteer(req, res));
    
    // Route untuk update status volunteer (PUT)
    router.put('/volunteers/:id/status', (req, res) => volunteerController.updateVolunteer(req, res));
    
    // Route untuk menghapus volunteer (DELETE)
    router.delete('/volunteers/:id', (req, res) => volunteerController.deleteVolunteer(req, res));

    app.use('/api', router);
}

export function createVolunteer(req: Request, res: Response) {
    // implementation
}

export function updateVolunteer(req: Request, res: Response) {
    // implementation
}