const WebSocket = require("ws");
const { decryptDocument } = require("../Helper/Helper");
const { query, where, onSnapshot } = require("firebase/firestore");
const { patientCol } = require("../Config/FirebaseClientSDK");

const startWebSocketServer = () => {
  const wss = new WebSocket.Server({ port: 8080 });

  wss.on("connection", async (ws, req) => {
    console.log("New WebSocket connection");
    const urlParts = req.url.split("/");

    const organizationId = urlParts[1];
    const branchId = urlParts[2];
    const staffId = urlParts[3];

    let unsubscribe;
    const sentPatientIds = new Set();

    try {
      // Set up a Firestore query to listen for real-time updates
      const q = query(
        patientCol,
        where("branchId", "==", branchId),
        where("doctorId", "==", staffId)
      );

      unsubscribe = onSnapshot(q, (snapshot) => {
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
              ws.send(JSON.stringify(decryptedPatientData));
              sentPatientIds.add(patientId);
            }
          }
        });
      });
    } catch (error) {
      console.error("Error fetching real-time patient updates:", error.message);
      ws.send(JSON.stringify({ error: "Failed to fetch real-time updates" }));
    }

    ws.on("close", () => {
      console.log("WebSocket connection closed");
      if (unsubscribe) {
        unsubscribe();
        console.log("Unsubscribed from Firestore updates");
      }
    });
  });

  wss.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
};

module.exports = { startWebSocketServer };
