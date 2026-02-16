import { z } from "zod";

export const inviteUserSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  roles: z
    .array(z.string())
    .min(1, "At least one role must be selected")
    .refine(
      (roles) =>
        roles.every((role) =>
          ["super_admin", "operations_manager", "store_keeper"].includes(role),
        ),
      {
        message: "Invalid role selected",
      },
    ),
});

export type InviteUserInput = z.infer<typeof inviteUserSchema>;
