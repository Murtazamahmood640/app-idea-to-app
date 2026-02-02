// User Types
export type UserRole = 'customer' | 'vendor';

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
  errors?: Record<string, string[]>;
}

// Product Types
export type ProductCondition = 'new' | 'used' | 'refurbished';

export interface ProductImage {
  id: number;
  url: string;
  is_primary: boolean;
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface Product {
  id: number;
  vendor_id: number;
  vendor_name?: string;
  name: string;
  description: string;
  price: number;
  sale_price?: number;
  category_id: number;
  category_name?: string;
  brand: string;
  model_compatibility: string[];
  year_range_start?: number;
  year_range_end?: number;
  condition: ProductCondition;
  sku: string;
  stock_quantity: number;
  images: ProductImage[];
  specifications: ProductSpecification[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  warranty_months?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  sale_price?: number;
  category_id: number;
  brand: string;
  model_compatibility: string[];
  year_range_start?: number;
  year_range_end?: number;
  condition: ProductCondition;
  sku: string;
  stock_quantity: number;
  images: File[];
  specifications: ProductSpecification[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  warranty_months?: number;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id?: number;
  image?: string;
  product_count?: number;
}

// Cart Types
export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

// Order Types
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: number;
  order_number: string;
  customer_id: number;
  customer_name?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string;
  shipping_address: Address;
  billing_address?: Address;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id?: number;
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
}

// Vendor Sales Types
export interface VendorSale {
  id: number;
  order_id: number;
  order_number: string;
  product_id: number;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  total: number;
  status: OrderStatus;
  customer_name: string;
  created_at: string;
}

export interface VendorStats {
  total_sales: number;
  total_revenue: number;
  total_products: number;
  pending_orders: number;
  monthly_sales: {
    month: string;
    sales: number;
    revenue: number;
  }[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
