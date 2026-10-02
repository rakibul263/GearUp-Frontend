import { z } from "zod";

// ================= AUTH VALIDATIONS =================
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Please provide a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Full name must be at least 2 characters" })
    .max(50, { message: "Name must be less than 50 characters" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Please provide a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^[+]?[\d\s-]{8,20}$/.test(val), {
      message: "Please enter a valid phone number (e.g. +8801700000000)",
    }),
  role: z.enum(["CUSTOMER", "PROVIDER"] as const),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// ================= GEAR VALIDATIONS =================
export const createGearSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Gear title must be at least 3 characters" })
    .max(100, { message: "Gear title must be under 100 characters" }),
  brand: z
    .string()
    .trim()
    .min(2, { message: "Brand name must be at least 2 characters" }),
  categoryId: z
    .string()
    .min(1, { message: "Please select a gear category" }),
  pricePerDay: z
    .number()
    .positive({ message: "Daily rate must be greater than 0" })
    .max(50000, { message: "Daily rate exceeds maximum limit" }),
  stock: z
    .number()
    .int({ message: "Stock must be an integer" })
    .min(1, { message: "Stock must be at least 1 unit" })
    .max(100, { message: "Stock cannot exceed 100 units" }),
  imageUrl: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^https?:\/\/.+/.test(val), {
      message: "Image URL must be a valid http or https link",
    }),
  description: z
    .string()
    .trim()
    .min(10, { message: "Description must be at least 10 characters long" })
    .max(2000, { message: "Description is too long (max 2000 characters)" }),
});

export type CreateGearFormData = z.infer<typeof createGearSchema>;

// ================= RENTAL BOOKING VALIDATION =================
export const createRentalSchema = z
  .object({
    startDate: z.string().min(1, { message: "Start date is required" }),
    endDate: z.string().min(1, { message: "Return date is required" }),
    quantity: z
      .number()
      .int()
      .min(1, { message: "At least 1 unit must be selected" }),
    gearItemId: z.string().min(1, { message: "Gear ID is required" }),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate).getTime();
      const end = new Date(data.endDate).getTime();
      return end > start;
    },
    {
      message: "Return date must be strictly after the pickup date",
      path: ["endDate"],
    }
  );

export type CreateRentalFormData = z.infer<typeof createRentalSchema>;

// ================= REVIEW VALIDATION =================
export const createReviewSchema = z.object({
  gearItemId: z.string().min(1, { message: "Gear ID is required" }),
  rating: z
    .number()
    .int()
    .min(1, { message: "Rating must be at least 1 star" })
    .max(5, { message: "Rating cannot exceed 5 stars" }),
  comment: z
    .string()
    .trim()
    .min(5, { message: "Review comment must be at least 5 characters" })
    .max(500, { message: "Comment cannot exceed 500 characters" }),
});

export type CreateReviewFormData = z.infer<typeof createReviewSchema>;
