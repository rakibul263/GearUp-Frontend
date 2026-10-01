export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count?: {
    gearItems: number;
  };
}

export interface GearItem {
  id: string;
  providerId: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string | null;
  brand?: string | null;
  pricePerDay: string | number;
  stock: number;
  imageUrl?: string | null;
  specifications?: Record<string, string> | null;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  provider?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  ratingSummary?: {
    averageRating: number;
    reviewCount: number;
  };
}

export type RentalOrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PAID"
  | "PICKED_UP"
  | "RETURNED"
  | "CANCELED";

export interface RentalOrderItem {
  id: string;
  rentalOrderId: string;
  gearItemId: string;
  quantity: number;
  pricePerDay: string | number;
  numberOfDays: number;
  subTotal: string | number;
  gearItem?: {
    id: string;
    name: string;
    imageUrl?: string | null;
    pricePerDay: string | number;
    providerId?: string;
  };
}

export interface RentalOrder {
  id: string;
  customerId: string;
  startTime: string;
  endTime: string;
  subtotal: string | number;
  totalAmount: string | number;
  status: RentalOrderStatus;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
  rentalItems: RentalOrderItem[];
  payments?: any[];
}

export interface Review {
  id: string;
  gearItemId: string;
  userId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
