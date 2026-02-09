import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  eventTime: {
    type: String,
    required: true,
  },
  eventVenue: {
    type: String,
    required: true,
  },
});

const WeddingBookingSchema = new mongoose.Schema({
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CardDesign',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Aspirant (Host) Details
  aspirant: {
    name: {
      type: String,
      required: true,
    },
    relation: {
      type: String,
      enum: ['Father', 'Uncle', 'Family', 'Other'],
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
  },

  // Groom Details
  groom: {
    fullName: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
    motherName: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      default: '',
    },
  },

  // Bride Details
  bride: {
    fullName: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
    motherName: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      default: '',
    },
  },

  // Wedding Details
  wedding: {
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    venueName: {
      type: String,
      required: true,
    },
    fullAddress: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    googleMapLink: {
      type: String,
      default: '',
    },
  },

  // Events List
  events: [EventSchema],

  // Invitation Messages
  messages: {
    familyInvitation: {
      type: String,
      default: '',
    },
    religiousQuote: {
      type: String,
      default: '',
    },
    specialMessage: {
      type: String,
      default: '',
    },
  },

  // Theme Settings
  theme: {
    cardTheme: {
      type: String,
      enum: ['Royal', 'Floral', 'Modern', 'Traditional'],
      default: 'Royal',
    },
    language: {
      type: String,
      enum: ['Hindi', 'English', 'Hinglish'],
      default: 'Hinglish',
    },
    colorTheme: {
      type: String,
      default: '#D4AF37', // Gold
    },
    backgroundMusic: {
      type: String,
      default: '',
    },
  },

  // Pricing and Payment
  price: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  razorpayOrderId: {
    type: String,
    default: '',
  },
  razorpayPaymentId: {
    type: String,
    default: '',
  },

  // Generated Content
  orderId: {
    type: String,
    unique: true,
  },
  pdfUrl: {
    type: String,
    default: '',
  },
  shareSlug: {
    type: String,
    unique: true,
  },

  // Status
  status: {
    type: String,
    enum: ['draft', 'confirmed', 'completed'],
    default: 'draft',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate unique order ID and share slug before saving
WeddingBookingSchema.pre('save', function(next) {
  if (this.isNew) {
    // Generate order ID
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    this.orderId = `WED${timestamp}${random}`;

    // Generate share slug from groom and bride names
    if (!this.groom?.fullName || !this.bride?.fullName) {
      return next(new Error('Groom and bride names are required'));
    }
    const groomName = this.groom.fullName.split(' ')[0].toLowerCase();
    const brideName = this.bride.fullName.split(' ')[0].toLowerCase();
    this.shareSlug = `${groomName}-${brideName}-${Date.now().toString().slice(-4)}`;
  }
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.WeddingBooking || mongoose.model('WeddingBooking', WeddingBookingSchema);
