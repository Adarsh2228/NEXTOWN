// const express = require('express');
// const { createPost, getPostsByBusiness, getAllPosts } = require('../controllers/postController');
// const router = express.Router();
// const multer = require('multer');

// // Set up storage for multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   },
// });

// const upload = multer({ storage });

// // Route to create a post (with file upload)
// router.post('/', upload.single('media'), createPost);

// // Route to get all posts
// router.get('/', getAllPosts); // New route for getting all posts

// // Route to get posts by business ID
// router.get('/business/:id', getPostsByBusiness);

// module.exports = router;



import express from 'express';
import multer from 'multer';
import { createPost, getAllPosts, getPostsByBusiness } from '../controllers/postController.js';

const router = express.Router();

// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Route to create a post (with file upload)
router.post('/', upload.single('media'), createPost);

// Route to get all posts
router.get('/', getAllPosts);

// Route to get posts by business ID
router.get('/business/:id', getPostsByBusiness);

export default router;
