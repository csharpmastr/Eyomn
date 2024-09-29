const WebSocket = require("ws");
const { decryptData } = require("../Security/DataHashing");
const { getVisit } = require("../Helper/Helper");
const { getPatients } = require("../Helper/Helper");

const startWebSocketServer = () => {
  const wss = new WebSocket.Server({ port: 8080 });

  wss.on("connection", async (ws, req) => {
    console.log("New WebSocket connection");
    console.log(req.url);

    const urlParts = req.url.split("/");

    const organizationId = urlParts[1];
    const branchId = urlParts[2];
    const staffId = urlParts[3];

    try {
      const patients = await getPatients(staffId, branchId, "2");

      for (const patient of patients) {
        const visits = await getVisit(patient.patientId, staffId);

        patient.visits = visits;

        ws.send(JSON.stringify(patient));
      }
    } catch (error) {
      console.error("Error fetching patients:", error.message);
      ws.send(JSON.stringify({ error: "Failed to fetch patients" }));
    }
    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
  });

  wss.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
};

module.exports = { startWebSocketServer };
