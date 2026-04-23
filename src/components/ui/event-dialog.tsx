import * as React from "react"

import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface EventDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: string
  content?: string
  onTitleChange?: (title: string) => void
  onContentChange?: (content: string) => void
  onSave?: (title: string, content: string) => void
  trigger?: React.ReactNode
}

function EventDialog({
  open,
  onOpenChange,
  title,
  content,
  onTitleChange,
  onContentChange,
  onSave,
  trigger,
}: EventDialogProps) {
  const [localTitle, setLocalTitle] = React.useState("")
  const [localContent, setLocalContent] = React.useState("")
  const [hasChanges, setHasChanges] = React.useState(false)
  const prevOpen = React.useRef(open)

  const isClosing = !open && prevOpen.current

  React.useEffect(() => {
    if (open && title !== undefined) {
      setLocalTitle(title)
    }
  }, [open, title])

  React.useEffect(() => {
    if (open && content !== undefined) {
      setLocalContent(content)
    }
  }, [open, content])

  React.useEffect(() => {
    if (isClosing) {
      if (hasChanges) {
        onSave?.(localTitle, localContent)
        setHasChanges(false)
      }

      setTimeout(() => {
        setLocalTitle("")
        setLocalContent("")
      }, 250)
    }

    prevOpen.current = open
  }, [open, isClosing])

  React.useEffect(() => {
    if (!open) return

    const interval = setInterval(() => {
      if (!hasChanges) return

      onSave?.(localTitle, localContent)
      setHasChanges(false)
    }, 1500)

    return () => clearInterval(interval)
  }, [open, localTitle, localContent, onSave, hasChanges])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent showCloseButton={false}>
        <div className="flex flex-col gap-4" onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.ctrlKey && e.key === "Enter") {
            onOpenChange?.(false)
          }
        }}>
          <input
            type="text"
            value={localTitle}
            onChange={(e) => {
              setHasChanges(true)
              setLocalTitle(e.target.value)
              onTitleChange?.(e.target.value)
            }}
            placeholder="Title"
            autoFocus
            className="w-full bg-transparent font-heading text-sm font-medium focus:outline-none"
          />
          <textarea
            value={localContent}
            onChange={(e) => {
              setHasChanges(true)
              setLocalContent(e.target.value)
              onContentChange?.(e.target.value)
            }}
            placeholder="Take a note..."
            className="w-full h-full resize-none bg-transparent text-sm focus:outline-none"
          />

          <DialogFooter className="flex">
            <Button
              variant="outline"
              className="w-min self-end"
              onClick={() => {
                onOpenChange?.(false)
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog >
  )
}

export { EventDialog }