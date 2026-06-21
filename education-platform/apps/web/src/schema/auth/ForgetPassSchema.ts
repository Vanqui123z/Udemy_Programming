import z from "zod";

export const SendOtpSchema = z.object({
  email: z.string().email(),
});

export type SendOtpFormData = z.infer<typeof SendOtpSchema>;
export const ForgetPassSchema = z.object({
      email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    otp: z.string().min(5, "OTP must be at least 5 characters"),

  })
  .refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
   );

export type ForgetPassFormData = z.infer<typeof ForgetPassSchema>;
