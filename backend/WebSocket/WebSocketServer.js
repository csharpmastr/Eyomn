const WebSocket = require("ws");
const { decryptDocument } = require("../Helper/Helper");
const {
  query,
  where,
  onSnapshot,
  collection,
  doc,
} = require("firebase/firestore");
const {
  patientCol,
  notificationCol,
  dbClient,
} = require("../Config/FirebaseClientSDK");

const startWebSocketServer = () => {
  const wss = new WebSocket.Server({ port: 8080 });

  wss.on("connection", async (ws, req) => {
    console.log("New WebSocket connection");
    const urlParts = req.url.split("/");

    const organizationId = urlParts[1];
    const branchId = urlParts[2];
    const staffId = urlParts[3];

    let unsubscribePatients, unsubscribeNotifications;
    const sentPatientIds = new Set();
    try {
      const patientQuery = query(
        patientCol,

        where("doctorId", "==", staffId)
      );

      unsubscribePatients = onSnapshot(patientQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const patientId = change.doc.id;

          if (change.type === "added") {
            const newPatient = change.doc.data();
            const decryptedPatientData = decryptDocument(newPatient, [
              "patientId",
              "branchId",
              "doctorId",
              "organizationId",
              "createdAt",
              "isDeleted",
            ]);
            if (!sentPatientIds.has(patientId)) {
              ws.send(
                JSON.stringify({ type: "patient", data: decryptedPatientData })
              );
              sentPatientIds.add(patientId);
            }
          }
        });
      });

      const notificationRef = collection(dbClient, "notification");
      const staffRef = doc(notificationRef, staffId);
      const notifsRef = collection(staffRef, "notifs");
      const notificationQuery = query(
        notifsRef,
        where("doctorId", "==", staffId)
      );

      unsubscribeNotifications = onSnapshot(notificationQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const notificationData = change.doc.data();
            ws.send(
              JSON.stringify({ type: "notification", data: notificationData })
            );
          }
        });
      });
    } catch (error) {
      console.error("Error fetching real-time updates:", error.message);
      ws.send(JSON.stringify({ error: "Failed to fetch real-time updates" }));
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
