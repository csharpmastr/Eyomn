require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const { decryptDocument } = require("../Helper/Helper");
const {
  query,
  where,
  onSnapshot,
  collection,
  doc,
  or,
} = require("firebase/firestore");
const {
  patientCol,
  notificationCol,
  dbClient,
} = require("../Config/FirebaseClientSDK");

const sseConnections = {};
let cachedPatients = {};
let cachedNotifications = {};

const startSSEServer = (app) => {
  app.get("/sse/:role/:id", (req, res) => {
    const { role, id } = req.params;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    if (!sseConnections[role]) sseConnections[role] = {};
    if (!sseConnections[role][id]) sseConnections[role][id] = [];
    sseConnections[role][id].push(res);

    console.log(`SSE connection established for role ${role}, ID ${id}`);

    const keepAlive = setInterval(() => {
      res.write(`: ping\n\n`);
    }, 15000);

    let unsubscribePatients, unsubscribeNotifications;

    if (cachedPatients[id]) {
      console.log("cached");
      res.write(
        `data: ${JSON.stringify({
          type: "patient",
          data: cachedPatients[id],
        })}\n\n`
      );
    }
    if (cachedNotifications[id]) {
      console.log("cached");

      res.write(
        `data: ${JSON.stringify({
          type: "notification",
          data: cachedNotifications[id],
        })}\n\n`
      );
    }

    try {
      if (role === "2") {
        const patientQuery = query(
          patientCol,
          or(
            where("doctorId", "==", id),
            where("authorizedDoctor", "array-contains", id)
          )
        );

        unsubscribePatients = onSnapshot(patientQuery, (snapshot) => {
          const patients = [];
          snapshot.docChanges().forEach((change) => {
            const patientId = change.doc.id;

            if (change.type === "added" || change.type === "modified") {
              const newPatient = change.doc.data();
              const decryptedPatientData = decryptDocument(newPatient, [
                "patientId",
                "branchId",
                "doctorId",
                "organizationId",
                "createdAt",
                "isDeleted",
                "authorizedDoctor",
              ]);
              patients.push(decryptedPatientData);
            }
          });

          if (patients.length > 0) {
            cachedPatients[id] = patients;
            res.write(
              `data: ${JSON.stringify({ type: "patient", data: patients })}\n\n`
            );
          }
        });
      }

      const notificationRef = collection(dbClient, "notification");
      const staffRef = doc(notificationRef, id);
      const notifsRef = collection(staffRef, "notifs");
      const notificationQuery = query(notifsRef, where("doctorId", "==", id));

      unsubscribeNotifications = onSnapshot(notificationQuery, (snapshot) => {
        const notifications = [];
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const notificationData = change.doc.data();
            const decryptedNotification = decryptDocument(notificationData, [
              "patientId",
              "doctorId",
              "branchId",
              "createdAt",
              "type",
              "notificationId",
              "read",
            ]);
            notifications.push(decryptedNotification);
          }
        });

        if (notifications.length > 0) {
          cachedNotifications[id] = notifications;
          res.write(
            `data: ${JSON.stringify({
              type: "notification",
              data: notifications,
            })}\n\n`
          );
        }
      });
    } catch (error) {
      console.error("Error subscribing to Firestore:", error.message);
      res.write(
        `event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`
      );
    }

    req.on("close", () => {
      console.log(`SSE connection closed for role ${role}, ID ${id}`);
      clearInterval(keepAlive);

      if (unsubscribePatients) unsubscribePatients();
      if (unsubscribeNotifications) unsubscribeNotifications();

      sseConnections[role][id] = sseConnections[role][id].filter(
        (conn) => conn !== res
      );
    });
  });
};

module.exports = { startSSEServer };
