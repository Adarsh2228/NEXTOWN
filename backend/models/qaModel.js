import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  answer: { type: String, required: true },
  userEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  businessId: { type: String }, // Optional
  userEmail: { type: String }, // Optional
  category: { type: String, required: true },
  answers: [answerSchema],
  createdAt: { type: Date, default: Date.now },
});

const Question = mongoose.model('Question', questionSchema);
export default Question;
