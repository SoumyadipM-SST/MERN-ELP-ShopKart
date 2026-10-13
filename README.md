# MERN-ELP-ShopKart

ShopKart is a full-stack e-commerce application built with MongoDB, Express, React, and Node.js. It includes a React storefront and an Express API for customer accounts, products, carts, wishlists, orders, and Razorpay payments.

## Project structure

- `frontend/` — Frontend workspace and its npm lockfile.
- `frontend/client/` — React application built with Vite.
- `backend/` — Express API, MongoDB models, route handlers, and seed data.

## Features

- Browse, search, and view product details.
- Register and sign in to a customer account.
- Manage a shopping cart and wishlist.
- View customer orders and initiate payments through Razorpay.

## Requirements

- Node.js and npm
- MongoDB (local or hosted)
- Razorpay API credentials for payment functionality

## Run locally

### Backend

From the repository root:

```powershell
cd backend
npm install
```

Create a local `backend/.env` file with the following settings:

```dotenv
PORT=8000
MONGO=mongodb://localhost:27017/shopkart
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=1d
RAZORPAY_API=your-razorpay-key-id
RAZORPAY_SECRET=your-razorpay-key-secret
```

Start the API:

```powershell
npm start
```

The backend connects to MongoDB using `MONGO`. Keep all real credentials in local environment files; `.env*` files are excluded from Git.

### Frontend

In a second terminal, from the repository root:

```powershell
cd frontend/client
npm install
npm run dev
```

Vite serves the frontend at `http://localhost:5173`. The backend CORS configuration currently allows that development origin.

## Seed sample products

The backend includes a sample product seed script. Configure MongoDB, then run:

```powershell
cd backend
node seed.js
```

The seed script clears the existing products collection before inserting its sample products.
