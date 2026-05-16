import { Camera, Plus } from "lucide-react"
import type React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EventNavMenuProps {
  isOwner: boolean
  isLoading: boolean
  uploading: boolean
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>
}

export function EventNavMenu({
  isOwner,
  isLoading,
  uploading,
  fileInputRef,
}: EventNavMenuProps) {
  if (!isOwner) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
      }}>
        <div className={cn(buttonVariants({ variant: "outline" }))}                      >
          <Plus /> Add
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
      }}>
         <DropdownMenuItem
           className="p-2 flex gap-2 cursor-pointer"
           disabled={isLoading || uploading}
           onClick={(e) => {
             e.preventDefault();
             fileInputRef.current?.click();
           }}
         >
          <Camera /> Image
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}