"use client"

import { type LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconColorClass?: string
  trend?: {
    value: string
    positive: boolean
  }
}

export function StatCard({ title, value, icon: Icon, iconColorClass, trend }: StatCardProps) {
  // Determine background class based on color class
  const getBackgroundClass = () => {
    if (!iconColorClass) return "bg-primary/10"
    if (iconColorClass.includes("primary")) return "bg-primary/10"
    if (iconColorClass.includes("destructive")) return "bg-destructive/10"
    if (iconColorClass.includes("yellow") || iconColorClass.includes("85")) return "bg-[oklch(0.75_0.15_85/0.1)]"
    return "bg-primary/10"
  }

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${getBackgroundClass()}`}>
        <Icon className={`h-6 w-6 ${iconColorClass || "text-primary"}`} />
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-semibold text-foreground">{value}</p>
      </div>
      {trend && (
        <span
          className={`text-sm font-medium ${
            trend.positive ? "text-primary" : "text-destructive"
          }`}
        >
          {trend.value}
        </span>
      )}
    </div>
  )
}
