"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAdminRoutes = setAdminRoutes;
const express_1 = require("express");
const adminController = __importStar(require("../controllers/adminController"));
function setAdminRoutes(app) {
    const router = (0, express_1.Router)();
    // Route untuk inisialisasi admin default
    router.post('/admin/init', (req, res) => adminController.initializeAdmin(req, res));
    // Route untuk login admin
    router.post('/admin/login', (req, res) => adminController.loginAdmin(req, res));
    // Routes untuk admin
    router.put('/admin/:id', (req, res) => adminController.updateAdmin(req, res));
    // Routes untuk mengelola volunteers (admin only)
    router.get('/volunteers', (req, res) => adminController.getAllVolunteers(req, res));
    router.put('/volunteers/:id/status', (req, res) => adminController.updateVolunteerStatus(req, res));
    app.use('/api', router);
}
//# sourceMappingURL=adminRoutes.js.map