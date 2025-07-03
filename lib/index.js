"use strict";
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const firebase_functions_1 = require("firebase-functions");
const https_1 = require("firebase-functions/https");
const express_1 = __importDefault(require("express"));
const adminRoutes_1 = require("./routes/adminRoutes");
const volunteerRoutes_1 = require("./routes/volunteerRoutes");
const divisionRoutes_1 = require("./routes/divisionRoutes");
const eventRoutes_1 = require("./routes/eventRoutes");
require("./config/firebase");
// Start writing functions
// https://firebase.google.com/docs/functions/typescript
// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
(0, firebase_functions_1.setGlobalOptions)({ maxInstances: 10 });
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, adminRoutes_1.setAdminRoutes)(app);
(0, volunteerRoutes_1.setVolunteerRoutes)(app);
(0, divisionRoutes_1.setDivisionRoutes)(app);
(0, eventRoutes_1.setEventRoutes)(app);
exports.api = (0, https_1.onRequest)(app);
// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
//# sourceMappingURL=index.js.map