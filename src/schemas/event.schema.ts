import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().nonempty({ message: 'Title is required' }),
})

export type EventFormValues = z.infer<typeof eventSchema>