const express = require('express')

const router = express.Router();
const {addUserToWaitlist} = require('../Controller/spreadSheetController'); 


router.post('/sheet/submit', addUserToWaitlist);

module.exports = router