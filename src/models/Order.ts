import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
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
  customization: {
    type: Object, // JSON object for user customizations
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentId: {
    type: String,
  },
  shippingAddress: {
    type: Object, // { name, address, city, state, zip, phone }
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
