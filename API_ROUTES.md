# API Routes Documentation

## Authentication Routes

### POST /api/auth/register
**Purpose:** Register a new user account
**Method:** POST
**Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "user"
  }
}
```

### POST /api/auth/signin (NextAuth)
**Purpose:** Sign in user
**Method:** POST
**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Response:** NextAuth session

## Card Design Routes

### GET /api/cards
**Purpose:** Get all active card designs with optional filtering
**Method:** GET
**Query Parameters:**
- `category` (optional): Filter by category
**Response:**
```json
[
  {
    "_id": "string",
    "name": "string",
    "description": "string",
    "category": "string",
    "templateImage": "string",
    "price": number,
    "isActive": boolean,
    "createdBy": "string",
    "createdAt": "date"
  }
]
```

### POST /api/cards
**Purpose:** Create a new card design (Admin only)
**Method:** POST
**Body:**
```json
{
  "name": "string",
  "description": "string",
  "category": "string",
  "templateImage": "string",
  "price": number,
  "createdBy": "string"
}
```
**Response:** Card design object

### GET /api/cards/[id]
**Purpose:** Get a specific card design
**Method:** GET
**Response:** Card design object

### PUT /api/cards/[id]
**Purpose:** Update a card design (Admin only)
**Method:** PUT
**Body:** Partial card design object
**Response:** Updated card design object

### DELETE /api/cards/[id]
**Purpose:** Delete a card design (Admin only)
**Method:** DELETE
**Response:**
```json
{
  "message": "Card deleted successfully"
}
```

## Customization Routes

### GET /api/customizations
**Purpose:** Get user's customizations
**Method:** GET
**Response:** Array of customization objects

### POST /api/customizations
**Purpose:** Save a new customization
**Method:** POST
**Body:**
```json
{
  "cardDesign": "string",
  "canvasData": {},
  "previewImage": "string"
}
```
**Response:** Customization object

### GET /api/customizations/[id]
**Purpose:** Get a specific customization
**Method:** GET
**Response:** Customization object

## Cart Routes

### GET /api/cart
**Purpose:** Get user's cart items
**Method:** GET
**Response:** Array of cart items with populated customization data

### POST /api/cart
**Purpose:** Add item to cart
**Method:** POST
**Body:**
```json
{
  "customization": "string",
  "quantity": number
}
```
**Response:** Cart item object

### PUT /api/cart/[id]
**Purpose:** Update cart item quantity
**Method:** PUT
**Body:**
```json
{
  "quantity": number
}
```
**Response:** Updated cart item object

### DELETE /api/cart/[id]
**Purpose:** Remove item from cart
**Method:** DELETE
**Response:**
```json
{
  "message": "Cart item removed successfully"
}
```

## Order Routes

### GET /api/orders
**Purpose:** Get user's orders
**Method:** GET
**Response:** Array of order objects

### POST /api/orders
**Purpose:** Create a new order
**Method:** POST
**Body:**
```json
{
  "cartItems": [
    {
      "customization": "string",
      "quantity": number
    }
  ],
  "shippingAddress": {
    "name": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "zip": "string",
    "phone": "string"
  },
  "totalPrice": number
}
```
**Response:** Order object

### GET /api/orders/[id]
**Purpose:** Get a specific order
**Method:** GET
**Response:** Order object

### PUT /api/orders/[id]
**Purpose:** Update order status (Admin only)
**Method:** PUT
**Body:**
```json
{
  "status": "string"
}
```
**Response:** Updated order object

## Payment Routes (Optional)

### POST /api/payments/create-order
**Purpose:** Create Razorpay order
**Method:** POST
**Body:**
```json
{
  "amount": number,
  "currency": "INR"
}
```
**Response:** Razorpay order object

### POST /api/payments/verify
**Purpose:** Verify payment
**Method:** POST
**Body:**
```json
{
  "razorpay_order_id": "string",
  "razorpay_payment_id": "string",
  "razorpay_signature": "string"
}
```
**Response:** Payment verification result

## Admin Routes

### GET /api/admin/users
**Purpose:** Get all users (Admin only)
**Method:** GET
**Response:** Array of user objects

### GET /api/admin/orders
**Purpose:** Get all orders (Admin only)
**Method:** GET
**Response:** Array of order objects

### PUT /api/admin/orders/[id]
**Purpose:** Update order status (Admin only)
**Method:** PUT
**Body:**
```json
{
  "status": "string"
}
```
**Response:** Updated order object

## Error Responses

All routes return appropriate HTTP status codes and error messages:

- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error response format:
```json
{
  "message": "Error description"
}
```

## Authentication

Most routes require authentication via NextAuth session. Admin-only routes check for `role: 'admin'` in the user session.

## Rate Limiting

API routes should implement rate limiting to prevent abuse, especially for:
- Authentication endpoints
- Order creation
- Payment endpoints

## CORS

CORS is handled by Next.js configuration for cross-origin requests.
