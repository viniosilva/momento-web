import { Plus } from "lucide-react";
import { ImageThumbnail } from "@/components/ui/image-thumbnail"
import { useWindowWidth } from "@/hooks/use-window-width"
import type { EventImage } from "@/features/event/schemas/event.schema"

interface EventImageThumbnailsProps {
  images: EventImage[]
  onOpenGallery: () => void
}

export function EventImageThumbnails({ images, onOpenGallery }: EventImageThumbnailsProps) {
  const width = useWindowWidth()

  if (images.length === 0) {
    return null
  }

  const getImageCount = (): number => {
    if (width <= 500) return 2;

    const baseWidth = 160;
    return Math.floor(width / baseWidth);
  };

  const imageCount = getImageCount();
  const imagesToShow = images.slice(0, Math.min(images.length, imageCount));

  return (
    <button type="button" className="flex items-center gap-2 border-t border-border pt-3 w-full cursor-pointer" onClick={onOpenGallery}>
      <div className="flex gap-2 items-center">
        {imagesToShow.map((img) => (
          <ImageThumbnail key={img.path} img={img} />
        ))}
        <Plus className="text-chart-1" />
      </div>
    </button>
  )
}