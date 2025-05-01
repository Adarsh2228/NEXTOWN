


// import express from 'express';
// import {
//   getLSC,
//   likePost,
//   sharePost,
//   commentPost,
// } from '../controllers/lscController.js';

// const router = express.Router();

// router.get('/:postId', getLSC); // Get LSC data for a post
// router.post('/:postId/like', likePost); // Like a post
// router.post('/:postId/share', sharePost); // Share a post
// router.post('/:postId/comment', commentPost); // Comment on a post

// export default router;


import express from 'express';
import {
  getLSC,
  likePost,
  sharePost,
  commentPost,
} from '../controllers/lscController.js';

const router = express.Router();

// LSC routes
router.get('/:postId', getLSC); // Get LSC data for a post
router.post('/:postId/like', likePost); // Like a post
router.post('/:postId/share', sharePost); // Share a post
router.post('/:postId/comment', commentPost); // Comment on a post

export default router;