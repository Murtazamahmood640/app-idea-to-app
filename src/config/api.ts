// API Configuration
// Update this URL to your PHP backend base URL
export const API_BASE_URL = 'https://your-php-backend.com/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // Products
  PRODUCTS: '/products',
  PRODUCT: (id: number) => `/products/${id}`,
  VENDOR_PRODUCTS: '/vendor/products',
  
  // Categories
  CATEGORIES: '/categories',
  
  // Cart
  CART: '/cart',
  CART_ADD: '/cart/add',
  CART_UPDATE: '/cart/update',
  CART_REMOVE: '/cart/remove',
  
  // Orders
  ORDERS: '/orders',
  ORDER: (id: number) => `/orders/${id}`,
  CHECKOUT: '/orders/checkout',
  
  // Vendor
  VENDOR_DASHBOARD: '/vendor/dashboard',
  VENDOR_SALES: '/vendor/sales',
  VENDOR_ORDERS: '/vendor/orders',
  
  // Payment
  PAYFAST_INITIATE: '/payment/payfast/initiate',
  PAYFAST_CALLBACK: '/payment/payfast/callback',
  
  // User
  PROFILE: '/user/profile',
  ADDRESSES: '/user/addresses',
} as const;

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000;
