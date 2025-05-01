import express from 'express';
import {
  getQuestions,
  postQuestion,
  postAnswer,
} from '../controllers/qaController.js';

const router = express.Router();

// Q&A Routes
router.get('/questions', getQuestions);       // Get all questions
router.post('/questions', postQuestion);      // Post a new question
router.post('/answers', postAnswer);          // Post a new answer

export default router;
