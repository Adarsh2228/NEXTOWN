import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  description: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  discount: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  imageUrl: { type: String, required: true },
});

export const Service = mongoose.model('Service', serviceSchema);