import { Archive, ArchiveRestore, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import type React from "react"

interface EventCardMenuProps {
  isOwner: boolean
  isArchived: boolean
  onArchive: () => void
  onRestore: () => void
  isLoading?: boolean
}

export function EventCardMenu({
  isOwner,
  isArchived,
  onArchive,
  onRestore,
  isLoading,
}: EventCardMenuProps) {
  if (!isOwner) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
      }}>
        <Button
          variant="ghost"
          size="icon-sm"
          className="hover:bg-transparent hover:text-chart-3"
          disabled={isLoading}
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
      }}>
        {isArchived ? (
          <DropdownMenuItem onClick={onRestore} disabled={isLoading}>
            <ArchiveRestore className="mr-2 h-4 w-4" />
            Restore
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={onArchive} disabled={isLoading}>
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}