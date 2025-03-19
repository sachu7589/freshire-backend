const express = require('express');
const router = express.Router();
const { sendEmail } = require('../controllers/EmailControllers');

router.post('/send', sendEmail);

module.exports = router;
