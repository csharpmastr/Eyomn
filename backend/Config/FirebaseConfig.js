require("dotenv").config();
const admin = require("firebase-admin");

const firebaseCredentials = JSON.parse(
  Buffer.from(process.env.FIREBASE_ADMIN_SDK, "base64").toString()
);

admin.initializeApp({
  credential: admin.credential.cert(firebaseCredentials),
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
