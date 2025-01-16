const express = require('express')

const router = express.Router();
const {addUserToWaitlist, hello} = require('../Controller/spreadSheetController'); 


router.post('/sheet/submit', addUserToWaitlist);
router.get('/hello', hello);

module.exports = router