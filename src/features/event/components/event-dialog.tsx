import * as React from "react"
import type { Event } from "@/hooks/use-events"
import { useImageUploader, useListImages } from "@/hooks/use-event-images"
import { useCurrentUserId } from "@/hooks/use-current-user"
import { EventCardMenu } from "@/features/event/components/event-card-menu"
import { EventImageThumbnails } from "@/features/event/components/event-image-thumbnails"
import { EventNavMenu } from "@/features/event/components/event-nav-menu"
import { ImageGalleryDialog } from "@/features/event/components/image-gallery-dialog"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ACCEPTED_IMAGE_TYPES } from "@/features/event/schemas/event.schema"

export interface EventDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: Event | null
  onSave?: (data: { title: string; content: string }) => void
  onArchive?: (event: Event) => void
  onRestore?: (event: Event) => void
  onDelete?: (event: Event) => void
  isLoading?: boolean
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
      trigger,
      className,
      ...props
    },
    ref
  ) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const currentUserId = useCurrentUserId()

    const [title, setTitle] = React.useState(event?.title ?? "")
    const [content, setContent] = React.useState(event?.content ?? "")
    const [error, setError] = React.useState<string | null>(null)
    const [galleryOpen, setGalleryOpen] = React.useState(false)
    const [uploading, setUploading] = React.useState(false)

    const imageUploader = useImageUploader(event?.id)

    const prevOpen = React.useRef(false)
    const eventId = open ? event?.id : undefined
    const { data: images = [] } = useListImages(
      eventId && open && !galleryOpen ? eventId : undefined
    )

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

    const isOwner = event ? event.ownerUserId === currentUserId : false

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

    const handleOpenGallery = React.useCallback(() => {
      setGalleryOpen(true)
    }, [])

    return (
      <>
        <Dialog open={open} onOpenChange={onOpenChange}>
          {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
          <DialogContent
            ref={ref}
            showCloseButton={false}
            className={cn(className)}
            {...props}
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event title..."
                className="flex-1 bg-transparent text-lg font-normal focus:outline-none"
                aria-label="Event title"
              />
              {event?.id && (
                <EventCardMenu
                  isOwner={isOwner ?? false}
                  isArchived={!!event.archivedAt}
                  onArchive={handleArchive}
                  onRestore={handleRestore}
                  onDelete={onDelete ? handleDelete : undefined}
                  isLoading={isLoading}
                />
              )}
            </div>
            <nav>
              {isOwner && (
                <EventNavMenu
                  isOwner={isOwner}
                  isLoading={isLoading ?? false}
                  uploading={uploading}
                  fileInputRef={fileInputRef}
                />
              )}
            </nav>
            <div className="flex flex-col flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Take a note..."
                className="w-full h-full resize-none bg-transparent text-sm focus:outline-none"
              />

              <EventImageThumbnails
                images={images}
                onOpenGallery={handleOpenGallery}
              />

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

            </div>
            <DialogFooter className="gap-2 justify-end">
              <Button
                variant="outline"
                className="w-min"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* File input must stay outside the Dropdown because the menu unmounts on select, cancelling onChange */}
        <input
          ref={fileInputRef}
          id="files"
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          multiple
          className="hidden"
          onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;

            setUploading(true);
            try {
              await imageUploader.mutateAsync(Array.from(files));
            } finally {
              setUploading(false);
              e.target.value = '';
            }
          }}
        />

        {event?.id && (
          <ImageGalleryDialog
            open={galleryOpen}
            onOpenChange={setGalleryOpen}
            eventId={event.id}
            isOwner={isOwner}
            className="top-24"
          />
        )}
      </>
    )
  }
)

EventDialog.displayName = "EventDialog"
