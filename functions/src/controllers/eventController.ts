import { Request, Response } from 'express';
import * as EventModel from '../models/event';

export const getEvent = async (req: Request, res: Response) => {
  try {
    const event = await EventModel.getEvent();
    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get event', error });
  }
};

export const createOrUpdateEvent = async (req: Request, res: Response) => {
  try {
    const { name, date, time, location, description } = req.body;
    if (!name || !date || !time || !location || !description) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    await EventModel.createOrUpdateEvent({ name, date, time, location, description });
    return res.json({ success: true, message: 'Event saved' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to save event', error });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    await EventModel.deleteEvent();
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete event', error });
  }
}; 