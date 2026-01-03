import { z } from "zod";

export interface Admin {
  id: string;
  fullName: string;
  email: string;
  role: string;
  course_permission: boolean;
  student_permission: boolean;
  exam_permission: boolean;
  status: boolean;
}

// Define Zod schema for validation
export const adminSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/\d/, "Password must include at least one number")
    .regex(/[\W_]/, "Password must include at least one special character"), // special character includes non-word characters or underscores
  course_permission: z.boolean(),
  student_permission: z.boolean(),
  exam_permission: z.boolean(),
});

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must include at least one uppercase letter")
  .regex(/[a-z]/, "Password must include at least one lowercase letter")
  .regex(/\d/, "Password must include at least one number")
  .regex(/[\W_]/, "Password must include at least one special character"); // special character includes non-word characters or underscores
