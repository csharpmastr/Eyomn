require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const app = express();
const port = process.env.PORT;

//Routes
const sheetRoutes = require("./Route/spreadSheetRoute");
const userRoutes = require("./Route/userRoute");
const patientRoutes = require("./Route/patientRoute");

//Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api", sheetRoutes);
app.use("/api/user", userRoutes);
app.use("/api/v1/patient", patientRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
