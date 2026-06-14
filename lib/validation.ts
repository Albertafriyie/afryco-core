import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const UserFormValidation = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(50, { message: "Username must be at most 50 characters." }),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), {
      message: "Please enter a valid phone number.",
    }),
});
