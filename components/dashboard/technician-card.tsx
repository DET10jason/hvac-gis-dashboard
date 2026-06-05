"use client"

import { MapPin, Phone, Wrench } from "lucide-react"

export type TechnicianStatus = "idle" | "en-route" | "on-site"

export interface Technician {
  id: string
  name: string
  status: TechnicianStatus
  location: string
  phone: string
  currentJob?: string
  coordinates: { lat: number; lng: number }
}

interface TechnicianCardProps {
  technician: Technician
  isSelected?: boolean
  onClick?: () => void
}

const statusConfig: Record<
  TechnicianStatus,
  { label: string; className: string }
> = {
  idle: {
    label: "Idle",
    className: "bg-[oklch(0.60_0_0)] text-white",
  },
  "en-route": {
    label: "En Route",
    className: "bg-primary text-primary-foreground",
  },
  "on-site": {
    label: "On Site",
    className: "bg-[oklch(0.65_0.15_220)] text-white",
  },
}

export function TechnicianCard({
  technician,
  isSelected,
  onClick,
}: TechnicianCardProps) {
  const { name, status, location, phone, currentJob } = technician
  const config = statusConfig[status]

  return (
    <div 
      className={`cursor-pointer rounded-lg border p-4 transition-colors hover:bg-secondary/50 ${
        isSelected 
          ? "border-primary bg-primary/5" 
          : "border-border bg-card"
      }`}
      onClick={onClick}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-medium text-foreground">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <p className="font-medium text-foreground">{name}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>{phone}</span>
            </div>
          </div>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
        >
          {config.label}
        </span>
      </div>
      <div className="space-y-1.5 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span className="truncate">{location}</span>
        </div>
        {currentJob && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wrench className="h-3.5 w-3.5" />
            <span className="truncate">{currentJob}</span>
          </div>
        )}
      </div>
    </div>
  )
}
