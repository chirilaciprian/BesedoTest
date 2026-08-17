import { z } from "zod";

const userFields = {
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  email: z.email({ message: "Email must be a valid email address" }),
  phone: z
    .string()
    .min(1, "Phone is required")
    .max(50, "Phone must be less than 50 characters"),
  job: z
    .string()
    .min(1, "Job is required")
    .max(50, "Job must be less than 50 characters"),
};

const createUserSchema = z.object(userFields).strict();
const updateUserSchema = z.object(userFields).partial().strict();

const idParamSchema = z.object({
  id: z.coerce
    .number("ID is required")
    .int("ID must be an integer")
    .positive("ID must be a positive number"),
});

export { createUserSchema, updateUserSchema, idParamSchema };
