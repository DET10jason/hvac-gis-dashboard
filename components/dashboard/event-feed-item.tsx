"use client"

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  type LucideIcon,
} from "lucide-react"

export type EventType = "arrival" | "departure" | "completion" | "alert"

interface EventFeedItemProps {
  type: EventType
  technician: string
  message: string
  timestamp: string
  location?: string
}

const eventConfig: Record<EventType, { icon: LucideIcon; color: string }> = {
  arrival: {
    icon: MapPin,
    color: "text-[oklch(0.65_0.15_220)]",
  },
  departure: {
    icon: Clock,
    color: "text-primary",
  },
  completion: {
    icon: CheckCircle2,
    color: "text-primary",
  },
  alert: {
    icon: AlertTriangle,
    color: "text-destructive",
  },
}

export function EventFeedItem({
  type,
  technician,
  message,
  timestamp,
  location,
}: EventFeedItemProps) {
  const config = eventConfig[type]
  const Icon = config.icon

  return (
    <div className="border-b border-border px-4 py-3 last:border-b-0">
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary ${config.color}`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">{technician}</p>
          <p className="text-sm text-muted-foreground">{message}</p>
          {location && (
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {location}
            </p>
          )}
        </div>
        <span className="flex-shrink-0 text-xs text-muted-foreground">
          {timestamp}
        </span>
      </div>
    </div>
  )
}
