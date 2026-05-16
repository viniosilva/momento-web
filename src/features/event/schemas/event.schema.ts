import { z } from 'zod';

export const eventSchema = z.object({
  id: z.string().uuid({ message: "Event id must be a valid UUID" }),
  title: z.string().nonempty({ message: "Event title is required" }),
  content: z.string().nonempty({ message: "Event content is required" }),
  createdAt: z.string().datetime({ message: "Event createdAt must be a valid ISO 8601 date string" }),
}).strict()

export type Event = z.infer<typeof eventSchema>

export interface EventImage {
  path: string
  download_url: string
}

export interface GetUploadURLResponse {
  upload_url: string
  object_key: string
}

export const ACCEPTED_IMAGE_TYPES = [".jpg,.jpeg,.png,.webp"] as const
export const MAX_IMAGE_SIZE_MB = 10
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024
