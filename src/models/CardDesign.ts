import mongoose from 'mongoose';

const CardDesignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['traditional', 'modern', 'elegant', 'fun', 'custom'],
    default: 'traditional',
  },
  templateImage: {
    type: String, // URL or base64 of template image
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  popularity: {
    type: Number,
    default: 0,
  },
  tags: [{
    type: String,
  }],
  dimensions: {
    width: {
      type: Number,
      default: 300,
    },
    height: {
      type: Number,
      default: 400,
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.CardDesign || mongoose.model('CardDesign', CardDesignSchema);
