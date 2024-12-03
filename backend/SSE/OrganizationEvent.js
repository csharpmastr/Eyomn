const { query, where, onSnapshot, collection } = require("firebase/firestore");
const {
  inventoryCol,
  organizationCol,
} = require("../Config/FirebaseClientSDK");
const { decryptDocument } = require("../Helper/Helper");

const sseConnections = {};
const firstConnectionMap = {};
let unsubscribeListeners = [];

let cachedData = {};

const startOrganizationSSEServer = (app) => {
  app.get("/sse-org/:role/:id", async (req, res) => {
    const { role, id } = req.params;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    if (!sseConnections[role]) sseConnections[role] = {};
    if (!sseConnections[role][id]) sseConnections[role][id] = [];
    sseConnections[role][id].push(res);

    const keepAlive = setInterval(() => {
      res.write(`: ping\n\n`);
    }, 15000);

    const firstConnection = !firstConnectionMap[id];
    if (firstConnection) {
      firstConnectionMap[id] = true;
    }

    if (cachedData[id] && !firstConnection) {
      res.write(`data: ${JSON.stringify(cachedData[id])}\n\n`);
    }

    try {
      const orgRef = query(organizationCol, where("id", "==", id));

      const unsubscribeOrgSnapshot = onSnapshot(orgRef, (snapshot) => {
        if (snapshot.empty) {
          res.write(
            `data: ${JSON.stringify({ error: "Organization not found" })}\n\n`
          );
          return;
        }

        snapshot.forEach((doc) => {
          const data = doc.data();
          const branches = data.branch || [];

          branches.forEach((branchId) => {
            const subcollections = ["products", "purchases", "services"];

            subcollections.forEach((subcollection) => {
              const subcollectionQuery = query(
                collection(inventoryCol, `${branchId}/${subcollection}`)
              );

              const unsubscribe = onSnapshot(subcollectionQuery, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                  const docData = change.doc.data();
                  const docId = change.doc.id;

                  let responseData;

                  if (subcollection === "services") {
                    responseData = {
                      type: subcollection,
                      data: {
                        ...decryptDocument(docData, [
                          "service_price",
                          "date",
                          "createdAt",
                          "doctorId",
                          "patientId",
                        ]),
                        branchId, // Include branchId inside the data
                      },
                    };
                  } else if (subcollection === "products") {
                    responseData = {
                      type: subcollection,
                      data: {
                        ...decryptDocument(docData, [
                          "expirationDate",
                          "price",
                          "quantity",
                          "productId",
                          "productSKU",
                          "isDeleted",
                          "retail_price",
                        ]),
                        branchId, // Include branchId inside the data
                      },
                    };
                  } else {
                    responseData = {
                      type: subcollection,
                      data: {
                        ...docData,
                        branchId, // Include branchId inside the data
                      },
                    };
                  }

                  // send the updated data to connected client
                  if (sseConnections[role] && sseConnections[role][id]) {
                    sseConnections[role][id].forEach((client) => {
                      if (client.writable) {
                        client.write(
                          `data: ${JSON.stringify(responseData)}\n\n`
                        );
                      } else {
                        console.log("Client has disconnected");
                      }
                    });
                  }

                  // cache the response data
                  if (!cachedData[id]) cachedData[id] = {};
                  if (!cachedData[id][branchId]) cachedData[id][branchId] = {};
                  cachedData[id][branchId][subcollection] = responseData;
                });
              });

              unsubscribeListeners.push(unsubscribe);
            });
          });
        });
      });

      unsubscribeListeners.push(unsubscribeOrgSnapshot);

      req.on("close", () => {
        clearInterval(keepAlive);
        unsubscribeListeners.forEach((unsubscribe) => unsubscribe());
        sseConnections[role][id] = sseConnections[role][id].filter(
          (client) => client !== res
        );
        if (sseConnections[role][id].length === 0) {
          delete sseConnections[role][id];
          delete firstConnectionMap[id];
        }
      });
    } catch (error) {
      res.write(
        `data: ${JSON.stringify({ error: "Failed to fetch data" })}\n\n`
      );
    }
  });
};

module.exports = { startOrganizationSSEServer };
