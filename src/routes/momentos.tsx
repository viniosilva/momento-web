import { useEffect, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { CalendarHeart, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Event } from "@/hooks/use-events"
import { eventSchema } from "@/schemas/event.schema"
import { useAuth } from "@/hooks/use-auth"
import { useCurrentUserId } from "@/hooks/use-current-user"
import { useArchiveEvent, useCreateEvent, useEventsList, useRestoreEvent, useUpdateEvent } from "@/hooks/use-events"
import { Footer } from "@/components/ui/footer"
import { Header } from "@/components/ui/header"
import { EventDialog } from "@/components/ui/event-dialog"
import { EventCard } from "@/components/ui/event-card"
import { ArchiveConfirmDialog } from "@/components/ui/archive-confirm-dialog"

const eventFormSchema = eventSchema.pick({ title: true, content: true })

export const Route = createFileRoute("/momentos")({ component: Momentos })

function Momentos() {
  const { isAuthenticated } = useAuth()
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [open, setOpen] = useState(false)
  const [archiveConfirmOpen, setArchiveConfirmOpen] = useState(false)
  const [eventToArchive, setEventToArchive] = useState<string | null>(null)

  const { data: eventsData, isLoading, error } = useEventsList()
  const createEvent = useCreateEvent()
  const updateEvent = useUpdateEvent()
  const archiveEvent = useArchiveEvent()
  const restoreEvent = useRestoreEvent()

  const events = eventsData?.data ?? []
  const currentUserId = useCurrentUserId()

  const handleSave = async (data: { title: string; content: string }) => {
    const result = eventFormSchema.safeParse(data)
    if (!result.success) {
      const errors = result.error.issues.map((issue) => issue.message).join(", ")
      toast.error(errors)
      return
    }

    try {
      const eventId = selectedEvent?.id ?? null
      if (eventId === null) {
        await createEvent.mutateAsync({
          title: result.data.title,
          content: result.data.content,
        })
      } else {
        if (result.data.title !== selectedEvent?.title || result.data.content !== selectedEvent?.content) {
          await updateEvent.mutateAsync({
            id: eventId,
            request: {
              title: result.data.title,
              content: result.data.content,
            },
          })
          toast.success(eventId === null ? "Event created!" : "Event updated!")
        }
      }
      setOpen(false)      
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save event")
    }
  }

  const handleArchive = (event: Event) => {
    setEventToArchive(event.id)
    setArchiveConfirmOpen(true)
  }

  const handleConfirmArchive = async () => {
    if (!eventToArchive || selectedEvent?.id !== eventToArchive) return
    try {
      await archiveEvent.mutateAsync(eventToArchive)
      selectedEvent.archivedAt = new Date().toISOString()
      setSelectedEvent(selectedEvent)
    } catch (err) {
      // Error toast is handled by the mutation hook's onError
      console.error('Archive failed:', err)
    } finally {
      setEventToArchive(null)
      setArchiveConfirmOpen(false)
    }
  }

  const handleRestore = async (event: Event) => {
    if (!event) return
    try {
      await restoreEvent.mutateAsync(event.id)
      event.archivedAt = ""
      setSelectedEvent({ ...event })
    } catch (err) {
      // Error toast is handled by the mutation hook's onError
      console.error('Restore failed:', err)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto p-4 flex flex-col gap-8">
          <div className="flex flex-col items-center justify-center gap-4 mt-8">
            <CalendarHeart className="w-12 h-12 text-chart-1" />
            <span className="text-center text-gray-500">
              Please log in to view your momentos
            </span>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 flex flex-col gap-8">
        <div className="flex items-center justify-center">
          <input
            type="text"
            placeholder="Create an event..."
            className="mt-1 w-1/2 px-3 py-2 border border-border focus:outline-chart-1 mb-4"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setOpen(true)
              }
            }}
            onClick={(e) => {
              e.preventDefault()
              setSelectedEvent(null)
              setOpen(true)
            }}
            autoFocus
          />
        </div>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-chart-1" />
            <span className="text-center text-gray-500">Loading momentos...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-center text-red-500">{error.message}</span>
          </div>
        ) : !events.length ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <CalendarHeart className="w-12 h-12 text-chart-1" />
            <span className="text-center text-gray-500">
              Events created will be displayed here
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap items-start gap-4">
            {events.map((event) => {
              const isArchiving = archiveEvent.isPending && eventToArchive === event.id

              return (
                <EventCard
                  key={event.id}
                  event={event}
                  onArchive={() => handleArchive(event)}
                  onRestore={() => handleRestore(event)}
                  isLoading={isArchiving}
                  className="w-[16rem] min-h-[16rem] max-h-[32rem] transition-all duration-200 ease-in data-[removed]:scale-95 data-[removed]:opacity-0"
                  onClick={() => {
                    setSelectedEvent(event)
                    setOpen(true)
                  }}
                />
              )
            })}
          </div>
        )}
        <EventDialog
          open={open}
          event={selectedEvent}
          onOpenChange={setOpen}
          onArchive={handleArchive}
          onRestore={handleRestore}
          onSave={handleSave}
          isLoading={createEvent.isPending || updateEvent.isPending}
          isOwner={selectedEvent?.ownerUserId === currentUserId}
        />
        <ArchiveConfirmDialog
          open={archiveConfirmOpen}
          onOpenChange={setArchiveConfirmOpen}
          onConfirm={handleConfirmArchive}
        />
      </main>
      <Footer />
    </div>
  )
}

export default Momentos