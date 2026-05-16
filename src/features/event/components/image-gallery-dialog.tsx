import * as React from "react"
import { Images, Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { ImageCarousel } from "@/components/ui/image-carousel"
import { ImageUpload } from "@/features/event/components/image-upload"
import { useListImages, useDeleteImage } from "@/hooks/use-event-images"
import type { EventImage } from "@/features/event/schemas/event.schema"
import { Button } from "@/components/ui/button"

export interface ImageGalleryDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventId: string
  isOwner?: boolean
}

function ImageThumbnail({ image, onDelete, onImageClick, isOwner }: {
  image: EventImage
  onDelete: (path: string) => void
  onImageClick: () => void
  isOwner: boolean
}) {
  const [imgError, setImgError] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      onDelete(image.path)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="group relative overflow-hidden">
      {imgError ? (
        <div className="flex h-32 w-32 items-center justify-center bg-muted">
          <span className="text-xs text-muted-foreground">Failed to load</span>
        </div>
      ) : (
        <button
          type="button"
          onClick={onImageClick}
          className="cursor-pointer"
        >
          <img
            src={image.download_url}
            alt="Event image"
            className="h-32 w-32 object-cover transition-transform duration-200 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        </button>
      )}

      {/* Hover overlay with actions */}
      <div className="absolute inset-0 flex pt-1 pr-1 justify-end gap-2 transition-colors duration-200 group-hover:bg-black/40 pointer-events-none">
        {isOwner && (
          <button
            onClick={() => setConfirmOpen(true)}
            disabled={deleting}
            className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-destructive/90 text-destructive-foreground opacity-0 transition-all duration-200 hover:bg-destructive group-hover:opacity-100 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleDelete}
        title="Delete image?"
        description="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}

export function ImageGalleryDialog({
  open,
  onOpenChange,
  eventId,
  isOwner = false,
  className,
  ...props
}: ImageGalleryDialogProps) {
  const { data: images = [], isLoading, isError } = useListImages(open ? eventId : undefined)
  const deleteImage = useDeleteImage()
  const [carouselOpen, setCarouselOpen] = React.useState(false)
  const [carouselIndex, setCarouselIndex] = React.useState(0)

  const handleDelete = async (path: string) => {
    try {
      await deleteImage.mutateAsync({ eventId, path })
    } catch {
      toast.error("Failed to delete image")
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent showCloseButton={false} size="lg" className={className}  {...props}>
          <DialogHeader>
            <DialogTitle className="flex height-min-content items-center gap-2">
              <Images className="h-4 w-4" />
              Event Images
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col flex-1 gap-4 overflow-y-auto p-1">
            {/* Upload area */}
            {isOwner && (
              <div className="border-b border-border pb-3">
                <ImageUpload eventId={eventId} />
              </div>
            )}

            {/* Gallery grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-chart-1" />
              </div>
            ) : isError ? (
              <div className="flex items-center justify-center py-8">
                <span className="text-sm text-destructive">Failed to load images</span>
              </div>
            ) : images.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Images className="h-8 w-8" />
                  <span className="text-sm">No images yet</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {images.map((image, index) => (
                  <ImageThumbnail
                    key={image.path}
                    image={image}
                    onDelete={handleDelete}
                    onImageClick={() => { setCarouselIndex(index); setCarouselOpen(true) }}
                    isOwner={isOwner}
                  />
                ))}
              </div>
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
      <ImageCarousel
        open={carouselOpen}
        onOpenChange={setCarouselOpen}
        images={images}
        initialIndex={carouselIndex}
      />
    </>
  )
}
