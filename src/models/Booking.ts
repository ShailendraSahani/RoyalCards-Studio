import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
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

  // Host/Aspirant Details
  aspirant: {
    name: {
      type: String,
      required: true,
    },
    relation: {
      type: String,
      required: true,
    },
    hostMessage: {
      type: String,
      default: '',
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
    surname: {
      type: String,
      default: '',
    },
    photoUrl: {
      type: String,
      default: '',
    },
    education: {
      type: String,
      default: '',
    },
    profession: {
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
    surname: {
      type: String,
      default: '',
    },
    photoUrl: {
      type: String,
      default: '',
    },
    education: {
      type: String,
      default: '',
    },
    profession: {
      type: String,
      default: '',
    },
  },

  // Wedding Ceremony Details
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
    venueImage: {
      type: String,
      default: '',
    },
    weddingType: {
      type: String,
      enum: ['Traditional', 'Court', 'Destination'],
      default: 'Traditional',
    },
  },

  // Events List
  events: [{
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
  }],

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

  // Card Design Settings
  theme: {
    cardTheme: {
      type: String,
      enum: ['Royal', 'Floral', 'Modern', 'Traditional', 'Fun'],
      default: 'Royal',
    },
    language: {
      type: String,
      enum: ['Hindi', 'English', 'Hinglish'],
      default: 'Hindi',
    },
    colorTheme: {
      type: String,
      default: '#D4AF37',
    },
    fontStyle: {
      type: String,
      default: 'Traditional',
    },
    backgroundMusic: {
      type: String,
      default: '',
    },
  },

  // Contact Details
  contactDetails: {
    contactPersonName: {
      type: String,
      default: '',
    },
    mobileNumber: {
      type: String,
      default: '',
    },
    whatsappNumber: {
      type: String,
      default: '',
    },
  },

  // Privacy Settings
  privacySettings: {
    isPublic: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      default: '',
    },
    expiryDate: {
      type: Date,
      default: null,
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
BookingSchema.pre('save', function(next) {
  if (this.isNew) {
    // Generate order ID
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    this.orderId = `CARD${timestamp}${random}`;

    // Generate share slug from groom name
    const groomSlug = (this.groom?.fullName || 'groom').split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    this.shareSlug = `${groomSlug}-${Date.now().toString().slice(-4)}`;
  }
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
