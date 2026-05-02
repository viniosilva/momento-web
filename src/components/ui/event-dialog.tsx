import * as React from "react"

import type { Event } from "@/hooks/use-events"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { EventCardMenu } from "@/components/ui/event-card-menu"

export interface EventDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: Event | null
  onSave?: (data: { title: string; content: string }) => void
  onArchive?: (event: Event) => void
  onRestore?: (event: Event) => void
  onDelete?: (event: Event) => void
  isLoading?: boolean
  isOwner?: boolean
  trigger?: React.ReactNode
}

export const EventDialog = React.forwardRef<HTMLDivElement, EventDialogProps>(
  (
    {
      open,
      onOpenChange,
      event,
      onSave,
      onArchive,
      onRestore,
      onDelete,
      isLoading,
      isOwner,
      trigger,
      className,
      ...props
    },
    ref
  ) => {
    const [title, setTitle] = React.useState(event?.title ?? "")
    const [content, setContent] = React.useState(event?.content ?? "")
    const [error, setError] = React.useState<string | null>(null)

    const prevOpen = React.useRef(false)

    React.useEffect(() => {
      if (open && !prevOpen.current) {
        setTitle(event?.title ?? "")
        setContent(event?.content ?? "")
        setError(null)
      } else if (!open && prevOpen.current) {
        setError(null)
        onSave?.({ title: title.trim(), content: content.trim() })
      }
      
      prevOpen.current = open
    }, [open, event])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.ctrlKey && e.key === "Enter") {
        onOpenChange(false)
      }
    }

    const handleArchive = React.useCallback(() => {
      if (event?.id && onArchive) {
        onArchive(event)
      }
    }, [event?.id, onArchive])

    const handleRestore = React.useCallback(() => {
      if (event?.id && onRestore) {
        onRestore(event)
      }
    }, [event?.id, onRestore])

    const handleDelete = React.useCallback(() => {
      if (event?.id && onDelete) {
        onDelete(event)
      }
    }, [event?.id, onDelete])

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
        <DialogContent
          ref={ref}
          showCloseButton={false}
          className={cn(className)}
          {...props}
        >
          <div className="flex flex-col gap-4" onKeyDown={handleKeyDown}>
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event title..."
                className="flex-1 bg-transparent text-lg font-normal focus:outline-none"
                aria-label="Event title"
              />
              <EventCardMenu
                isOwner={isOwner ?? false}
                isArchived={!!event?.archivedAt}
                onArchive={handleArchive}
                onRestore={handleRestore}
                onDelete={onDelete ? handleDelete : undefined}
                isLoading={isLoading}
              />
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Take a note..."
              className="w-full h-full resize-none bg-transparent text-sm focus:outline-none"
            />

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                className="w-min self-end"
                onClick={() => onOpenChange(false)}
                disabled={!title.trim() || isLoading}
              >
                Close
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
)

EventDialog.displayName = "EventDialog"
