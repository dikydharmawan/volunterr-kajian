import express from 'express';
import { setAdminRoutes } from './routes/adminRoutes';
import path from 'path';

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

setAdminRoutes(app);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
