import express from 'express';
import { setAdminRoutes } from './routes/adminRoutes';
import { setDivisionRoutes } from './routes/divisionRoutes';
import { setVolunteerRoutes } from './routes/volunteerRoutes';
import { setEventRoutes } from './routes/eventRoutes';
import path from 'path';

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

setAdminRoutes(app);
setDivisionRoutes(app);
setVolunteerRoutes(app);
setEventRoutes(app);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
