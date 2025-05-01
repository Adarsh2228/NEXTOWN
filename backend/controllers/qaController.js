import Question from '../models/qaModel.js';

// Get all questions
export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 }); // Optional: sorted latest first
    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'An error occurred while fetching questions.' });
  }
};

// Post a new question
export const postQuestion = async (req, res) => {
  try {
    const { businessId, question, userEmail, category } = req.body;

    if (!question || !category) {
      return res.status(400).json({ error: 'Question and category are required.' });
    }

    if (!businessId && !userEmail) {
      return res.status(400).json({ error: 'Either businessId or userEmail is required.' });
    }

    const newQuestion = new Question({
      businessId,
      question,
      userEmail,
      category,
    });

    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error('Error posting question:', error);
    res.status(500).json({ error: 'An error occurred while posting the question.' });
  }
};

// Post a new answer
export const postAnswer = async (req, res) => {
  try {
    const { questionId, answer, userEmail } = req.body;

    if (!questionId || !answer || !userEmail) {
      return res.status(400).json({ error: 'Question ID, answer, and userEmail are required.' });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    question.answers.push({ answer, userEmail });
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    console.error('Error posting answer:', error);
    res.status(500).json({ error: 'An error occurred while posting the answer.' });
  }
};
