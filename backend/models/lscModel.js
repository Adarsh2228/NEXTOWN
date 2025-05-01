// import mongoose from 'mongoose';

// const commentSchema = new mongoose.Schema({
//   text: String,
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' }, // Reference to Business user
//   timestamp: { type: Date, default: Date.now },
// });

// const lscSchema = new mongoose.Schema({
//   postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
//   likes: { type: Number, default: 0 },
//   shares: { type: Number, default: 0 },
//   comments: [commentSchema],
// });

// const LSC = mongoose.model('LSC', lscSchema);
// export default LSC;



import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: String, required: true }, // Changed to string to store business name directly
  timestamp: { type: Date, default: Date.now },
});

const lscSchema = new mongoose.Schema({
  postId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'Post' 
  },
  likes: {
    type: [String],
    default: [],
  },
   // Changed to store business names for simplicity
  shares: { type: Number, default: 0 },
  comments: [commentSchema],
}, { timestamps: true });

// Create a compound index to ensure we have only one LSC document per postId
lscSchema.index({ postId: 1 }, { unique: true });

const LSC = mongoose.model('LSC', lscSchema);

export default LSC;