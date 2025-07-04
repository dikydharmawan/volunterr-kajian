import { Application, Router } from 'express';
import * as eventController from '../controllers/eventController';

export function setEventRoutes(app: Application) {
  const router = Router();

  router.get('/event', eventController.getEvent);
  router.post('/event', eventController.createOrUpdateEvent);
  router.delete('/event', eventController.deleteEvent);
  router.post('/event/add', (req, res) => eventController.addEvent(req, res));

  app.use('/api', router);
} 