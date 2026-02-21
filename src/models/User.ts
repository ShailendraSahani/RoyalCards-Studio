import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'seller'],
    default: 'user',
  },
  // Seller specific fields
  isSeller: {
    type: Boolean,
    default: false,
  },
  sellerRequestStatus: {
    type: String,
    enum: ['none', 'pending', 'approved', 'rejected'],
    default: 'none',
  },
  shopName: {
    type: String,
    default: '',
  },
  shopDescription: {
    type: String,
    default: '',
  },
  businessAddress: {
    type: String,
    default: '',
  },
  gstNumber: {
    type: String,
    default: '',
  },
  sellerRequestedAt: {
    type: Date,
  },
  sellerApprovedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
