require("dotenv").config();
const WebSocket = require("ws");
const https = require("https");
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

const startWebSocketServer = () => {
  const server = https.createServer((req, res) => {
    res.writeHead(200);
    res.end("Hello from WebSocket Server");
  });
  const wss = new WebSocket.Server({ server });

  wss.on("connection", async (ws, req) => {
    console.log("New WebSocket connection");
    const urlParts = req.url.split("/");

    const organizationId = urlParts[1];
    const branchId = urlParts[2];
    const staffId = urlParts[3];
    console.log(organizationId, branchId, staffId);

    const urlParams = new URLSearchParams(req.url.split("?")[1]);
    const token = urlParams.get("token");

    if (!token) {
      ws.close(1008, "Token not provided");
      console.error("Token not provided");
      return;
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      console.log("Token verified:", decodedToken);
    } catch (error) {
      ws.close(1008, "Invalid token"); // Policy Violation
      console.error("Token verification failed:", error.message);
      return;
    }

    let unsubscribePatients, unsubscribeNotifications;
    const sentPatientIds = new Set();

    try {
      const patientQuery = query(
        patientCol,
        or(
          where("doctorId", "==", staffId),
          where("authorizedDoctor", "array-contains", staffId)
        )
      );

      unsubscribePatients = onSnapshot(patientQuery, (snapshot) => {
        try {
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
              if (!sentPatientIds.has(patientId)) {
                patients.push(decryptedPatientData);
                sentPatientIds.add(patientId);
              }
            }
          });

          console.log(`Patients length ${patients.length}`);
          if (patients.length > 0) {
            patients.forEach((patient) => {
              ws.send(JSON.stringify({ type: "patient", data: patient }));
            });
          }
        } catch (error) {
          console.error("Error processing patient data:", error.message);
          ws.send(
            JSON.stringify({ error: "Failed to process patient data updates" })
          );
        }
      });
    } catch (error) {
      console.error("Error fetching patient updates:", error.message);
      ws.send(JSON.stringify({ error: "Failed to fetch patient updates" }));
    }

    try {
      const notificationRef = collection(dbClient, "notification");
      const staffRef = doc(notificationRef, staffId);
      const notifsRef = collection(staffRef, "notifs");
      const notificationQuery = query(
        notifsRef,
        where("doctorId", "==", staffId)
      );

      unsubscribeNotifications = onSnapshot(notificationQuery, (snapshot) => {
        try {
          const notifications = [];

          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const notificationData = change.doc.data();
              const decryptedDocument = decryptDocument(notificationData, [
                "patientId",
                "doctorId",
                "branchId",
                "createdAt",
                "type",
                "notificationId",
                "read",
              ]);
              notifications.push(decryptedDocument);
            }
          });

          if (notifications.length > 0) {
            console.log(`Notification length ${notifications.length}`);
            notifications.forEach((notification) => {
              ws.send(
                JSON.stringify({ type: "notification", data: notification })
              );
            });
          }
        } catch (error) {
          console.error("Error processing notification data:", error.message);
          ws.send(
            JSON.stringify({
              error: "Failed to process notification data updates",
            })
          );
        }
      });
    } catch (error) {
      console.error("Error fetching notification updates:", error.message);
      ws.send(
        JSON.stringify({ error: "Failed to fetch notification updates" })
      );
    }

    ws.on("close", () => {
      console.log("WebSocket connection closed");
      if (unsubscribePatients) {
        unsubscribePatients();
        console.log("Unsubscribed from Firestore patient updates");
      }
      if (unsubscribeNotifications) {
        unsubscribeNotifications();
        console.log("Unsubscribed from Firestore notification updates");
      }
    });
  });

  wss.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
};

module.exports = { startWebSocketServer };
