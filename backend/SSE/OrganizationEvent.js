const { query, where, onSnapshot, collection } = require("firebase/firestore");
const {
  inventoryCol,
  organizationCol,
  notificationCol,
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
                  console.log("Document ID:", change.doc.id);
                  console.log("Document Data:", change.doc.data());
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
                        branchId,
                        id: docId,
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
                        branchId,
                      },
                    };
                  } else if (subcollection === "purchases") {
                    responseData = {
                      type: subcollection,
                      data: {
                        ...docData,
                        branchId,
                        id: docId,
                      },
                    };
                  }

                  if (sseConnections[role] && sseConnections[role][id]) {
                    sseConnections[role][id].forEach((client) => {
                      if (client.writable) {
                        client.write(
                          `data: ${JSON.stringify(responseData)}\n\n`
                        );
                      }
                    });
                  }

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

      // Add notifications listener
      const notificationsQuery = query(
        collection(notificationCol, `${id}/notifs`)
      );

      const unsubscribeNotifications = onSnapshot(
        notificationsQuery,
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const notificationData = change.doc.data();
            const decryptedNotification = decryptDocument(notificationData, [
              "createdAt",
              "notificationId",
              "read",
              "requesting",
              "type",
              "requestId",
            ]);
            const responseData = {
              type: "notification",
              data: decryptedNotification,
            };

            if (sseConnections[role] && sseConnections[role][id]) {
              sseConnections[role][id].forEach((client) => {
                if (client.writable) {
                  client.write(`data: ${JSON.stringify(responseData)}\n\n`);
                }
              });
            }

            if (!cachedData[id]) cachedData[id] = {};
            if (!cachedData[id].notifications)
              cachedData[id].notifications = [];
            cachedData[id].notifications.push(responseData);
          });
        }
      );

      unsubscribeListeners.push(
        unsubscribeOrgSnapshot,
        unsubscribeNotifications
      );

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
