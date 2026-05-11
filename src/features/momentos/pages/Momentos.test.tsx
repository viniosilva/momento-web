import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithFileRoutes } from '@/test/file-route-utils'
import { Momentos } from './Momentos'
import { useAuth } from '@/hooks/use-auth'
import { useEventsList, useCreateEvent, useUpdateEvent, useArchiveEvent, useRestoreEvent, useDeleteEvent } from '@/hooks/use-events'
import { useCurrentUserId } from '@/hooks/use-current-user'
import { toast } from 'sonner'
import React from 'react'

vi.mock('lucide-react', () => ({
  CalendarHeart: (props: any) => React.createElement('div', { ...props, 'data-testid': 'calendar-heart' }),
  Loader2: (props: any) => React.createElement('div', { ...props, 'data-testid': 'loader2' }),
}))

vi.mock('@/hooks/use-auth', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}))

vi.mock('@/hooks/use-events', () => ({
  useEventsList: vi.fn(),
  useCreateEvent: vi.fn(),
  useUpdateEvent: vi.fn(),
  useArchiveEvent: vi.fn(),
  useRestoreEvent: vi.fn(),
  useDeleteEvent: vi.fn(),
}))

vi.mock('@/hooks/use-current-user', () => ({
  useCurrentUserId: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}))

vi.mock('@/components/ui/header', () => ({
  Header: () => React.createElement('div', { 'data-testid': 'header' }, 'Header'),
}))

vi.mock('@/components/ui/footer', () => ({
  Footer: () => React.createElement('div', { 'data-testid': 'footer' }, 'Footer'),
}))

let saveData = { title: 'Test', content: 'Content' }

vi.mock('@/components/ui/event-dialog', () => ({
  EventDialog: ({ open, onSave, onArchive, onRestore, onDelete }: any) =>
    open ? React.createElement('div', { 'data-testid': 'event-dialog' },
      React.createElement('button', { onClick: () => onSave?.(saveData) }, 'Save'),
      React.createElement('button', { onClick: () => onArchive?.() }, 'Archive'),
      React.createElement('button', { onClick: () => onRestore?.() }, 'Restore'),
      React.createElement('button', { onClick: () => onDelete?.() }, 'Delete'),
    ) : null,
}))

vi.mock('@/components/ui/event-card', () => ({
  EventCard: ({ event, onArchive, onRestore, onDelete, onClick }: any) =>
    React.createElement('div', { 'data-testid': `event-card-${event.id}`, onClick },
      React.createElement('span', null, event.title),
      React.createElement('button', { onClick: (e: any) => { e.stopPropagation(); onArchive?.() } }, 'Archive'),
      React.createElement('button', { onClick: (e: any) => { e.stopPropagation(); onRestore?.() } }, 'Restore'),
      React.createElement('button', { onClick: (e: any) => { e.stopPropagation(); onDelete?.() } }, 'Delete'),
    ),
}))

vi.mock('@/components/ui/confirm-dialog', () => ({
  ConfirmDialog: ({ open, onConfirm, onOpenChange, title }: any) =>
    open ? React.createElement('div', { 'data-testid': 'confirm-dialog' },
      React.createElement('span', null, title),
      React.createElement('button', { onClick: onConfirm }, 'Confirm'),
      React.createElement('button', { onClick: () => onOpenChange(false) }, 'Cancel'),
    ) : null,
}))

const mockEvents = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Event 1',
    content: 'Content 1',
    ownerUserId: 'user-1',
    createdAt: '2026-05-08T14:30:00Z',
    archivedAt: '',
  },
  {
    id: '223e4567-e89b-12d3-a456-426614174001',
    title: 'Event 2',
    content: 'Content 2',
    ownerUserId: 'user-1',
    createdAt: '2026-05-08T15:30:00Z',
    archivedAt: '2026-05-08T16:00:00Z',
  },
]

describe('Momentos', () => {
  const mockCreateEvent = { mutateAsync: vi.fn(), isPending: false }
  const mockUpdateEvent = { mutateAsync: vi.fn(), isPending: false }
  const mockArchiveEvent = { mutateAsync: vi.fn(), isPending: false }
  const mockRestoreEvent = { mutateAsync: vi.fn(), isPending: false }
  const mockDeleteEvent = { mutateAsync: vi.fn(), isPending: false }

  beforeEach(() => {
    vi.clearAllMocks()

    const authCtx = { isAuthenticated: true } as unknown as ReturnType<typeof useAuth>
    vi.mocked(useAuth).mockReturnValue(authCtx)
    vi.mocked(useCurrentUserId).mockReturnValue('user-1')
    vi.mocked(useEventsList).mockReturnValue({
      data: { data: [] },
      isLoading: false,
      error: null,
    } as any)
    vi.mocked(useCreateEvent).mockReturnValue(mockCreateEvent as any)
    vi.mocked(useUpdateEvent).mockReturnValue(mockUpdateEvent as any)
    vi.mocked(useArchiveEvent).mockReturnValue(mockArchiveEvent as any)
    vi.mocked(useRestoreEvent).mockReturnValue(mockRestoreEvent as any)
    vi.mocked(useDeleteEvent).mockReturnValue(mockDeleteEvent as any)
  })

  it('renders header and footer', () => {
    renderWithFileRoutes(<Momentos />)
    expect(screen.getByTestId('header')).toBeDefined()
    expect(screen.getByTestId('footer')).toBeDefined()
  })

  it('shows login prompt when not authenticated', () => {
    const authCtx = { isAuthenticated: false } as unknown as ReturnType<typeof useAuth>
    vi.mocked(useAuth).mockReturnValue(authCtx)
    renderWithFileRoutes(<Momentos />)
    expect(screen.getByText('Please log in to view your momentos')).toBeDefined()
  })

  it('shows loading state', () => {
    vi.mocked(useEventsList).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    } as any)
    renderWithFileRoutes(<Momentos />)
    expect(screen.getByText('Loading momentos...')).toBeDefined()
  })

  it('shows error state', () => {
    vi.mocked(useEventsList).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to load'),
    } as any)
    renderWithFileRoutes(<Momentos />)
    expect(screen.getByText('Failed to load')).toBeDefined()
  })

  it('shows empty state when no events', () => {
    renderWithFileRoutes(<Momentos />)
    expect(screen.getByText('Events created will be displayed here')).toBeDefined()
  })

  it('renders events when available', () => {
    vi.mocked(useEventsList).mockReturnValue({
      data: { data: mockEvents },
      isLoading: false,
      error: null,
    } as any)
    renderWithFileRoutes(<Momentos />)
    expect(screen.getByTestId('event-card-123e4567-e89b-12d3-a456-426614174000')).toBeDefined()
    expect(screen.getByTestId('event-card-223e4567-e89b-12d3-a456-426614174001')).toBeDefined()
  })

  it('opens dialog on Enter key in input', () => {
    renderWithFileRoutes(<Momentos />)
    const input = screen.getByPlaceholderText('Create an event...')
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getByTestId('event-dialog')).toBeDefined()
  })

  it('opens dialog on input click', () => {
    renderWithFileRoutes(<Momentos />)
    const input = screen.getByPlaceholderText('Create an event...')
    fireEvent.click(input)
    expect(screen.getByTestId('event-dialog')).toBeDefined()
  })

  it('creates new event', async () => {
    renderWithFileRoutes(<Momentos />)
    const input = screen.getByPlaceholderText('Create an event...')
    fireEvent.click(input)

    const saveBtn = screen.getByText('Save')
    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(mockCreateEvent.mutateAsync).toHaveBeenCalledWith({
        title: 'Test',
        content: 'Content',
      })
    })
  })

  it('updates existing event', async () => {
    vi.mocked(useEventsList).mockReturnValue({
      data: { data: mockEvents },
      isLoading: false,
      error: null,
    } as any)

    renderWithFileRoutes(<Momentos />)
    const eventCard = screen.getByTestId('event-card-123e4567-e89b-12d3-a456-426614174000')
    fireEvent.click(eventCard)

    const saveBtn = screen.getByText('Save')
    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(mockUpdateEvent.mutateAsync).toHaveBeenCalled()
    })
  })

  it('shows archive confirmation', () => {
    vi.mocked(useEventsList).mockReturnValue({
      data: { data: mockEvents },
      isLoading: false,
      error: null,
    } as any)

    renderWithFileRoutes(<Momentos />)
    const archiveBtn = screen.getAllByText('Archive')[0]
    fireEvent.click(archiveBtn)

    expect(screen.getByTestId('confirm-dialog')).toBeDefined()
    expect(screen.getByText('Archive event?')).toBeDefined()
  })

  it('confirms archive', async () => {
    vi.mocked(useEventsList).mockReturnValue({
      data: { data: mockEvents },
      isLoading: false,
      error: null,
    } as any)

    renderWithFileRoutes(<Momentos />)
    const eventCard = screen.getByTestId('event-card-123e4567-e89b-12d3-a456-426614174000')
    fireEvent.click(eventCard)

    const archiveBtn = screen.getAllByText('Archive')[0]
    fireEvent.click(archiveBtn)

    const confirmBtn = screen.getByText('Confirm')
    fireEvent.click(confirmBtn)

    await waitFor(() => {
      expect(mockArchiveEvent.mutateAsync).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000')
    })
  })

  it('restores event', async () => {
    vi.mocked(useEventsList).mockReturnValue({
      data: { data: [mockEvents[1]] },
      isLoading: false,
      error: null,
    } as any)

    renderWithFileRoutes(<Momentos />)
    const restoreBtn = screen.getAllByText('Restore')[0]
    fireEvent.click(restoreBtn)

    await waitFor(() => {
      expect(mockRestoreEvent.mutateAsync).toHaveBeenCalledWith('223e4567-e89b-12d3-a456-426614174001')
    })
  })

  it('shows delete confirmation', () => {
    vi.mocked(useEventsList).mockReturnValue({
      data: { data: mockEvents },
      isLoading: false,
      error: null,
    } as any)

    renderWithFileRoutes(<Momentos />)
    const deleteBtn = screen.getAllByText('Delete')[0]
    fireEvent.click(deleteBtn)

    expect(screen.getByTestId('confirm-dialog')).toBeDefined()
    expect(screen.getByText('Delete event?')).toBeDefined()
  })

  it('confirms delete', async () => {
    vi.mocked(useEventsList).mockReturnValue({
      data: { data: mockEvents },
      isLoading: false,
      error: null,
    } as any)

    renderWithFileRoutes(<Momentos />)
    const deleteBtn = screen.getAllByText('Delete')[0]
    fireEvent.click(deleteBtn)

    const confirmBtn = screen.getByText('Confirm')
    fireEvent.click(confirmBtn)

    await waitFor(() => {
      expect(mockDeleteEvent.mutateAsync).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000')
    })
  })

  it('handles validation error on save', async () => {
    saveData = { title: '', content: '' }

    renderWithFileRoutes(<Momentos />)
    const input = screen.getByPlaceholderText('Create an event...')
    fireEvent.click(input)

    const saveBtn = screen.getByText('Save')
    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled()
    })

    saveData = { title: 'Test', content: 'Content' }
  })

  it('handles error on save event', async () => {
    mockCreateEvent.mutateAsync.mockRejectedValueOnce(new Error('Failed to save'))

    renderWithFileRoutes(<Momentos />)
    const input = screen.getByPlaceholderText('Create an event...')
    fireEvent.click(input)

    const saveBtn = screen.getByText('Save')
    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to save')
    })
  })

  it('handles error on archive event', async () => {
    mockArchiveEvent.mutateAsync.mockRejectedValueOnce(new Error('Archive failed'))

    vi.mocked(useEventsList).mockReturnValue({
      data: { data: mockEvents },
      isLoading: false,
      error: null,
    } as any)

    renderWithFileRoutes(<Momentos />)

    const eventCard = screen.getByTestId('event-card-123e4567-e89b-12d3-a456-426614174000')
    fireEvent.click(eventCard)

    const archiveBtn = screen.getAllByText('Archive')[0]
    fireEvent.click(archiveBtn)

    const confirmBtn = screen.getByText('Confirm')
    fireEvent.click(confirmBtn)

    await waitFor(() => {
      expect(mockArchiveEvent.mutateAsync).toHaveBeenCalled()
    }, { timeout: 3000 })
  })

  it('handles error on restore event', async () => {
    mockRestoreEvent.mutateAsync.mockRejectedValueOnce(new Error('Restore failed'))

    vi.mocked(useEventsList).mockReturnValue({
      data: { data: [mockEvents[1]] },
      isLoading: false,
      error: null,
    } as any)

    renderWithFileRoutes(<Momentos />)
    const restoreBtn = screen.getAllByText('Restore')[0]
    fireEvent.click(restoreBtn)

    await waitFor(() => {
      expect(mockRestoreEvent.mutateAsync).toHaveBeenCalled()
    })
  })

  it('handles error on delete event', async () => {
    mockDeleteEvent.mutateAsync.mockRejectedValueOnce(new Error('Delete failed'))

    vi.mocked(useEventsList).mockReturnValue({
      data: { data: mockEvents },
      isLoading: false,
      error: null,
    } as any)

    renderWithFileRoutes(<Momentos />)
    const deleteBtn = screen.getAllByText('Delete')[0]
    fireEvent.click(deleteBtn)

    const confirmBtn = screen.getByText('Confirm')
    fireEvent.click(confirmBtn)

    await waitFor(() => {
      expect(mockDeleteEvent.mutateAsync).toHaveBeenCalled()
    })
  })
})
