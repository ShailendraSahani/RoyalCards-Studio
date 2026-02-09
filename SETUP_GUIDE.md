# Online Marriage Card Booking System - Setup Guide

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or MongoDB Atlas)
- **Git** for version control

## Installation Steps

### 1. Clone or Download the Project

```bash
# If using git
git clone <repository-url>
cd marriage-card-booking

# Or extract the downloaded zip file
unzip marriage-card-booking.zip
cd marriage-card-booking
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- Next.js 14
- React and React DOM
- TypeScript
- Tailwind CSS
- MongoDB/Mongoose
- NextAuth.js
- Fabric.js
- Three.js
- Razorpay (optional)

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/marriage-card-booking

# NextAuth
NEXTAUTH_SECRET=your-super-secret-key-here-change-this-in-production
NEXTAUTH_URL=http://localhost:3000

# Razorpay (Optional - for payment integration)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

**Important:** Replace the placeholder values with actual credentials.

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB Community Server
2. Start MongoDB service
3. Create database: `marriage-card-booking`

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Get connection string and update `MONGODB_URI`

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
marriage-card-booking/
├── src/
│   ├── app/
│   │   ├── api/                 # API routes
│   │   ├── auth/                # Authentication pages
│   │   ├── admin/               # Admin pages
│   │   ├── cards/               # Card browsing pages
│   │   ├── cart/                # Shopping cart
│   │   ├── checkout/            # Checkout process
│   │   ├── customize/           # Customization pages
│   │   └── dashboard/           # User dashboard
│   ├── components/              # Reusable components
│   ├── lib/                     # Utility libraries
│   └── models/                  # Database models
├── public/                      # Static assets
├── .env.local                   # Environment variables
├── package.json                 # Dependencies
├── tailwind.config.js           # Tailwind configuration
├── next.config.js               # Next.js configuration
└── README.md                    # Project documentation
```

## Database Initialization

The application uses Mongoose models that will automatically create collections when first used. However, you may want to seed some initial data:

### Creating an Admin User

1. Start the application
2. Register a normal user account
3. Manually update the user's role in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

### Adding Sample Card Designs

Use the admin panel to add card designs, or insert directly into MongoDB:

```javascript
db.carddesigns.insertMany([
  {
    name: "Classic Wedding",
    description: "Elegant traditional wedding invitation",
    category: "traditional",
    templateImage: "/images/classic-wedding.jpg",
    price: 150,
    isActive: true,
    createdBy: ObjectId("admin-user-id")
  }
])
```

## Key Features Setup

### Canvas Customization (Fabric.js)

The canvas editor is automatically initialized when users visit the card customization page. Key features:

- **Text Addition:** Click "Add Text" to add editable text
- **Shape Tools:** Add rectangles and circles
- **Color Picker:** Change colors of selected objects
- **Save Functionality:** Automatically saves customization

### 3D Preview (Three.js)

The 3D preview component loads when users save their customization. It provides:

- Interactive 3D card model
- Real-time texture updates
- Camera controls for different views

### Payment Integration (Razorpay)

To enable payments:

1. Create a Razorpay account
2. Get API keys from dashboard
3. Update environment variables
4. Payment routes are already implemented in `/api/payments/`

## Testing the Application

### User Flow Testing

1. **Registration:** Visit `/auth/signup` and create an account
2. **Login:** Use `/auth/signin` to log in
3. **Browse Cards:** Visit `/cards` to see available designs
4. **Customize:** Click on a card to open the editor
5. **Add to Cart:** Save customization and add to cart
6. **Checkout:** Complete the order process

### Admin Testing

1. **Admin Login:** Use an account with admin role
2. **Dashboard:** Visit `/admin` for admin panel
3. **Manage Cards:** Add, edit, or delete card designs
4. **Manage Orders:** View and update order status

## API Testing

Use tools like Postman or curl to test API endpoints:

```bash
# Test card fetching
curl http://localhost:3000/api/cards

# Test user registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## Deployment

### Development Deployment

For local development, the setup above is sufficient.

### Production Deployment

#### Vercel Deployment (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically

#### Manual Server Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

3. Configure reverse proxy (nginx/apache)
4. Set up SSL certificate
5. Configure production database

## Troubleshooting

### Common Issues

#### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env.local`
- Verify network access for MongoDB Atlas

#### Authentication Issues
- Check NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

#### Canvas Not Loading
- Check browser console for Fabric.js errors
- Ensure modern browser with Canvas API support
- Verify all dependencies are installed

#### 3D Preview Not Working
- Check browser WebGL support
- Update graphics drivers
- Try different browser

### Performance Optimization

1. **Database Indexing:** Ensure proper indexes are created
2. **Image Optimization:** Use Next.js Image component
3. **Code Splitting:** Routes are automatically code-split
4. **Caching:** Implement appropriate caching strategies

### Security Checklist

- [ ] Change default NEXTAUTH_SECRET
- [ ] Use HTTPS in production
- [ ] Validate all user inputs
- [ ] Implement rate limiting
- [ ] Regular security updates
- [ ] Secure database access

## Support and Documentation

### Documentation Files
- `API_ROUTES.md` - Complete API documentation
- `DATABASE_SCHEMA.md` - Database design details
- `PROJECT_ARCHITECTURE.md` - System architecture
- `PROJECT_REPORT.md` - Comprehensive project report

### Getting Help
- Check browser console for errors
- Review server logs
- Test API endpoints individually
- Check MongoDB connection status

## Next Steps

After successful setup:

1. **Add Sample Data:** Populate with sample card designs
2. **Customize Styling:** Modify Tailwind classes for branding
3. **Add Features:** Implement additional features as needed
4. **Testing:** Perform comprehensive testing
5. **Deployment:** Move to production environment

The application is now ready for development and testing!
