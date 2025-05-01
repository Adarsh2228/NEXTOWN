const express = require('express');
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const router = express.Router();

// Create a new answer
router.post('/', async (req, res) => {
  try {
    const { questionId, text, userEmail } = req.body;
    if (!questionId || !text || !userEmail) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newAnswer = new Answer({ questionId, text, userEmail });
    await newAnswer.save();

    // Update the question with the new answer
    await Question.findByIdAndUpdate(questionId, { $push: { answers: newAnswer._id } });

    res.status(201).json(newAnswer);
  } catch (error) {
    console.error('Error posting answer:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all answers for a question
router.get('/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;
    const answers = await Answer.find({ questionId }).sort({ createdAt: -1 });
    res.json(answers);
  } catch (error) {
    console.error('Error fetching answers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;