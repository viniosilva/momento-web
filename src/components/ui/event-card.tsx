import * as React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface EventCardProps extends React.ComponentProps<typeof Card> {
  title: string
  content?: string
}

function EventCard({ title, content, className, ...props }: EventCardProps) {
  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {content ?? <p>{content}</p>}
      </CardContent>
    </Card>
  )
}

export { EventCard }