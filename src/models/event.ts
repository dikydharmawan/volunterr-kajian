import { db } from '../config/firebase';

const EVENTS_COLLECTION = 'events';

export interface Event {
  id?: string;
  name: string;
  date: string; // format: YYYY-MM-DD
  time: string; // format: HH:mm
  location: string;
  description: string;
}

export const getEvent = async (): Promise<Event | null> => {
  const snapshot = await db.collection(EVENTS_COLLECTION).limit(1).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Event;
};

export const createOrUpdateEvent = async (event: Event): Promise<void> => {
  const snapshot = await db.collection(EVENTS_COLLECTION).limit(1).get();
  if (snapshot.empty) {
    await db.collection(EVENTS_COLLECTION).add(event);
  } else {
    const doc = snapshot.docs[0];
    await db.collection(EVENTS_COLLECTION).doc(doc.id).set(event);
  }
};

export const deleteEvent = async (): Promise<void> => {
  const snapshot = await db.collection(EVENTS_COLLECTION).limit(1).get();
  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    await db.collection(EVENTS_COLLECTION).doc(doc.id).delete();
  }
}; 