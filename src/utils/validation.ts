import * as z from "zod";

export const signInValidation: any = z.object({
  name: z.string(),
  email: z.string().email({
    message: "Please enter valid email.",
  }),
  password: z.string().refine(
    (password) => {
      return (
        password.length >= 8 &&
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        /\d/.test(password) &&
        /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)
      );
    },
    {
      message:
        "Password must be at least 8 characters and include lowercase, uppercase, digit, and special character.",
    }
  ),
});
export const passwordValidation: any = z.object({
  password: z.string().refine(
    (password) => {
      return (
        password.length >= 8 &&
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        /\d/.test(password) &&
        /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)
      );
    },
    {
      message:
        "Password must be at least 8 characters and include lowercase, uppercase, digit, and special character.",
    }
  ),
});
