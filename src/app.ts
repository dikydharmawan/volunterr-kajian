import express from 'express';
import { setAdminRoutes } from './routes/adminRoutes';
import { setVolunteerRoutes } from './routes/volunteerRoutes';
import { setDivisionRoutes } from './routes/divisionRoutes';
import { setEventRoutes } from './routes/eventRoutes';
import path from 'path';
import './config/firebase'; // Import konfigurasi Firebase

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Melayani file statis dari folder public
app.use(express.static(path.join(__dirname, '../public')));

setAdminRoutes(app);
setVolunteerRoutes(app);
setDivisionRoutes(app);
setEventRoutes(app);

// Arahkan route utama ke index.html (form pendaftaran volunteer)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});