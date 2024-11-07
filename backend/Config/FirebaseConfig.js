require("dotenv").config();
const admin = require("firebase-admin");
const serviceAccount = require("./eyomn-2d9c7-firebase-adminsdk-zjlyg-4c6fd6c764.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  storageBucket: `gs://${process.env.FIREBASE_STORAGE_BUCKET}`,
});

const db = admin.firestore();

const organizationCollection = db.collection("organization");
const branchCollection = db.collection("branch");
const staffCollection = db.collection("staff");
const patientCollection = db.collection("patient");
const userCollection = db.collection("user");
const inventoryCollection = db.collection("inventory");
const appointmentCollection = db.collection("apppointment");
const notificationCollection = db.collection("notification");
const visitCollection = db.collection("visit");
const noteCollection = db.collection("note");
const bucket = admin.storage().bucket();
module.exports = {
  db,
  organizationCollection,
  branchCollection,
  staffCollection,
  patientCollection,
  userCollection,
  inventoryCollection,
  appointmentCollection,
  notificationCollection,
  visitCollection,
  noteCollection,
  bucket,
};
