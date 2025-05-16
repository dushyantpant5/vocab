import { z } from "zod";

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot be longer than 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const profileEditSchema = z.object({
  phonenumber: z.string()
  .regex(/^\d{10}$/, "Phone number must contain only digits")
  .optional(),
  dailywordcount: z
  .string()
  .regex(/^\d+$/, "Daily word count must contain only digits")
  .refine((val) => {
    const num = Number(val);
    return num >= 1 && num <= 20;
  }, {
    message: "Daily word count must be between 1 to 20",
  })
  .optional()
});

export { signUpSchema, signInSchema , profileEditSchema};
