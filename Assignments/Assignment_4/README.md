# Stone Island eCommerce Application

A complete eCommerce application built with Express.js, EJS templating, and MongoDB for the Stone Island brand.

## Features

### 🛒 Shopping Cart System
- Add products to cart from product listings
- Update quantities and remove items
- Cart persistence using session storage
- Real-time cart total calculation

### 🔐 User Authentication
- User registration and login
- Session-based authentication
- Password hashing with bcrypt
- Protected routes for authenticated users

### 💳 Checkout Process
- Complete checkout flow with user details
- Cash on Delivery payment option
- Order confirmation and tracking
- Order history for logged-in users

### 📦 Order Management
- Order placement with unique order numbers
- Order status tracking (pending, confirmed, shipped, delivered)
- Detailed order history view
- User-specific order filtering

### 🎨 Frontend
- Responsive design matching Stone Island aesthetic
- Dynamic product rendering from database
- Flash messages for user feedback
- Smooth animations and interactions

## Technology Stack

- **Backend**: Express.js, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Template Engine**: EJS with express-ejs-layouts
- **Authentication**: express-session, bcryptjs
- **Frontend**: Bootstrap 5, jQuery
- **Session Store**: connect-mongo

## Project Structure

```
Lab_Task_1/
├── public/
│   ├── Images/           # Product and site images
│   ├── styles.css        # Custom CSS
│   └── script.js         # Frontend JavaScript
├── views/
│   ├── layouts/
│   │   └── layout.ejs    # Main layout template
│   ├── StoneIsland.ejs   # Homepage
│   ├── login.ejs         # Login page
│   ├── register.ejs      # Registration page
│   ├── cart.ejs          # Shopping cart
│   ├── checkout.ejs      # Checkout page
│   ├── orders.ejs        # Order history
│   └── 404.ejs           # Error page
├── models/
│   ├── User.js           # User model
│   ├── Product.js        # Product model
│   └── Order.js          # Order model
├── routes/
│   ├── index.js          # Main routes
│   ├── auth.js           # Authentication routes
│   ├── cart.js           # Cart management
│   ├── checkout.js       # Checkout process
│   └── orders.js         # Order management
├── middleware/
│   └── auth.js           # Authentication middleware
├── data/                 # MongoDB data storage
├── server.js             # Main application file
├── package.json          # Dependencies
└── README.md             # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start MongoDB
```bash
# Local MongoDB
mongod --dbpath ./data

# Or use MongoDB Atlas (update connection string in server.js)
```

### 3. Start the Application
```bash
npm start
```

### 4. Access the Application
Visit `http://localhost:3000` in your browser

## Usage

### For Customers
1. **Browse Products**: View the Stone Island product catalog on the homepage
2. **Add to Cart**: Click "Add to Cart" on any product
3. **Manage Cart**: Visit `/cart` to update quantities or remove items
4. **Register/Login**: Create an account or login to proceed with checkout
5. **Checkout**: Fill in shipping details and place order with cash on delivery
6. **Track Orders**: View order history at `/orders`

### For Administrators
- Monitor orders in the database
- Update order statuses manually
- Manage product inventory through the database

## API Endpoints

### Authentication
- `GET /auth/login` - Login page
- `POST /auth/login` - Process login
- `GET /auth/register` - Registration page
- `POST /auth/register` - Process registration
- `GET /auth/logout` - Logout user

### Cart Management
- `GET /cart` - View cart
- `POST /cart/add/:productId` - Add item to cart
- `PUT /cart/update/:productId` - Update item quantity
- `DELETE /cart/remove/:productId` - Remove item from cart
- `DELETE /cart/clear` - Clear entire cart

### Checkout & Orders
- `GET /checkout` - Checkout page (requires login)
- `POST /checkout/place-order` - Place order
- `GET /orders` - View order history (requires login)
- `GET /orders/:orderId` - View specific order details

## Database Schema

### Users Collection
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  phone: String,
  address: String,
  createdAt: Date
}
```

### Products Collection
```javascript
{
  name: String,
  price: Number,
  description: String,
  image: String,
  category: String,
  inStock: Boolean,
  createdAt: Date
}
```

### Orders Collection
```javascript
{
  userEmail: String,
  userName: String,
  userPhone: String,
  userAddress: String,
  items: [{
    productId: ObjectId,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  totalAmount: Number,
  status: String,
  paymentMethod: String,
  orderNumber: String (unique),
  createdAt: Date
}
```

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- Protected routes with middleware
- Input validation and sanitization
- CSRF protection through form tokens

## Future Enhancements

- Admin panel for order management
- Email notifications for order status
- Payment gateway integration
- Product search and filtering
- User profile management
- Wishlist functionality
- Product reviews and ratings

## License

This project is for educational purposes. Stone Island is a registered trademark of its respective owners. 