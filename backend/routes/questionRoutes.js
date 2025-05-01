const express = require('express');
const Question = require('../models/Question');
const router = express.Router();

// Create a new question
router.post('/', async (req, res) => {
  try {
    const { content, category, userEmail } = req.body;
    if (!content || !category || !userEmail) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const question = new Question({ content, category, userEmail });
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating question' });
  }
});

// Get all questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

// Get questions by category
router.get('/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const questions = await Question.find({ category }).sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching questions by category' });
  }
});

module.exports = router;