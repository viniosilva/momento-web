import * as React from "react"
import { Loader2 } from "lucide-react"
import type { Event } from "@/hooks/use-events"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EventCardMenu } from "@/components/ui/event-card-menu"
import { useCurrentUserId } from "@/hooks/use-current-user"


interface EventCardProps extends React.ComponentProps<typeof Card> {
  event: Event
  onArchive: () => void
  onRestore: () => void
  onDelete?: () => void
  isLoading?: boolean
  className?: string
}

function EventCard({
  event,
  onArchive,
  onRestore,
  onDelete,
  isLoading,
  className,
  ...props
}: EventCardProps) {
  const currentUserId = useCurrentUserId()
  const isOwner = event.ownerUserId === currentUserId
  const isArchived = !!event.archivedAt

  return (
    <Card
      className={`group/event-card relative ${className ?? ''} ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      {...props}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{event.title}</CardTitle>
          <EventCardMenu
            isOwner={isOwner}
            isArchived={isArchived}
            onArchive={onArchive}
            onRestore={onRestore}
            onDelete={onDelete}
            isLoading={isLoading}
          />
        </div>
      </CardHeader>
      <CardContent>
        <p>{event.content}</p>
      </CardContent>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <Loader2 className="h-6 w-6 animate-spin text-chart-1" />
        </div>
      )}
    </Card>
  )
}

export { EventCard }