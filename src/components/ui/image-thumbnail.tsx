import { ImageOff } from "lucide-react"
import { useState } from "react"
import type { EventImage } from "@/features/event/schemas/event.schema"

interface ImageThumbnailProps {
  img: EventImage
}

export function ImageThumbnail({ img }: ImageThumbnailProps) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className="h-24 w-24 flex items-center justify-center bg-muted ring-2 ring-background">
        <ImageOff className="h-5 w-5 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="h-24 w-24 overflow-hidden ring-2 ring-background">
      <img
        src={img.download_url}
        alt=""
        className="h-full w-full object-cover"
        onError={() => setError(true)}
      />
    </div>
  )
}
