import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { CalendarHeart } from "lucide-react"
import { Footer } from "@/components/ui/footer"
import { Header } from "@/components/ui/header"
import { EventDialog } from "@/components/ui/event-dialog"


export const Route = createFileRoute("/momentos")({ component: Momentos })

function Momentos() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const handleSubmit = (_title: string, _content: string) => {
    console.log("SAVED:", { title: _title, content: _content })
  }

  return (
    <>
      <Header />
      <main className="container mx-auto p-4 flex flex-col gap-8">
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
              setOpen(true)
            }}
            autoFocus
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <CalendarHeart className="w-12 h-12 text-gray-400" />
          <p className="text-center text-gray-500">Events created will be displayed here</p>
        </div>
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
    </>
  )
}

export default Momentos