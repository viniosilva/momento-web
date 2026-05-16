import * as React from "react"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ACCEPTED_IMAGE_TYPES } from "@/features/event/schemas/event.schema"
import { useImageUploader } from "@/hooks/use-event-images"

export interface ImageUploadProps {
  eventId: string
  className?: string
}

export function ImageUpload({ eventId, className }: ImageUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const imageUploader = useImageUploader(eventId)

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center gap-2">
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

            try {
              await imageUploader.mutateAsync(Array.from(files));
            } finally {
              e.target.value = '';
            }
          }}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-1 h-3 w-3" />
          Choose images
        </Button>
      </div>
    </div>
  )
}
