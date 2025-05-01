const Answer = require('../models/Answer');
const Question = require('../models/Question');

// Create a new answer
exports.createAnswer = async (req, res) => {
  try {
    const { content, questionId, userEmail } = req.body;
    const answer = new Answer({ content, questionId, userEmail });
    await answer.save();

    // Update the question with the new answer
    await Question.findByIdAndUpdate(questionId, { $push: { answers: answer._id } });

    res.status(201).json(answer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating answer', error });
  }
};

// Get answers for a specific question
exports.getAnswersByQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const answers = await Answer.find({ questionId });
    res.status(200).json(answers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching answers', error });
  }
};