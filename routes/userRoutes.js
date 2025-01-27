const express = require('express');
const { createUser, loginUser, getEmployees, updateEmployeeStatus } = require('../controllers/userController');

const router = express.Router();

// Route to create a new user
router.post('/register', createUser);

// Route for user login
router.post('/login', loginUser);

// Route to get all employees
router.get('/employees', getEmployees);

// Route to update employee status
router.put('/employees/:employeeId', updateEmployeeStatus);


module.exports = router;
