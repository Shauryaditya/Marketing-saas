import { z } from "zod";

export const LoginSchema = z.object({
    emp_id: z.string().nonempty({ message: 'Employee ID cannot be empty' }),
    password: z
        .string()
        .min(8, { message: 'Your password must be at least 8 characters long' })
        .max(64, { message: 'Your password cannot be longer than 64 characters' })
});
