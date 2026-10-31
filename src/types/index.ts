export type UserRole = 'ADMIN' | 'CUSTOMER';

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  addresses: Address[];
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: 'Classic' | 'Zero Sugar' | 'High-Volt' | 'Variety Pack';
  flavour: string;
  size: string; // e.g., '500ml Can', '12x 500ml Pack'
  SKU: string;
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  caffeineMg?: number;
  calories?: number;
  rating?: number;
  numReviews?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  flavour?: string;
}

export type PaymentMethod = 'razorpay' | 'cod' | 'demo';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  shippingAddress: Address;
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  shippingCost: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  carrier?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
}

export interface Cart {
  _id?: string;
  userId: string;
  items: CartItem[];
  updatedAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minSpend?: number;
  isActive: boolean;
  expiresAt?: string;
}

export interface Review {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  revenueChangePercent: number;
  totalOrders: number;
  ordersChangePercent: number;
  productsSold: number;
  productsSoldChangePercent: number;
  totalCustomers: number;
  customersChangePercent: number;
  averageOrderValue: number;
  aovChangePercent: number;
  productsInStock: number;
  lowStockCount: number;
}
