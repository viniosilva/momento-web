import * as React from "react"
import { Loader2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface EventCardProps extends React.ComponentProps<typeof Card> {
  title: string
  content?: string
  isLoading?: boolean
  menu?: React.ReactNode
}

function EventCard({
  title,
  content,
  className,
  isLoading,
  menu,
  ...props
}: EventCardProps) {
  return (
    <Card
      className={`group/event-card relative ${className ?? ''} ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      {...props}
    >
      {menu}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {content ?? <p>{content}</p>}
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