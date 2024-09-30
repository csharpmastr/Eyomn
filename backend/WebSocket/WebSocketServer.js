const WebSocket = require("ws");
const { getPatients } = require("../Helper/Helper");
const { getVisit } = require("../Helper/Helper");
const { query, where, onSnapshot } = require("firebase/firestore");
const { patientCol } = require("../Config/FirebaseClientSDK");
const { decryptData } = require("../Security/DataHashing");

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
      const patients = await getPatients(staffId, branchId, "2");

      for (const patient of patients) {
        const visits = await getVisit(patient.patientId, staffId);
        patient.visits = visits;

        if (!sentPatientIds.has(patient.patientId)) {
          ws.send(JSON.stringify(patient));
          sentPatientIds.add(patient.patientId);
        }
      }

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
            const decryptedPatientData = {};

            for (const [key, value] of Object.entries(newPatient)) {
              if (
                key !== "patientId" &&
                key !== "branchId" &&
                key !== "doctorId" &&
                key !== "organizationId" &&
                key !== "createdAt" &&
                key !== "isDeleted"
              ) {
                decryptedPatientData[key] = decryptData(value);
              } else {
                decryptedPatientData[key] = value;
              }
            }

            if (!sentPatientIds.has(patientId)) {
              ws.send(JSON.stringify(decryptedPatientData));
              sentPatientIds.add(patientId);
            }
          }
        });
        console.log(sentPatientIds);
      });

      console.log(sentPatientIds);
    } catch (error) {
      console.error("Error fetching patients:", error.message);
      ws.send(JSON.stringify({ error: "Failed to fetch patients" }));
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
