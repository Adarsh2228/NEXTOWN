// const express = require("express");
// const router = express.Router();
// const chatController = require("../controllers/chatController");

// router.post("/send", chatController.sendMessage);
// router.get("/:businessId/:userId", chatController.getMessages);
// router.get("/requests/:businessId", chatController.getChatRequests);

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const chatController = require("../controllers/chatController");

// router.post("/send", chatController.sendMessage);
// router.get("/requests/:businessId", chatController.getChatRequests);
// router.get("/history/:userId/:businessId", chatController.getChatHistory); // New route

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const chatController = require("../controllers/chatController");

// router.post("/send", chatController.sendMessage);
// router.get("/messages/:userId/:businessId", chatController.getMessages); // Updated route
// router.get("/history/:userId/:businessId", chatController.getChatHistory); // New route

// module.exports = router;



import express from 'express';
import {
  sendMessage,
  getMessages,
  getChatHistory,
  getChatRequests
} from '../controllers/chatController.js';

const router = express.Router();

// Send a message
router.post('/send', sendMessage);

// Get messages between user and business
router.get('/messages/:userId/:businessId', getMessages);

// Get chat history
router.get('/history/:userId/:businessId', getChatHistory);

// Get chat requests for a business
router.get('/requests/:businessId', getChatRequests);

export default router;
