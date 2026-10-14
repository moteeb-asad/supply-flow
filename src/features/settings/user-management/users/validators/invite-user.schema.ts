import { z } from "zod";
import { isRole } from "@/src/features/auth/utils/rbac";

export const inviteUserSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  // One role per user; ROLE_PERMISSIONS decides what it can access.
  role: z
    .string()
    .min(1, "Role is required")
    .refine((role): boolean => isRole(role), {
      message: "Invalid role selected",
    }),
});

export type InviteUserInput = z.infer<typeof inviteUserSchema>;
