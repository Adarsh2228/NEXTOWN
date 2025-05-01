

// businessRoutes.js
// const express = require('express');
// const router = express.Router();
// const businessController = require('../controllers/businessController');

// // Route to fetch all businesses
// router.get('/', businessController.getAllBusinesses);

// module.exports = router;


// backend/routes/businessRoutes.js
import express from 'express';
import {
  registerBusiness,
  getAllBusinesses,
  getBusinessProfile,
  getBusinessByName,
  followBusiness,
  createPost,
  createOrder,
} from '../controllers/businessController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to register a business (protected route)
router.post('/register', authMiddleware, registerBusiness);

// Route to fetch all businesses
router.get('/', getAllBusinesses);

// Route to get a business profile by ID
router.get('/:id', getBusinessProfile);

// Route to fetch a business by name
router.get('/name/:name', getBusinessByName);

// Route to follow a business (protected route)
router.post('/:id/follow', authMiddleware, followBusiness);

// Route to create a post for a business (protected route)
router.post('/:id/posts', authMiddleware, createPost);

// Route to create an order for a business (protected route)
router.post('/:id/orders', authMiddleware, createOrder);

export default router;




// const express = require("express");
// const router = express.Router();
// const businessController = require("../controllers/businessController");

// // POST /api/businesses - Register a new business
// router.post("/", businessController.registerBusiness);

// // GET /api/businesses/:id - Get business profile by ID
// router.get("/:id", businessController.getBusinessProfile);

// // GET /api/businesses/name/:name - Get business by name
// router.get("/name/:name", businessController.getBusinessByName);

// // POST /api/businesses/follow/:id - Follow a business
// router.post("/follow/:id", businessController.followBusiness);

// // POST /api/businesses/posts - Create a post for a business
// router.post("/posts", businessController.createPost);

// // POST /api/businesses/orders/:id - Create an order for a business
// router.post("/orders/:id", businessController.createOrder);

// // GET /api/businesses - Get all businesses
// router.get("/", businessController.getAllBusinesses);

// module.exports = router;