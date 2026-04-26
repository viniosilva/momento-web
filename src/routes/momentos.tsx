import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { CalendarHeart, Loader2 } from "lucide-react"
import { eventSchema } from "@/schemas/event.schema"
import { useAuth } from "@/hooks/use-auth"
import { useCurrentUserId } from "@/hooks/use-current-user"
import { useArchiveEvent, useCreateEvent, useEventsList, useRestoreEvent, useUpdateEvent } from "@/hooks/use-events"
import { Footer } from "@/components/ui/footer"
import { Header } from "@/components/ui/header"
import { EventDialog } from "@/components/ui/event-dialog"
import { EventCard } from "@/components/ui/event-card"
import { EventCardMenu } from "@/components/ui/event-card-menu"
import { ArchiveConfirmDialog } from "@/components/ui/archive-confirm-dialog"

const eventFormSchema = eventSchema.pick({ title: true, content: true })

export const Route = createFileRoute("/momentos")({ component: Momentos })

function Momentos() {
  const { isAuthenticated } = useAuth()
  const currentUserId = useCurrentUserId()
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [archiveConfirmOpen, setArchiveConfirmOpen] = useState(false)
  const [eventToArchive, setEventToArchive] = useState<string | null>(null)

  const { data: eventsData, isLoading, error } = useEventsList()
  const createEvent = useCreateEvent()
  const updateEvent = useUpdateEvent()
  const archiveEvent = useArchiveEvent()
  const restoreEvent = useRestoreEvent()

  const events = eventsData?.data ?? []

  const handleSubmit = async (_title: string, _content: string) => {
    const result = eventFormSchema.safeParse({ title: _title, content: _content })
    if (!result.success) {
      const errors = result.error.issues.map((issue) => issue.message).join(", ")
      throw new Error(errors)
    }

    try {
      if (selectedEventId === null) {
        await createEvent.mutateAsync({
          title: result.data.title,
          content: result.data.content,
        })
      } else {
        await updateEvent.mutateAsync({
          id: selectedEventId,
          request: {
            title: result.data.title,
            content: result.data.content,
          },
        })
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to save event")
    }
  }

  const handleArchive = (id: string) => {
    setEventToArchive(id)
    setArchiveConfirmOpen(true)
  }

  const handleConfirmArchive = async () => {
    if (!eventToArchive) return
    try {
      await archiveEvent.mutateAsync(eventToArchive)
    } finally {
      setEventToArchive(null)
      setArchiveConfirmOpen(false)
    }
  }

  const handleRestore = async (id: string) => {
    await restoreEvent.mutateAsync(id)
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
              if (e.key.length === 1) {
                setOpen(true)
              }
            }}
            onClick={(e) => {
              e.preventDefault()
              setSelectedEventId(null)
              setTitle("")
              setContent("")
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
              const isOwner = event.ownerUserId === currentUserId
              const isArchived = !!event.archivedAt
              const isArchiving = archiveEvent.isPending && eventToArchive === event.id

              return (
                <EventCard
                  key={event.id}
                  title={event.title}
                  content={event.content}
                  isLoading={isArchiving}
                  className="w-[16rem] min-h-[16rem] max-h-[32rem] transition-all duration-200 ease-in data-[removed]:scale-95 data-[removed]:opacity-0"
                  onClick={() => {
                    setSelectedEventId(event.id)
                    setTitle(event.title)
                    setContent(event.content)
                    setOpen(true)
                  }}
                  menu={
                    <EventCardMenu
                      isOwner={isOwner}
                      isArchived={isArchived}
                      onArchive={() => handleArchive(event.id)}
                      onRestore={() => handleRestore(event.id)}
                      isLoading={isArchiving}
                    />
                  }
                />
              )
            })}
          </div>
        )}
        <EventDialog
          open={open}
          onOpenChange={setOpen}
          title={title}
          content={content}
          onTitleChange={setTitle}
          onContentChange={setContent}
          onSave={handleSubmit}
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