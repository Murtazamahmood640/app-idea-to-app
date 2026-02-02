# BayPro PHP Backend API Documentation

This document outlines all the API endpoints your PHP backend needs to implement for the BayPro mobile app.

## Base URL Configuration

Update the API base URL in `src/config/api.ts`:
```javascript
export const API_BASE_URL = 'https://your-domain.com/api';
```

## Authentication

All authenticated endpoints require the `Authorization` header:
```
Authorization: Bearer {token}
```

---

## API Endpoints

### 1. Authentication

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "password_confirmation": "securepassword",
  "role": "customer" // or "vendor"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": null,
      "role": "customer",
      "avatar": null,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email has already been taken."],
    "password": ["The password must be at least 6 characters."]
  }
}
```

---

#### POST `/api/auth/login`
Login a user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      ...
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### POST `/api/auth/logout`
Logout current user (invalidate token).

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### GET `/api/auth/me`
Get current authenticated user.

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "0821234567",
      "role": "customer",
      "avatar": "https://example.com/avatar.jpg",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  }
}
```

---

### 2. Categories

#### GET `/api/categories`
Get all product categories.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Engine Parts",
      "slug": "engine-parts",
      "parent_id": null,
      "image": "https://example.com/engine.jpg",
      "product_count": 124
    },
    {
      "id": 2,
      "name": "Brake System",
      "slug": "brake-system",
      "parent_id": null,
      "image": "https://example.com/brakes.jpg",
      "product_count": 89
    }
  ]
}
```

---

### 3. Products

#### GET `/api/products`
List all products with pagination and filters.

**Query Parameters:**
- `page` (int): Page number (default: 1)
- `per_page` (int): Items per page (default: 20)
- `category` (string): Category slug
- `search` (string): Search term
- `brand` (string): Brand name
- `condition` (string): new, used, refurbished
- `min_price` (number): Minimum price
- `max_price` (number): Maximum price
- `sort` (string): price_asc, price_desc, newest, popular

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "vendor_id": 1,
      "vendor_name": "AutoParts Pro",
      "name": "High Performance Brake Pads",
      "description": "Premium ceramic brake pads...",
      "price": 899.99,
      "sale_price": 749.99,
      "category_id": 2,
      "category_name": "Brake System",
      "brand": "Brembo",
      "model_compatibility": ["BMW 3 Series", "BMW 5 Series"],
      "year_range_start": 2015,
      "year_range_end": 2023,
      "condition": "new",
      "sku": "BRK-001",
      "stock_quantity": 25,
      "images": [
        {
          "id": 1,
          "url": "https://example.com/brake1.jpg",
          "is_primary": true
        }
      ],
      "specifications": [
        { "key": "Material", "value": "Ceramic" }
      ],
      "weight": 2.5,
      "dimensions": {
        "length": 15,
        "width": 12,
        "height": 8
      },
      "warranty_months": 24,
      "is_active": true,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 20,
    "total": 100
  }
}
```

---

#### GET `/api/products/{id}`
Get single product details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "vendor_id": 1,
    "vendor_name": "AutoParts Pro",
    "name": "High Performance Brake Pads",
    ...
  }
}
```

---

### 4. Vendor Products

#### GET `/api/vendor/products`
Get vendor's own products.

**Headers:** `Authorization: Bearer {token}` (vendor only)

**Response (200):**
```json
{
  "success": true,
  "data": [...products],
  "meta": { ... }
}
```

---

#### POST `/api/vendor/products`
Create a new product.

**Headers:** 
- `Authorization: Bearer {token}` (vendor only)
- `Content-Type: multipart/form-data`

**Request Body (FormData):**
```
name: "High Performance Brake Pads"
description: "Premium ceramic brake pads..."
price: 899.99
sale_price: 749.99 (optional)
category_id: 2
brand: "Brembo"
model_compatibility[]: "BMW 3 Series"
model_compatibility[]: "BMW 5 Series"
year_range_start: 2015 (optional)
year_range_end: 2023 (optional)
condition: "new"
sku: "BRK-001"
stock_quantity: 25
images[]: (file)
images[]: (file)
specifications[0][key]: "Material"
specifications[0][value]: "Ceramic"
weight: 2.5 (optional)
dimensions[length]: 15 (optional)
dimensions[width]: 12 (optional)
dimensions[height]: 8 (optional)
warranty_months: 24 (optional)
```

**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": { ...product }
}
```

---

#### PUT `/api/vendor/products/{id}`
Update a product.

**Headers:** `Authorization: Bearer {token}` (vendor only)

Same body as create, but with `Content-Type: application/json` for updates without new images.

---

#### DELETE `/api/vendor/products/{id}`
Delete a product.

**Headers:** `Authorization: Bearer {token}` (vendor only)

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### 5. Cart (Server-side - Optional)

If you want server-side cart management:

#### GET `/api/cart`
Get user's cart.

#### POST `/api/cart/add`
Add item to cart.

**Request Body:**
```json
{
  "product_id": 1,
  "quantity": 2
}
```

#### PUT `/api/cart/update`
Update cart item quantity.

**Request Body:**
```json
{
  "cart_item_id": 1,
  "quantity": 3
}
```

#### DELETE `/api/cart/remove/{cart_item_id}`
Remove item from cart.

---

### 6. Orders

#### GET `/api/orders`
Get user's orders (for customers) or orders to fulfill (for vendors).

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "order_number": "BP-2024-001",
      "customer_id": 1,
      "customer_name": "John Doe",
      "items": [
        {
          "id": 1,
          "product_id": 1,
          "product_name": "High Performance Brake Pads",
          "product_image": "https://example.com/brake.jpg",
          "quantity": 2,
          "price": 749.99,
          "total": 1499.98
        }
      ],
      "subtotal": 1499.98,
      "shipping": 0,
      "tax": 224.99,
      "total": 1724.97,
      "status": "shipped",
      "payment_status": "paid",
      "payment_method": "PayFast",
      "shipping_address": {
        "name": "John Doe",
        "phone": "0821234567",
        "address_line1": "123 Main Street",
        "address_line2": null,
        "city": "Johannesburg",
        "state": "Gauteng",
        "postal_code": "2000",
        "country": "South Africa"
      },
      "notes": null,
      "created_at": "2024-01-20T10:30:00Z",
      "updated_at": "2024-01-21T14:00:00Z"
    }
  ],
  "meta": { ... }
}
```

---

#### GET `/api/orders/{id}`
Get single order details.

---

#### POST `/api/orders/checkout`
Create a new order and initiate payment.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ],
  "shipping_address": {
    "name": "John Doe",
    "phone": "0821234567",
    "address_line1": "123 Main Street",
    "address_line2": null,
    "city": "Johannesburg",
    "state": "Gauteng",
    "postal_code": "2000",
    "country": "South Africa"
  },
  "notes": "Please leave at the gate"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order created",
  "data": {
    "order": { ...order },
    "payment_url": "https://www.payfast.co.za/eng/process?..."
  }
}
```

---

### 7. PayFast Integration

#### POST `/api/payment/payfast/initiate`
Initiate PayFast payment for an order.

**Request Body:**
```json
{
  "order_id": 1
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "payment_url": "https://www.payfast.co.za/eng/process",
    "form_data": {
      "merchant_id": "...",
      "merchant_key": "...",
      "amount": "1724.97",
      "item_name": "BayPro Order BP-2024-001",
      "return_url": "https://your-app.com/payment/success",
      "cancel_url": "https://your-app.com/payment/cancel",
      "notify_url": "https://your-api.com/api/payment/payfast/callback",
      "signature": "..."
    }
  }
}
```

---

#### POST `/api/payment/payfast/callback`
PayFast ITN (Instant Transaction Notification) webhook.

This endpoint receives payment confirmations from PayFast. Implement proper signature verification.

---

### 8. Vendor Dashboard

#### GET `/api/vendor/dashboard`
Get vendor statistics.

**Headers:** `Authorization: Bearer {token}` (vendor only)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_sales": 156,
    "total_revenue": 125450.00,
    "total_products": 24,
    "pending_orders": 5,
    "monthly_sales": [
      { "month": "Oct", "sales": 20, "revenue": 15000 },
      { "month": "Nov", "sales": 35, "revenue": 28000 },
      { "month": "Dec", "sales": 48, "revenue": 42000 },
      { "month": "Jan", "sales": 53, "revenue": 40450 }
    ]
  }
}
```

---

#### GET `/api/vendor/sales`
Get vendor's sales history.

**Headers:** `Authorization: Bearer {token}` (vendor only)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "order_id": 1,
      "order_number": "BP-2024-001",
      "product_id": 1,
      "product_name": "High Performance Brake Pads",
      "product_image": "https://example.com/brake.jpg",
      "quantity": 2,
      "price": 749.99,
      "total": 1499.98,
      "status": "shipped",
      "customer_name": "John Doe",
      "created_at": "2024-01-20T10:30:00Z"
    }
  ],
  "meta": { ... }
}
```

---

### 9. User Profile

#### PUT `/api/user/profile`
Update user profile.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "0821234567"
}
```

---

#### GET `/api/user/addresses`
Get user's saved addresses.

#### POST `/api/user/addresses`
Add a new address.

#### PUT `/api/user/addresses/{id}`
Update an address.

#### DELETE `/api/user/addresses/{id}`
Delete an address.

---

## Database Schema

Here's a suggested MySQL schema:

```sql
-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('customer', 'vendor') NOT NULL DEFAULT 'customer',
    avatar VARCHAR(500),
    email_verified_at TIMESTAMP NULL,
    remember_token VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    parent_id INT NULL REFERENCES categories(id),
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vendor_id INT NOT NULL REFERENCES users(id),
    category_id INT NOT NULL REFERENCES categories(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2),
    brand VARCHAR(255) NOT NULL,
    model_compatibility JSON,
    year_range_start INT,
    year_range_end INT,
    `condition` ENUM('new', 'used', 'refurbished') NOT NULL DEFAULT 'new',
    sku VARCHAR(100) UNIQUE NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    specifications JSON,
    weight DECIMAL(8,2),
    dimensions JSON,
    warranty_months INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_vendor (vendor_id),
    INDEX idx_category (category_id),
    INDEX idx_brand (brand),
    FULLTEXT idx_search (name, description, brand)
);

-- Product images table
CREATE TABLE product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Addresses table
CREATE TABLE addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line1 VARCHAR(500) NOT NULL,
    address_line2 VARCHAR(500),
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'South Africa',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INT NOT NULL REFERENCES users(id),
    subtotal DECIMAL(10,2) NOT NULL,
    shipping DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax DECIMAL(10,2) NOT NULL DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    shipping_address JSON NOT NULL,
    billing_address JSON,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_customer (customer_id),
    INDEX idx_status (status)
);

-- Order items table
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id),
    vendor_id INT NOT NULL REFERENCES users(id),
    product_name VARCHAR(255) NOT NULL,
    product_image VARCHAR(500),
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Security Recommendations

1. **JWT Tokens**: Use secure JWT tokens with proper expiration (e.g., 24 hours)
2. **Password Hashing**: Use bcrypt for password hashing
3. **Input Validation**: Validate all inputs server-side
4. **Rate Limiting**: Implement rate limiting on auth endpoints
5. **CORS**: Configure proper CORS headers for your mobile app domain
6. **HTTPS**: Always use HTTPS in production
7. **PayFast Signature**: Verify PayFast signatures on callbacks
8. **SQL Injection**: Use prepared statements

---

## CORS Configuration

Your PHP backend needs to return these headers:

```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Authorization, Content-Type, Accept, X-Requested-With');
header('Access-Control-Max-Age: 86400');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
```

---

## Next Steps

1. Update `src/config/api.ts` with your actual API base URL
2. Implement the endpoints listed above in your PHP backend
3. Test the connection from the app
4. Set up PayFast integration with your merchant credentials
