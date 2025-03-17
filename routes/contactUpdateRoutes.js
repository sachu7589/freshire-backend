const express = require('express');
const router = express.Router();
const { getContactUpdates, createContactUpdate, updateView } = require('../controllers/contactUpdateController');

// Get all contact updates
router.get('/', getContactUpdates);

// Create new contact update
router.post('/', createContactUpdate);

// Update view count
router.patch('/:id/view/:viewValue', updateView);


module.exports = router;