import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().nonempty({ message: 'Email is required' }).email({ message: 'Invalid email address' }),
  password: z.string().nonempty({ message: 'Password is required' }),
})

export type SignUpFormValues = z.infer<typeof signUpSchema>