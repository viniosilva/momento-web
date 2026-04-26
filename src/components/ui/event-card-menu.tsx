import { Archive, ArchiveRestore, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

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
  // Menu invisível para não-owner
  if (!isOwner) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute top-2 right-2 opacity-0 group-hover/event-card:opacity-100 transition-opacity"
          disabled={isLoading}
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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