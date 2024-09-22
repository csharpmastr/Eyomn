const WebSocket = require("ws");
const { db } = require("../Config/FirebaseConfig");
const {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
} = require("firebase/firestore");
const { decryptData } = require("../Security/DataHashing");

const startWebSocketServer = () => {
  const wss = new WebSocket.Server({ port: 8080 });

  wss.on("connection", (ws) => {
    console.log("New WebSocket connection");
    const existingPatients = new Set();

    ws.on("message", async (message) => {
      try {
        const { clinicId, doctorId } = JSON.parse(message);

        const patientsRef = collection(
          db,
          "clinicPatients",
          clinicId,
          "Patients"
        );
        const patientsQuery = query(
          patientsRef,
          where("doctorId", "==", doctorId)
        );

        const querySnapshot = await getDocs(patientsQuery);
        querySnapshot.forEach((doc) => {
          let data = {
            id: doc.id,
            ...doc.data(),
          };

          Object.keys(data).forEach((key) => {
            if (
              key !== "createdAt" &&
              key !== "doctorId" &&
              key !== "patientId" &&
              key !== "id"
            ) {
              if (data[key]) {
                try {
                  data[key] = decryptData(data[key]);
                } catch (error) {
                  console.error(`Error decrypting field ${key}:`, error);
                  data[key] = "Decryption error";
                }
              }
            }
          });

          existingPatients.add(data.id);

          ws.send(JSON.stringify(data));
        });

        const unsubscribe = onSnapshot(patientsQuery, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            let data;
            if (change.type === "added") {
              // new patient
              data = {
                id: change.doc.id,
                ...change.doc.data(),
              };

              Object.keys(data).forEach((key) => {
                if (
                  key !== "createdAt" &&
                  key !== "doctorId" &&
                  key !== "patientId" &&
                  key !== "id"
                ) {
                  if (data[key]) {
                    try {
                      data[key] = decryptData(data[key]);
                    } catch (error) {
                      console.error(`Error decrypting field ${key}:`, error);
                      data[key] = "Decryption error";
                    }
                  }
                }
              });
              if (!existingPatients.has(data.id)) {
                existingPatients.add(data.id);
                ws.send(JSON.stringify(data));
              }
            }
          });
        });

        ws.on("close", () => {
          unsubscribe();
          console.log("WebSocket connection closed");
        });
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });
};

module.exports = { startWebSocketServer };
