import {
  ApiResponse,
  Category,
  GearItem,
  RentalOrder,
  Review,
  User,
} from "@/types";
import { MOCK_CATEGORIES, MOCK_GEARS } from "./mock-data";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("gearup_token");
}

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("gearup_token", token);
  }
}

export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("gearup_token");
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg =
      data?.message || data?.error || `HTTP error! status: ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

// ================= AUTH APIs =================
export const authApi = {
  async register(body: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: "CUSTOMER" | "PROVIDER";
  }): Promise<{ user: User }> {
    const res = await request<ApiResponse<User>>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return { user: res.data };
  },

  async login(body: {
    email: string;
    password: string;
  }): Promise<{ accessToken: string; user: User }> {
    const res = await request<
      ApiResponse<{ accessToken: string; user: User }>
    >("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (res.data?.accessToken) {
      setToken(res.data.accessToken);
    }
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await request<ApiResponse<User>>("/auth/me");
    return res.data;
  },

  logout() {
    removeToken();
  },
};

// ================= CATEGORIES APIs =================
export const categoryApi = {
  async getCategories(): Promise<Category[]> {
    try {
      const res = await request<ApiResponse<Category[]>>("/categories");
      return res.data || [];
    } catch (err) {
      console.warn("Failed to fetch live categories, using mock categories:", err);
      return MOCK_CATEGORIES;
    }
  },

  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const res = await request<ApiResponse<Category>>(`/categories/${id}`);
      return res.data;
    } catch {
      return MOCK_CATEGORIES.find((c) => c.id === id || c.slug === id) || null;
    }
  },
};

// ================= GEARS APIs =================
export interface GearQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  brand?: string;
  isAvailable?: boolean;
}

export const gearApi = {
  async getGears(params: GearQueryParams = {}): Promise<{
    data: GearItem[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const query = new URLSearchParams();
    if (params.page) query.append("page", String(params.page));
    if (params.limit) query.append("limit", String(params.limit));
    if (params.search) query.append("search", params.search);
    if (params.categoryId) query.append("categoryId", params.categoryId);
    if (params.brand) query.append("brand", params.brand);
    if (params.isAvailable !== undefined)
      query.append("isAvailable", String(params.isAvailable));

    try {
      const qs = query.toString();
      const res = await request<
        ApiResponse<GearItem[]> & {
          meta: { page: number; limit: number; total: number; totalPages: number };
        }
      >(`/gears${qs ? `?${qs}` : ""}`);

      return {
        data: res.data || [],
        meta: res.meta || {
          page: 1,
          limit: 10,
          total: res.data?.length || 0,
          totalPages: 1,
        },
      };
    } catch (err) {
      console.warn("Failed to fetch live gears, using fallback mock gears:", err);
      let filtered = [...MOCK_GEARS];
      if (params.search) {
        const s = params.search.toLowerCase();
        filtered = filtered.filter(
          (g) =>
            g.name.toLowerCase().includes(s) ||
            g.brand?.toLowerCase().includes(s) ||
            g.description?.toLowerCase().includes(s)
        );
      }
      if (params.categoryId) {
        filtered = filtered.filter(
          (g) =>
            g.categoryId === params.categoryId ||
            g.category?.slug === params.categoryId
        );
      }
      return {
        data: filtered,
        meta: {
          page: 1,
          limit: filtered.length,
          total: filtered.length,
          totalPages: 1,
        },
      };
    }
  },

  async getGearById(id: string): Promise<GearItem> {
    try {
      const res = await request<ApiResponse<GearItem>>(`/gears/${id}`);
      return res.data;
    } catch (err) {
      console.warn(`Failed to fetch gear ${id} from API, checking mock:`, err);
      const found = MOCK_GEARS.find((g) => g.id === id || g.slug === id);
      if (found) return found;
      throw err;
    }
  },

  async createGear(data: {
    categoryId: string;
    name: string;
    slug: string;
    description?: string;
    brand?: string;
    pricePerDay: number;
    stock: number;
    imageUrl?: string;
    specifications?: Record<string, any>;
    isAvailable?: boolean;
  }): Promise<GearItem> {
    const res = await request<ApiResponse<GearItem>>("/gears", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateGear(
    id: string,
    data: Partial<{
      categoryId: string;
      name: string;
      slug: string;
      description?: string;
      brand?: string;
      pricePerDay: number;
      stock: number;
      imageUrl?: string;
      specifications?: Record<string, any>;
      isAvailable?: boolean;
    }>
  ): Promise<GearItem> {
    const res = await request<ApiResponse<GearItem>>(`/gears/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async deleteGear(id: string): Promise<void> {
    await request(`/gears/${id}`, {
      method: "DELETE",
    });
  },
};

// ================= RENTALS APIs =================
export const rentalApi = {
  async createRental(payload: {
    startDate: string;
    endDate: string;
    items: Array<{ gearItemId: string; quantity: number }>;
  }): Promise<RentalOrder> {
    const res = await request<ApiResponse<RentalOrder>>("/rentals", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async getMyRentals(): Promise<RentalOrder[]> {
    const res = await request<ApiResponse<RentalOrder[]>>("/rentals");
    return res.data || [];
  },

  async getRentalById(id: string): Promise<RentalOrder> {
    const res = await request<ApiResponse<RentalOrder>>(`/rentals/${id}`);
    return res.data;
  },

  async cancelRental(id: string): Promise<RentalOrder> {
    const res = await request<ApiResponse<RentalOrder>>(`/rentals/${id}/cancel`, {
      method: "PATCH",
    });
    return res.data;
  },

  async getProviderRentals(): Promise<RentalOrder[]> {
    const res = await request<ApiResponse<RentalOrder[]>>("/provider/rentals");
    return res.data || [];
  },

  async updateProviderRentalStatus(
    id: string,
    status: "CONFIRMED" | "PICKED_UP" | "RETURNED"
  ): Promise<RentalOrder> {
    const res = await request<ApiResponse<RentalOrder>>(
      `/provider/rentals/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }
    );
    return res.data;
  },
};

// ================= REVIEWS APIs =================
export const reviewApi = {
  async getGearReviews(gearId: string): Promise<Review[]> {
    try {
      const res = await request<ApiResponse<Review[]>>(
        `/reviews/gear/${gearId}`
      );
      return res.data || [];
    } catch {
      return [];
    }
  },

  async createReview(payload: {
    gearItemId: string;
    rating: number;
    comment?: string;
  }): Promise<Review> {
    const res = await request<ApiResponse<Review>>("/reviews", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.data;
  },
};
