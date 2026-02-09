import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cardDesign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CardDesign',
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Cart || mongoose.model('Cart', CartSchema);
