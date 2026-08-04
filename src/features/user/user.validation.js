import { z } from "zod";

// Length-first password policy (NIST): min 8, up to 72 (bcrypt's byte limit),
// any characters allowed — no harmful 12-char cap, no restrictive symbol list.
const password = z
  .string()
  .min(8, "password must be at least 8 characters")
  .max(72, "password must be at most 72 characters");

export const signupSchema = {
  body: z.object({
    name: z.string().trim().min(1, "name is required"),
    email: z.string().trim().email("a valid email is required"),
    password,
    type: z.enum(["customer", "seller"]).default("customer"),
  }),
};

export const signinSchema = {
  body: z.object({
    email: z.string().trim().email("a valid email is required"),
    password: z.string().min(1, "password is required"),
  }),
};

export const resetPasswordSchema = {
  body: z.object({
    currentPassword: z.string().min(1, "current password is required"),
    newPassword: password,
  }),
};
