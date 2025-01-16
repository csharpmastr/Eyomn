require("dotenv").config();
const express = require("express");
const { decryptDocument } = require("../Helper/Helper");
const {
  query,
  where,
  onSnapshot,
  collection,
  doc,
} = require("firebase/firestore");
const { notificationCol, dbClient } = require("../Config/FirebaseClientSDK");

const sseConnections = {};
let cachedNotifications = {};

const startBranchSSEServer = (app) => {
  app.get("/sse-branch/:branchId", (req, res) => {
    const { branchId } = req.params;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    if (!sseConnections[branchId]) sseConnections[branchId] = [];
    sseConnections[branchId].push(res);

    console.log(`SSE connection established for branch ${branchId}`);

    const keepAlive = setInterval(() => {
      res.write(`: ping\n\n`);
    }, 15000);

    let unsubscribeNotifications;

    try {
      // Send cached notifications if available
      if (cachedNotifications[branchId]) {
        res.write(
          `data: ${JSON.stringify({
            type: "notification",
            data: cachedNotifications[branchId],
          })}\n\n`
        );
      }

      // Firestore notifications listener for the branch
      const notificationsQuery = query(
        collection(notificationCol, `${branchId}/notifs`)
      );

      unsubscribeNotifications = onSnapshot(notificationsQuery, (snapshot) => {
        const notifications = [];
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added" || change.type === "modified") {
            const notificationData = change.doc.data();
            const decryptedNotification = decryptDocument(notificationData, [
              "notificationId",
              "branchId",
              "createdAt",
              "type",
              "read",
              "notificationId",
              "requestId",
              "requesting",
            ]);
            notifications.push({
              ...decryptedNotification,
              notificationId: change.doc.id,
            });
          }
        });
        if (notifications.length > 0) {
          cachedNotifications[branchId] = notifications;
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
      console.log(`SSE connection closed for branch ${branchId}`);
      clearInterval(keepAlive);

      if (unsubscribeNotifications) unsubscribeNotifications();

      sseConnections[branchId] = sseConnections[branchId].filter(
        (conn) => conn !== res
      );
    });
  });
};

module.exports = { startBranchSSEServer, cachedNotifications };
