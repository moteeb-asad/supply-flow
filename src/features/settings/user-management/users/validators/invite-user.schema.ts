import { z } from "zod";
import { isRole } from "@/src/features/auth/utils/rbac";

export const inviteUserSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    primaryRole: z
      .string()
      .min(1, "Primary role is required")
      .refine((role): boolean => isRole(role), {
        message: "Invalid role selected",
      }),
    roles: z
      .array(z.string())
      .min(1, "At least one role must be selected")
      .refine((roles): boolean => roles.every((role) => isRole(role)), {
        message: "Invalid role selected",
      }),
  })
  .refine((data) => data.roles.includes(data.primaryRole), {
    message: "Primary role must be one of the selected roles",
    path: ["primaryRole"],
  });

export type InviteUserInput = z.infer<typeof inviteUserSchema>;
