"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.createOrUpdateEvent = exports.getEvent = void 0;
const firebase_1 = require("../config/firebase");
const EVENTS_COLLECTION = 'events';
const getEvent = async () => {
    const snapshot = await firebase_1.db.collection(EVENTS_COLLECTION).limit(1).get();
    if (snapshot.empty)
        return null;
    const doc = snapshot.docs[0];
    return Object.assign({ id: doc.id }, doc.data());
};
exports.getEvent = getEvent;
const createOrUpdateEvent = async (event) => {
    const snapshot = await firebase_1.db.collection(EVENTS_COLLECTION).limit(1).get();
    if (snapshot.empty) {
        await firebase_1.db.collection(EVENTS_COLLECTION).add(event);
    }
    else {
        const doc = snapshot.docs[0];
        await firebase_1.db.collection(EVENTS_COLLECTION).doc(doc.id).set(event);
    }
};
exports.createOrUpdateEvent = createOrUpdateEvent;
const deleteEvent = async () => {
    const snapshot = await firebase_1.db.collection(EVENTS_COLLECTION).limit(1).get();
    if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        await firebase_1.db.collection(EVENTS_COLLECTION).doc(doc.id).delete();
    }
};
exports.deleteEvent = deleteEvent;
//# sourceMappingURL=event.js.map