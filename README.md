---

```markdown
# 🛒 E-COM-API

A modular and scalable backend API for an e-commerce platform, built with Node.js, Express.js, and MongoDB. This project supports user authentication, product management, cart operations, and order processing, providing a robust foundation for full-stack e-commerce applications.

---

## 🚀 Features

- 🔐 **User Authentication & Authorization**
  - JWT-based login and protected routes
  - User role handling (admin/user)

- 📦 **Product Management**
  - Add, edit, delete, and fetch products
  - Product details with price, stock, and description

- 🛒 **Cart Functionality**
  - Add/remove items to/from cart
  - Update quantity, view cart contents

- 📦 **Order Management**
  - Checkout process and order placement
  - Order retrieval per user/admin

- 🧱 **Modular Code Structure**
  - Clean separation of concerns using routes, controllers, and models

---

## 🧰 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose)
- **Authentication:** JWT, bcrypt
- **Validation:** express-validator
- **Environment Variables:** dotenv

---

## 📂 Folder Structure

```

E-COM-API/
├── config/           # DB connection and JWT config
├── controllers/      # All business logic
├── middleware/       # Authentication middleware
├── models/           # Mongoose schemas
├── routes/           # API route definitions
├── utils/            # Utility functions
├── .env              # Environment config
└── server.js         # Entry point

````

---

## ⚙️ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/ATUL-SUNIL/E-COM-API.git
cd E-COM-API
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

Create a `.env` file in the root with the following:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Run the Server

```bash
npm start
```

Server will start at `http://localhost:5000`

---

## 📮 API Endpoints Overview

| Method | Route                | Description               |
| ------ | -------------------- | ------------------------- |
| POST   | `/api/auth/register` | Register a new user       |
| POST   | `/api/auth/login`    | Login and get JWT token   |
| GET    | `/api/products`      | Get all products          |
| POST   | `/api/products`      | Add a new product (admin) |
| POST   | `/api/cart`          | Add item to cart          |
| GET    | `/api/cart`          | View user's cart          |
| POST   | `/api/order`         | Place an order            |

---

## 🧪 Testing

Use Postman or Thunder Client to test API endpoints. Make sure to include the JWT token in headers for protected routes.

---

## 📌 Future Improvements

* Integrate Stripe/PayPal payment API
* Add user profile and address management
* Implement order history and tracking
* Add product categories and search filtering

---



