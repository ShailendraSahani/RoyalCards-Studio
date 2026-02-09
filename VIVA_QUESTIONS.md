# Viva Questions and Answers - Online Marriage Card Booking System

## General Questions

### Q1: What is the main objective of your project?
**Answer:** The main objective of the Online Marriage Card Booking System is to create a digital platform that allows users to browse, customize, and order personalized marriage invitation cards. The system aims to replace traditional manual processes with an intuitive online solution that provides real-time customization capabilities and 3D previews.

### Q2: What technologies have you used in your project?
**Answer:** The project uses Next.js 14 with TypeScript for the frontend and backend, MongoDB for the database, Fabric.js for canvas editing, Three.js for 3D previews, Tailwind CSS for styling, and NextAuth.js for authentication. Optional Razorpay integration for payments.

### Q3: Why did you choose Next.js for this project?
**Answer:** Next.js was chosen because it provides:
- Built-in API routes for backend functionality
- Server-side rendering for better SEO and performance
- TypeScript support for type safety
- App Router for modern React development
- Excellent developer experience and community support

## Technical Questions

### Q4: Explain the role of Fabric.js in your project.
**Answer:** Fabric.js is used for the live canvas customization feature. It provides:
- Interactive canvas for adding text, shapes, and images
- Object manipulation (drag, resize, rotate)
- Layer management and grouping
- Export functionality for generating previews
- Event handling for user interactions

### Q5: How does Three.js contribute to the 3D preview functionality?
**Answer:** Three.js enables 3D visualization of customized cards by:
- Creating 3D card models with proper geometry
- Applying textures and materials
- Implementing lighting and shadows
- Providing camera controls for user interaction
- Rendering the customized design on 3D surfaces

### Q6: Describe your database schema design.
**Answer:** The database uses five main collections:
- **Users:** Authentication and profile data
- **CardDesigns:** Template information and pricing
- **Customizations:** User canvas edits and previews
- **Cart:** Temporary shopping cart items
- **Orders:** Transaction records with shipping details

Relationships are maintained through MongoDB ObjectIds with proper indexing for performance.

### Q7: How have you implemented authentication and authorization?
**Answer:** Authentication is handled using NextAuth.js with:
- Credentials provider for email/password login
- JWT tokens for session management
- Role-based authorization (user/admin)
- Protected routes using Next.js middleware
- Password hashing with bcryptjs

### Q8: Explain the API architecture you have implemented.
**Answer:** The API follows RESTful conventions with:
- Next.js API routes for backend endpoints
- Proper HTTP methods (GET, POST, PUT, DELETE)
- JSON request/response format
- Authentication middleware
- Input validation and error handling
- CORS configuration for security

## Implementation Questions

### Q9: How do you handle state management in the canvas editor?
**Answer:** Canvas state is managed through:
- Fabric.js canvas object for real-time editing
- React state for UI controls
- Debounced save operations to prevent excessive API calls
- Local storage for draft saving
- Synchronization between canvas and 3D preview

### Q10: Describe the checkout and payment flow.
**Answer:** The checkout process includes:
- Cart validation and item confirmation
- Shipping address collection
- Order creation in database
- Optional Razorpay payment integration
- Order status updates
- Email confirmations (if implemented)

### Q11: How do you ensure data security in your application?
**Answer:** Security measures include:
- Input validation and sanitization
- Password hashing with bcrypt
- JWT token-based authentication
- HTTPS encryption
- CORS policy implementation
- SQL injection prevention through parameterized queries
- XSS protection through proper encoding

### Q12: Explain your approach to responsive design.
**Answer:** Responsive design is achieved through:
- Mobile-first approach with Tailwind CSS
- Flexible grid layouts
- Responsive canvas sizing
- Touch-friendly interface elements
- Cross-device testing
- Progressive enhancement strategy

## Database and Backend Questions

### Q13: How do you handle database connections and performance?
**Answer:** Database performance is optimized through:
- Connection pooling with Mongoose
- Proper indexing on frequently queried fields
- Aggregation pipelines for complex queries
- Caching strategies for frequently accessed data
- Database query monitoring and optimization

### Q14: Describe your error handling strategy.
**Answer:** Error handling includes:
- Try-catch blocks in API routes
- Proper HTTP status codes
- User-friendly error messages
- Logging for debugging
- Graceful fallbacks in UI
- Validation error handling

### Q15: How do you manage file uploads and storage?
**Answer:** File handling involves:
- Client-side image validation
- Base64 encoding for canvas exports
- File size and type restrictions
- Storage in database or cloud services
- Image optimization and compression
- Secure file access controls

## Advanced Questions

### Q16: How would you scale this application for high traffic?
**Answer:** Scaling strategies include:
- Horizontal scaling with load balancers
- Database read replicas
- Redis caching layer
- CDN for static assets
- API rate limiting
- Microservices architecture for complex features

### Q17: What are the limitations of your current implementation?
**Answer:** Current limitations include:
- 3D preview limited to basic card models
- No real-time collaboration features
- File upload restricted to images only
- Payment integration is optional
- Limited offline functionality

### Q18: How would you implement real-time features in this application?
**Answer:** Real-time features could be implemented using:
- WebSocket connections (Socket.io)
- Server-sent events for notifications
- Real-time database updates
- Collaborative editing with operational transforms
- Live preview synchronization

### Q19: Describe your testing strategy.
**Answer:** Testing approach includes:
- Unit tests for components and utilities
- Integration tests for API endpoints
- End-to-end tests for user workflows
- Performance testing for load handling
- Cross-browser compatibility testing
- Accessibility testing

### Q20: What are your future plans for this project?
**Answer:** Future enhancements include:
- AI-powered design suggestions
- Advanced 3D card models
- Multi-language support
- Mobile application development
- Integration with printing services
- Advanced analytics and reporting

## Project-Specific Questions

### Q21: How do you synchronize canvas edits with 3D preview?
**Answer:** Synchronization is achieved through:
- Canvas change event listeners
- Debounced update functions
- Texture generation from canvas
- Material updates in Three.js scene
- Performance optimization to maintain smooth interaction

### Q22: Explain the cart and order management workflow.
**Answer:** The workflow follows:
1. User adds customized items to cart
2. Cart persists across sessions
3. Checkout validates cart contents
4. Order created with shipping details
5. Payment processed (if enabled)
6. Order status tracked and updated
7. User receives confirmations

### Q23: How do you handle concurrent user sessions?
**Answer:** Concurrent sessions are managed through:
- Unique session identifiers
- Database transaction handling
- Optimistic locking for cart updates
- Real-time conflict resolution
- Session timeout management

### Q24: Describe your deployment strategy.
**Answer:** Deployment involves:
- Vercel/Netlify for frontend hosting
- MongoDB Atlas for database
- Environment variable management
- CI/CD pipeline setup
- Performance monitoring
- Backup and recovery procedures

### Q25: What performance optimizations have you implemented?
**Answer:** Performance optimizations include:
- Code splitting and lazy loading
- Image optimization and compression
- Database query optimization
- Caching strategies
- Bundle size minimization
- CDN integration

## Critical Thinking Questions

### Q26: How would you handle a situation where the canvas becomes unresponsive?
**Answer:** Canvas unresponsiveness would be handled by:
- Error boundaries in React
- Canvas reinitialization
- Fallback to basic editing mode
- User state preservation
- Performance monitoring and alerts
- Graceful degradation strategies

### Q27: What would you do if you discovered a security vulnerability?
**Answer:** Security vulnerability response would include:
- Immediate isolation of affected systems
- Vulnerability assessment and impact analysis
- Patch development and testing
- User notification if data breach occurred
- Security audit and prevention measures
- Incident documentation and lessons learned

### Q28: How would you approach adding a new feature like bulk ordering?
**Answer:** Adding bulk ordering would involve:
- Requirement analysis and user research
- Database schema updates
- API endpoint development
- Frontend component creation
- Testing and validation
- Performance impact assessment
- Documentation updates

### Q29: What metrics would you track for system performance?
**Answer:** Key performance metrics include:
- Page load times and Core Web Vitals
- API response times
- Database query performance
- User session duration
- Error rates and types
- Conversion funnel analytics
- Server resource utilization

### Q30: How would you ensure the system remains maintainable as it grows?
**Answer:** Maintainability is ensured through:
- Modular code architecture
- Comprehensive documentation
- Automated testing suite
- Code review processes
- Version control best practices
- Regular refactoring
- Performance monitoring
- Technical debt management

## Quick Questions (For Time Management)

### Q31: What is the most challenging part of this project?
**Answer:** The most challenging aspect was integrating Fabric.js canvas editing with Three.js 3D preview while maintaining smooth performance across different devices and browsers.

### Q32: What would you do differently if you were to start over?
**Answer:** If starting over, I would:
- Implement more comprehensive testing from the beginning
- Use a more structured state management solution
- Plan for scalability earlier in development
- Include performance monitoring from day one

### Q33: How long did this project take to complete?
**Answer:** The project took approximately [X weeks/months] to complete, including planning, development, testing, and documentation phases.

### Q34: What is your favorite feature of the application?
**Answer:** My favorite feature is the live canvas customization with real-time 3D preview, as it provides users with an intuitive and powerful design experience.

### Q35: How would you explain this project to a non-technical person?
**Answer:** This is like an online store for marriage invitation cards where people can design their own cards using digital tools, see how they'll look in 3D, and order them directly - all from their computer or phone, without visiting a shop.
