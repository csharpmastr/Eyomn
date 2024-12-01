require("dotenv").config();
const { initializeApp } = require("firebase/app");
const { getFirestore, collection } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

const dbClient = getFirestore(app);

const patientCol = collection(dbClient, "patient");
const notificationCol = collection(dbClient, "notification");
const visitCol = collection(dbClient, "visit");
const inventoryCol = collection(dbClient, "inventory");
const organizationCol = collection(dbClient, "organization");

module.exports = {
  dbClient,
  patientCol,
  notificationCol,
  visitCol,
  inventoryCol,
  organizationCol,
};
