import { useCallback, useEffect, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { CalendarHeart, Loader2 } from "lucide-react"
import type { Event } from "@/schemas/event.schema"
import { eventSchema } from "@/schemas/event.schema"
import { api } from "@/api/api"
import type { PortsEventResponse } from "@/api"
import { useAuth } from "@/hooks/use-auth"
import { Footer } from "@/components/ui/footer"
import { Header } from "@/components/ui/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EventDialog } from "@/components/ui/event-dialog"

const eventFormSchema = eventSchema.pick({ title: true, content: true })

export const Route = createFileRoute("/momentos")({ component: Momentos })

function convertToEvent(apiResponse: PortsEventResponse): Event {
  const id: string = apiResponse.id ?? ""
  const title: string = apiResponse.title ?? ""
  const content: string = apiResponse.content ?? ""
  const createdAt: string = apiResponse.created_at ?? ""
  return {
    id,
    title,
    content,
    createdAt,
  }
}

function Momentos() {
  const { isAuthenticated } = useAuth()
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [events, setEvents] = useState<Array<Event>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await api.events.eventsList()
      const data = response.data
      const eventsList = (data.data ?? []).map(convertToEvent)
      setEvents(eventsList)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch events")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents()
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, fetchEvents])

  const handleSubmit = async (_title: string, _content: string) => {
    const result = eventFormSchema.safeParse({ title: _title, content: _content })
    if (!result.success) {
      const errors = result.error.issues.map((issue) => issue.message).join(", ")
      throw new Error(errors)
    }

    try {
      if (selectedEventId === null) {
        await api.events.eventsCreate({
          title: result.data.title,
          content: result.data.content,
        })
      } else {
        await api.events.eventsPartialUpdate(selectedEventId, {
          title: result.data.title,
          content: result.data.content,
        })
      }
      await fetchEvents()
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to save event")
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
            <span className="text-center text-red-500">{error}</span>
          </div>
        ) : !events.length ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <CalendarHeart className="w-12 h-12 text-chart-1" />
            <span className="text-center text-gray-500">
              Events created will be displayed here
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap items-start gap-4">
            {events.map((event) => (
              <Card
                key={event.id}
                className="w-[16rem] min-h-[16rem] max-h-[32rem]"
                onClick={() => {
                  setSelectedEventId(event.id)
                  setTitle(event.title)
                  setContent(event.content)
                  setOpen(true)
                }}
              >
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-22">{event.content}</p>
                </CardContent>
              </Card>
            ))}
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
      </main>
      <Footer />
    </div>
  )
}

export default Momentos