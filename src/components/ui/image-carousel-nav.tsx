import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ImageCarouselNavProps {
  total: number
  current: number
  onPrev: () => void
  onNext: () => void
  onDotClick: (index: number) => void
}

function NavButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <Button variant="ghost" size="icon" onClick={onClick}
      className="hover:text-chart-3 cursor-pointer focus-visible:ring-0 focus-visible:border-transparent focus-visible:outline-none"
    >
      {children}
    </Button>
  )
}

export function ImageCarouselNav({ total, current, onPrev, onNext, onDotClick }: ImageCarouselNavProps) {
  return (
    <div className="flex items-center gap-2">
      <NavButton onClick={onPrev}>
        <ChevronLeft className="h-5 w-5" />
      </NavButton>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            onClick={() => onDotClick(i)}
            className={cn(
              "h-2 rounded-full transition-all cursor-pointer",
              i === current ? "w-6 bg-chart-1" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
          />
        ))}
      </div>
      <NavButton onClick={onNext}>
        <ChevronRight className="h-5 w-5" />
      </NavButton>
    </div>
  )
}
