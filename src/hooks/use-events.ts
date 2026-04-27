import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { PortsCreateEventRequest, PortsEventResponse, PortsUpdateEventRequest } from '@/api'
import { momentoApi } from '@/api/client'
import { showApiError } from '@/lib/toast'

const EVENT_QUERY_KEY = ['events']

function normalizeEvent(raw: PortsEventResponse | undefined): Event | null {
  if (!raw) return null

  return {
    id: raw.id ?? '',
    title: raw.title ?? '',
    content: raw.content ?? '',
    ownerUserId: raw.owner_user_id ?? '',
    createdAt: raw.created_at ?? '',
    updatedAt: raw.updated_at ?? '',
    archivedAt: raw.archived_at ?? '',
  }
}

export interface Event {
  id: string
  title: string
  content: string
  ownerUserId: string
  createdAt: string
  updatedAt: string
  archivedAt: string
}

export interface EventsListParams {
  page?: number
  pageSize?: number
  sortBy?: 'created_at' | 'updated_at'
  sortOrder?: 'asc' | 'desc'
}

interface CachedEventsData {
  queryKey: unknown[]
  data: { data: Array<Event>; pagination?: unknown }
}

export function useEventsList(query?: EventsListParams) {
  return useQuery({
    queryKey: [...EVENT_QUERY_KEY, query],
    queryFn: async () => {
      const response = await momentoApi.api.eventsList({
        page: query?.page,
        page_size: query?.pageSize,
        sort_by: query?.sortBy,
        sort_order: query?.sortOrder,
      })

      return {
        data: (response.data.data ?? []).map(normalizeEvent).filter(Boolean) as Array<Event>,
        pagination: response.data.pagination,
      }
    },
    staleTime: 0,
    gcTime: 0,
  })
}

export function useEventDetail(id: string | undefined) {
  return useQuery({
    queryKey: [...EVENT_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null
      const response = await momentoApi.api.eventsDetail(id)
      return normalizeEvent(response.data)
    },
    enabled: !!id,
    staleTime: 0,
    gcTime: 0,
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (request: PortsCreateEventRequest) => {
      const response = await momentoApi.api.eventsCreate(request)
      return normalizeEvent(response.data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY })
    },
  })
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      request,
    }: {
      id: string
      request: PortsUpdateEventRequest
    }) => {
      const response = await momentoApi.api.eventsPartialUpdate(id, request)
      return normalizeEvent(response.data)
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...EVENT_QUERY_KEY, id] })
    },
  })
}

export function useArchiveEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await momentoApi.api.eventsArchivePartialUpdate(id)
      return normalizeEvent(response.data)
    },
    onMutate: async (id: string) => {
      // Find all event list queries that start with EVENT_QUERY_KEY
      const eventListQueries = queryClient.getQueryCache().findAll({
        queryKey: EVENT_QUERY_KEY,
      })

      // Cancel ongoing queries to avoid overwrite
      await queryClient.cancelQueries({ queryKey: EVENT_QUERY_KEY })

      // Snapshot previous values for rollback
      const previousEventsMap = new Map<string, unknown>()

      eventListQueries.forEach((query) => {
        const queryKey = query.queryKey
        const previousData = queryClient.getQueryData(queryKey)
        if (previousData) {
          previousEventsMap.set(JSON.stringify(queryKey), {
            queryKey,
            data: previousData,
          })
        }

        // Optimistically remove event from cache
        queryClient.setQueryData(queryKey, (old: { data: Array<Event> } | undefined) => {
          if (!old?.data) return old
          return {
            ...old,
            data: old.data.filter((event) => event.id !== id),
          }
        })
      })

      return { previousEventsMap }
    },
    onError: (_err, _id, context) => {
      // Rollback on error with toast
      if (context?.previousEventsMap) {
        context.previousEventsMap.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      showApiError(_err)
      toast.error('Failed to archive event')
    },
    onSuccess: () => {
      // Invalidate on success with toast
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY })
      toast.success('Event archived')
    },
  })
}

export function useRestoreEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await momentoApi.api.eventsRestorePartialUpdate(id)
      return normalizeEvent(response.data)
    },

    onSuccess: () => {
      // Invalidate on success with toast
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY })
      toast.success('Event restored')
    },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await momentoApi.api.eventsDelete(id)
      return id
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...EVENT_QUERY_KEY, id] })
    },
  })
}