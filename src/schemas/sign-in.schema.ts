import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().nonempty({ message: 'Email is required' }).email({ message: 'Invalid email address' }),
  password: z.string().nonempty({ message: 'Password is required' }),
  rememberMe: z.boolean(),
})

export type SignInFormValues = z.infer<typeof signInSchema>