import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { PortsCreateEventRequest, PortsEventResponse, PortsUpdateEventRequest } from '@/api'
import { api } from '@/api/api'

const EVENT_QUERY_KEY = ['events']

function normalizeEvent(raw: PortsEventResponse | undefined): Event | null {
  if (!raw) return null

  return {
    id: raw.id ?? '',
    title: raw.title ?? '',
    content: raw.content ?? '',
    userId: raw.user_id ?? '',
    createdAt: raw.created_at ?? '',
    updatedAt: raw.updated_at ?? '',
  }
}

export interface Event {
  id: string
  title: string
  content: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface EventsListParams {
  page?: number
  pageSize?: number
  sortBy?: 'created_at' | 'updated_at'
  sortOrder?: 'asc' | 'desc'
}

export function useEventsList(query?: EventsListParams) {
  return useQuery({
    queryKey: [...EVENT_QUERY_KEY, query],
    queryFn: async () => {
      const response = await api.events.eventsList({
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
      const response = await api.events.eventsDetail(id)
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
      const response = await api.events.eventsCreate(request)
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
      const response = await api.events.eventsPartialUpdate(id, request)
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
      const response = await api.events.eventsArchivePartialUpdate(id)
      return normalizeEvent(response.data)
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...EVENT_QUERY_KEY, id] })
    },
  })
}

export function useRestoreEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.events.eventsRestorePartialUpdate(id)
      return normalizeEvent(response.data)
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...EVENT_QUERY_KEY, id] })
    },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.events.eventsDelete(id)
      return id
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...EVENT_QUERY_KEY, id] })
    },
  })
}