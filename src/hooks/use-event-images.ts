import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { momentoApi } from '@/api/client'
import { showApiError } from '@/lib/toast'
import type { EventImage } from '@/features/event/schemas/event.schema'

const EVENT_IMAGES_QUERY_KEY = ['event-images']

/**
 * Hook to upload multiple images.
 * Encapsulates: get presigned URL → PUT to S3 → confirm upload.
 */
export function useImageUploader(eventId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (files: File[]) => {
      if (!eventId) throw new Error('Event ID is required')

      for (const file of files) {
        const uploadData = await momentoApi.api.eventsImagesUploadUrlList(eventId, {
          content_type: file.type,
        })

        if (!uploadData.data.upload_url || !uploadData.data.object_key) {
          throw new Error('Failed to get upload URL')
        }

        await fetch(uploadData.data.upload_url, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        })

        await momentoApi.api.eventsImagesCreate(eventId, {
          object_key: uploadData.data.object_key,
        })
      }
    },
    onSuccess: () => {
      if (eventId) {
        queryClient.invalidateQueries({ queryKey: [...EVENT_IMAGES_QUERY_KEY, eventId] })
      }
    },
    onError: (err) => {
      console.error('Upload failed:', err)
      toast.error('Failed to upload images')
    },
  })
}

/**
 * Hook to list all images for an event.
 */
export function useListImages(eventId: string | undefined) {
  return useQuery({
    queryKey: [...EVENT_IMAGES_QUERY_KEY, eventId],
    queryFn: async () => {
      if (!eventId) return []
      const response = await momentoApi.api.eventsImagesList(eventId)
      return (response.data ?? []) as Array<EventImage>
    },
    enabled: !!eventId,
    staleTime: 0,
    gcTime: 0,
  })
}

/**
 * Hook to delete an image from an event.
 */
export function useDeleteImage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      eventId,
      path,
    }: {
      eventId: string
      path: string
    }) => {
      await momentoApi.api.eventsImagesDelete(eventId, path)
    },
    onSuccess: (_data, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: [...EVENT_IMAGES_QUERY_KEY, eventId] })
    },
    onError: (error) => {
      showApiError(error)
      toast.error('Failed to remove image')
    },
  })
}
