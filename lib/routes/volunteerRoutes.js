"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setVolunteerRoutes = setVolunteerRoutes;
exports.createVolunteer = createVolunteer;
exports.updateVolunteer = updateVolunteer;
const volunteerController_1 = require("../controllers/volunteerController");
const express_1 = require("express");
const volunteerController = new volunteerController_1.VolunteerController();
const router = (0, express_1.Router)();
function setVolunteerRoutes(app) {
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
function createVolunteer(req, res) {
    // implementation
}
function updateVolunteer(req, res) {
    // implementation
}
//# sourceMappingURL=volunteerRoutes.js.map