export const loginUserSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
    },
  },
  tags: ["Authentication"],
};
export const registerUserSchema = {
  body: {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      name: { type: "string" },
      email: { type: "string", format: "email" },
      password: {
        type: "string",
        minLength: 6,
        // Regular expression pattern for at least 1 uppercase letter, 1 lowercase letter, and 1 digit
        pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,}$",
      },
    },
  },
  tags: ["Authentication"],
};
