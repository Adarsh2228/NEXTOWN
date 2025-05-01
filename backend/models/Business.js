import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  category: { type: String, required: true },
  businessName: { type: String, required: true, unique: true },
  businessCode: { type: String, unique: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  shopAddress: { type: String, required: true },
  shopWebsite: { type: String },
  shopDescription: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  createdAt: { type: Date, default: Date.now },
});

const Business = mongoose.model('Business', businessSchema);

export default Business;
