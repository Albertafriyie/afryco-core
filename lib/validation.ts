import { z } from "zod";

export const UserFormValidation = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(50, { message: "Username must be at most 50 characters." }),

  email: z.string().email("Please enter a valid email address."),

  // 1. Loosened phone tracking regex to handle international formatting cleanly
  phone: z.string().refine((phone) => /^\+?[1-9]\d{1,14}$/.test(phone), {
    message: "Please enter a valid international phone number.",
  }),

  // 2. Either delete this line completely, OR change it to .optional() like this:
  description: z.string().optional(),
});
