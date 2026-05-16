import * as React from "react"
import { ImageOff } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ImageCarouselNav } from "@/components/ui/image-carousel-nav"
import type { EventImage } from "@/features/event/schemas/event.schema"

interface ImageCarouselProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  images: EventImage[]
  initialIndex?: number
}

export function ImageCarousel({ open, onOpenChange, images, initialIndex = 0 }: ImageCarouselProps) {
  const [index, setIndex] = React.useState(initialIndex)
  const [imgError, setImgError] = React.useState(false)

  React.useEffect(() => {
    setIndex(Math.min(initialIndex, Math.max(images.length - 1, 0)))
  }, [initialIndex, images.length])

  React.useEffect(() => {
    setImgError(false)
  }, [index])

  const goTo = React.useCallback((dir: "prev" | "next") => {
    setIndex((i) => {
      if (dir === "prev") return i === 0 ? images.length - 1 : i - 1
      return i === images.length - 1 ? 0 : i + 1
    })
  }, [images.length])

  if (!open || images.length === 0) return null

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goTo("prev")
    else if (e.key === "ArrowRight") goTo("next")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} onKeyDown={handleKeyDown} size="lg" className="top-24">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {index + 1} / {images.length}
          </DialogTitle>
        </DialogHeader>

        <div className="relative flex flex-1 items-center justify-center overflow-hidden">
          {imgError ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImageOff className="h-10 w-10" />
              <span className="text-sm">Failed to load image</span>
            </div>
          ) : (
            <img
              src={images[index].download_url}
              alt={`Image ${index + 1}`}
              className="max-h-full max-w-full object-contain"
              onError={() => setImgError(true)}
            />
          )}
        </div>

        <DialogFooter className="gap-2 items-center">
          <div className="flex-1" />
          {images.length > 1 && (
            <ImageCarouselNav
              total={images.length}
              current={index}
              onPrev={() => goTo("prev")}
              onNext={() => goTo("next")}
              onDotClick={setIndex}
            />
          )}
          <div className="flex-1 flex justify-end">
            <Button
              variant="outline"
              className="w-min"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
