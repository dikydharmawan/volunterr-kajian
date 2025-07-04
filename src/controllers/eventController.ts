import { Request, Response } from 'express';
import * as EventModel from '../models/event';
import { db } from '../config/firebase';
import fs from 'fs';
import path from 'path';

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

export async function addEvent(req: Request, res: Response) {
    try {
        const { name, date, location, description } = req.body;
        if (!name || !date || !location || !description) {
            return res.status(400).json({ message: 'Semua field wajib diisi' });
        }
        await db.collection('events').add({ name, date, location, description });
        // Simpan ke file JSON lokal
        const filePath = path.join(__dirname, '../../events.json');
        let events = [];
        if (fs.existsSync(filePath)) {
            events = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        events.push({ name, date, location, description });
        fs.writeFileSync(filePath, JSON.stringify(events, null, 2));
        return res.json({ success: true, message: 'Event berhasil ditambahkan' });
    } catch (error) {
        console.error('Error adding event:', error);
        return res.status(500).json({ message: 'Gagal menambah event' });
    }
} 