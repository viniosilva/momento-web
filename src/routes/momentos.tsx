import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { CalendarHeart } from "lucide-react"
import { type Event, eventSchema } from "@/schemas/event.schema"
import { Footer } from "@/components/ui/footer"
import { Header } from "@/components/ui/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EventDialog } from "@/components/ui/event-dialog"

const eventFormSchema = eventSchema.pick({ title: true, content: true })


export const Route = createFileRoute("/momentos")({ component: Momentos })

function Momentos() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const initialEvents: Array<Event> = [
    {
      id: "1",
      title: "Meeting with team",
      content: "Discuss project updates and next steps",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Lunch with client",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting",
      createdAt: new Date().toISOString(),
    },
  ]

  const [events, setEvents] = useState<Array<Event>>(initialEvents)

  const handleSubmit = (_title: string, _content: string) => {
    const result = eventFormSchema.safeParse({ title: _title, content: _content })
    if (!result.success) {
      const errors = result.error.issues.map((issue) => issue.message).join(", ")
      throw new Error(errors)
    }

    if (selectedEventId === null) {
      const newEvent: Event = {
        id: crypto.randomUUID(),
        title: result.data.title,
        content: result.data.content,
        createdAt: new Date().toISOString(),
      }
      setEvents((prev) => [...prev, newEvent])
    } else {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === selectedEventId
            ? {
              ...event,
              title: result.data.title,
              content: result.data.content,
            }
            : event
        )
      )
    }
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
        {!events.length ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <CalendarHeart className="w-12 h-12 text-chart-1" />
            <span className="text-center text-gray-500">Events created will be displayed here</span>
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