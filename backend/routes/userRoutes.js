

// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController'); // Ensure this path is correct

// // Route for user registration
// router.post('/register', userController.register);

// // Route for user login
// router.post('/login', userController.login);

// module.exports = router; // Ensure this exports the router correctly


// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');

// // Route for user registration
// router.post('/register', userController.register);

// // Route for user login
// router.post('/login', userController.login);

// module.exports = router;


import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

// Route for user registration
router.post('/register', userController.register);

// Route for user login
router.post('/login', userController.login);

// Route to get user by ID
router.get('/:userId', userController.getUserById);

export default router;
