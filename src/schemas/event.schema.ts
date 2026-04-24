import { z } from 'zod';

export const eventSchema = z.object({
  id: z.string().uuid({ message: "Event id must be a valid UUID" }),
  title: z.string().min(1, { message: "Event title is required" }),
  content: z.string().min(1, { message: "Event content is required" }),
  createdAt: z.string().datetime({ message: "Event createdAt must be a valid ISO 8601 date string" }),
}).strict()

export type Event = z.infer<typeof eventSchema>