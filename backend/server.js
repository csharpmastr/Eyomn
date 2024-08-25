require('dotenv').config();
const express = require('express');
const sheetRoutes = require('./Route/spreadSheetRoute'); 
const cors = require('cors')
const app = express();
const port = process.env.PORT;

//Middleware
app.use(express.json());
app.use(cors());

app.use('/api', sheetRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
