const mongoose = require('mongoose');

const postReviewSchema = new mongoose.Schema({
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
  content: String,
  images: [String],
  videos: [String],
  reviewed: { type: Boolean, default: false },
  reviewedAt: { type: Date },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const PostReview = mongoose.model('PostReview', postReviewSchema);
module.exports = PostReview;
