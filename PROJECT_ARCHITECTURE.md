# Project Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Online Marriage Card Booking System               │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                          Frontend Layer (Next.js)                       │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │ │
│  │  │   User Module   │  │  Admin Module   │  │   Components    │         │ │
│  │  │                 │  │                 │  │                 │         │ │
│  │  │ • Dashboard     │  │ • Admin Panel   │  │ • Fabric.js     │         │ │
│  │  │ • Card Browser  │  │ • User Mgmt     │  │   Editor        │         │ │
│  │  │ • Customizer    │  │ • Order Mgmt    │  │ • Three.js      │         │ │
│  │  │ • Cart          │  │ • Card Mgmt     │  │   3D Preview    │         │ │
│  │  │ • Checkout      │  │                 │  │ • Auth Forms    │         │ │
│  │  │ • Orders        │  │                 │  │                 │         │ │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                        API Routes Layer (Next.js)                      │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │ │
│  │  │   Auth APIs     │  │   Card APIs     │  │   Order APIs    │         │ │
│  │  │                 │  │                 │  │                 │         │ │
│  │  │ • /api/auth/*   │  │ • /api/cards/*  │  │ • /api/orders/* │         │ │
│  │  │ • Register      │  │ • CRUD          │  │ • Create/Update │         │ │
│  │  │ • Login         │  │ • Categories    │  │ • Status        │         │ │
│  │  │ • Session       │  │                 │  │                 │         │ │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘         │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │ │
│  │  │ Cart APIs       │  │ Customization   │  │ Payment APIs    │         │ │
│  │  │                 │  │ APIs            │  │ (Optional)      │         │ │
│  │  │ • /api/cart/*   │  │ • /api/custom/* │  │ • Razorpay      │         │ │
│  │  │ • Add/Remove    │  │ • Save/Load     │  │ • Integration   │         │ │
│  │  │ • Update Qty    │  │ • Preview       │  │                 │         │ │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                       Database Layer (MongoDB)                         │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │ │
│  │  │   Users         │  │   Card Designs  │  │   Orders        │         │ │
│  │  │                 │  │                 │  │                 │         │ │
│  │  │ • Auth data     │  │ • Templates     │  │ • Transactions  │         │ │
│  │  │ • Roles         │  │ • Categories    │  │ • Status        │         │ │
│  │  │ • Profile       │  │ • Pricing       │  │ • Shipping      │         │ │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘         │ │
│  │  ┌─────────────────┐  ┌─────────────────┐                             │ │
│  │  │ Customizations  │  │   Cart          │                             │ │
│  │  │                 │  │                 │                             │ │
│  │  │ • Canvas data   │  │ • Items         │                             │ │
│  │  │ • Previews      │  │ • Quantities    │                             │ │
│  │  │ • User edits    │  │ • Totals        │                             │ │
│  │  └─────────────────┘  └─────────────────┘                             │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                      External Services (Optional)                      │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │ │
│  │  │   Razorpay      │  │   Email Service │  │   File Storage  │         │ │
│  │  │   Payment       │  │   (SendGrid)    │  │   (AWS S3)      │         │ │
│  │  │   Gateway       │  │                 │  │                 │         │ │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘

Data Flow:
1. User interacts with Frontend (React components)
2. Frontend makes API calls to Next.js API routes
3. API routes interact with MongoDB via Mongoose models
4. External services handle payments, emails, file storage
5. Responses flow back through the same layers

Key Technologies:
• Frontend: Next.js 14, React, TypeScript, Tailwind CSS
• Backend: Next.js API Routes, NextAuth.js
• Database: MongoDB with Mongoose ODM
• Editor: Fabric.js for 2D canvas editing
• 3D: Three.js for card previews
• Payment: Razorpay integration
• Authentication: JWT with NextAuth
• State Management: React hooks and context

Security Layers:
• Authentication: NextAuth with JWT
• Authorization: Role-based access control
• API Security: CORS, rate limiting, input validation
• Data Security: Password hashing, data encryption
• Network Security: HTTPS, secure headers

Scalability Considerations:
• Database indexing for query optimization
• API rate limiting and caching
• CDN for static assets
• Horizontal scaling with load balancers
• Database sharding for large datasets
```

## Architecture Overview

### 1. **Frontend Layer (Client-Side)**
- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React hooks and Context API
- **Components:**
  - User authentication forms
  - Card browsing and filtering
  - Fabric.js canvas editor
  - Three.js 3D preview
  - Shopping cart and checkout
  - Admin dashboard

### 2. **API Layer (Server-Side)**
- **Framework:** Next.js API Routes
- **Authentication:** NextAuth.js with JWT
- **Validation:** Built-in request validation
- **Endpoints:** RESTful API design
- **Middleware:** Authentication, authorization, CORS

### 3. **Database Layer**
- **Database:** MongoDB
- **ODM:** Mongoose
- **Schema Design:** Normalized collections
- **Indexing:** Optimized for query performance
- **Connection:** Connection pooling and caching

### 4. **External Integrations**
- **Payment:** Razorpay (optional)
- **Email:** SendGrid or similar (optional)
- **File Storage:** AWS S3 or local storage
- **Analytics:** Google Analytics (optional)

## Component Architecture

### Frontend Components Hierarchy
```
App
├── Layout
│   ├── Header
│   ├── Navigation
│   └── Footer
├── Auth
│   ├── SignIn
│   ├── SignUp
│   └── ProtectedRoute
├── User
│   ├── Dashboard
│   ├── CardBrowser
│   ├── CardCustomizer
│   │   ├── FabricCanvas
│   │   └── ThreePreview
│   ├── Cart
│   ├── Checkout
│   └── Orders
└── Admin
    ├── AdminDashboard
    ├── UserManagement
    ├── OrderManagement
    └── CardManagement
```

### API Routes Structure
```
api/
├── auth/
│   ├── [...nextauth]/
│   └── register/
├── cards/
│   ├── route.ts
│   └── [id]/
├── customizations/
│   ├── route.ts
│   └── [id]/
├── cart/
│   ├── route.ts
│   └── [id]/
├── orders/
│   ├── route.ts
│   └── [id]/
└── payments/ (optional)
    ├── create-order/
    └── verify/
```

## Data Flow Patterns

### User Registration Flow
1. User submits registration form
2. Frontend validates input
3. API route hashes password and creates user
4. NextAuth handles session creation
5. User redirected to dashboard

### Card Customization Flow
1. User selects card design
2. Fabric.js canvas initializes with template
3. User makes edits (text, shapes, colors)
4. Canvas data saved to customizations collection
5. Preview generated and stored
6. User can add to cart or continue editing

### Order Placement Flow
1. User reviews cart items
2. Shipping information collected
3. Order created in database
4. Payment initiated (if enabled)
5. Order status updated
6. Confirmation sent to user

## Security Architecture

### Authentication & Authorization
- **JWT Tokens:** Secure session management
- **Role-Based Access:** User/Admin permissions
- **API Protection:** Route-level authentication
- **Password Security:** bcrypt hashing

### Data Protection
- **Input Validation:** Server and client-side validation
- **SQL Injection Prevention:** Parameterized queries
- **XSS Protection:** Sanitized inputs
- **CSRF Protection:** NextAuth built-in protection

### Network Security
- **HTTPS:** SSL/TLS encryption
- **CORS:** Configured origins
- **Rate Limiting:** API request throttling
- **Security Headers:** Helmet.js integration

## Performance Optimization

### Frontend Optimizations
- **Code Splitting:** Route-based splitting
- **Image Optimization:** Next.js Image component
- **Caching:** Browser caching strategies
- **Lazy Loading:** Component lazy loading

### Backend Optimizations
- **Database Indexing:** Optimized queries
- **Caching:** Redis for session storage
- **Compression:** Response compression
- **Connection Pooling:** Database connections

### CDN & Assets
- **Static Assets:** CDN distribution
- **Image Storage:** Cloud storage optimization
- **Bundle Analysis:** Webpack bundle analyzer

## Deployment Architecture

### Development Environment
- **Local Development:** Next.js dev server
- **Database:** Local MongoDB instance
- **Environment:** .env.local configuration

### Production Environment
- **Hosting:** Vercel, AWS, or similar
- **Database:** MongoDB Atlas or AWS DocumentDB
- **CDN:** Vercel CDN or CloudFront
- **Monitoring:** Application performance monitoring

### CI/CD Pipeline
- **Version Control:** Git
- **Testing:** Automated test suites
- **Deployment:** Automated deployment
- **Monitoring:** Error tracking and logging

## Scalability Considerations

### Horizontal Scaling
- **Load Balancing:** Multiple server instances
- **Database Sharding:** Data distribution
- **Caching Layer:** Redis cluster
- **CDN:** Global content delivery

### Database Scaling
- **Read Replicas:** Query distribution
- **Indexing Strategy:** Optimized indexes
- **Connection Pooling:** Efficient connections
- **Backup Strategy:** Automated backups

### Monitoring & Alerting
- **Application Metrics:** Response times, error rates
- **Database Metrics:** Query performance, connection counts
- **Infrastructure:** Server resources, network traffic
- **User Experience:** Real user monitoring
