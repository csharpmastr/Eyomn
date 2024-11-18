require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const { startWebSocketServer } = require("./WebSocket/WebSocketServer");
const cors = require("cors");
const app = express();
const port = process.env.PORT;

//Routes
const sheetRoutes = require("./Route/spreadSheetRoute");
const userRoutes = require("./Route/userRoute");
const patientRoutes = require("./Route/patientRoute");
const organizationRoute = require("./Route/organizationRoute");
const appointmentRoute = require("./Route/appointmentRoute");
const inventoryRoute = require("./Route/inventoryRoute");
const notificationRoute = require("./Route/notificationRoute");
//Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api", sheetRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/patient", patientRoutes);
app.use("/api/v1/organization", organizationRoute);
app.use("/api/v1/appointment", appointmentRoute);
app.use("/api/v1/inventory", inventoryRoute);
app.use("/api/v1/notification", notificationRoute);

app.get("/", (req, res) => {
  return res.send("Server Confirmed!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
startWebSocketServer();
