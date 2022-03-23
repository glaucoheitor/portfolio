import functions from "firebase-functions";
import app from "./server.js";

// Expose Express API as a single Cloud Function:
export const server = functions.https.onRequest(app);
