"use client"

import { useState, useEffect } from "react"
import {
  Users,
  PhoneCall,
  CheckCircle,
  AlertTriangle,
  Thermometer,
} from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import {
  TechnicianCard,
  type Technician,
} from "@/components/dashboard/technician-card"
import {
  EventFeedItem,
  type EventType,
} from "@/components/dashboard/event-feed-item"
import { MapPlaceholder } from "@/components/dashboard/map-placeholder"
import { UserMenu } from "@/components/dashboard/user-menu"
import { NotificationsMenu } from "@/components/dashboard/notifications-menu"

// Workday configuration
const WORKDAY_START_HOUR = 6 // 6:00 AM
const WORKDAY_END_HOUR = 18 // 6:00 PM

function getWorkdayKey(): string {
  const now = new Date()
  const hour = now.getHours()
  
  // If before workday start, use previous day's key
  if (hour < WORKDAY_START_HOUR) {
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    return yesterday.toISOString().split("T")[0]
  }
  
  return now.toISOString().split("T")[0]
}

function isWithinWorkday(): boolean {
  const hour = new Date().getHours()
  return hour >= WORKDAY_START_HOUR && hour < WORKDAY_END_HOUR
}

function getTimeUntilWorkdayEnd(): string {
  const now = new Date()
  const endOfWorkday = new Date(now)
  endOfWorkday.setHours(WORKDAY_END_HOUR, 0, 0, 0)
  
  if (now >= endOfWorkday) {
    return "Workday ended"
  }
  
  const diff = endOfWorkday.getTime() - now.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  return `${hours}h ${minutes}m remaining`
}

interface WorkdayStats {
  pendingCalls: number
  completedJobs: number
  urgentAlerts: number
  workdayKey: string
}

function getInitialStats(): WorkdayStats {
  const workdayKey = getWorkdayKey()
  
  // In a real app, this would fetch from a database
  // For demo, we start with sample data for today
  return {
    pendingCalls: 8,
    completedJobs: 47,
    urgentAlerts: 3,
    workdayKey,
  }
}

const technicians: Technician[] = [
  {
    id: "1",
    name: "Mike Johnson",
    status: "on-site",
    location: "123 Main St, Suite 400",
    phone: "(555) 123-4567",
    currentJob: "Commercial AC Repair",
    coordinates: { lat: 40.7128, lng: -74.0060 },
  },
  {
    id: "2",
    name: "Sarah Chen",
    status: "en-route",
    location: "En route to 456 Oak Ave",
    phone: "(555) 234-5678",
    currentJob: "Furnace Installation",
    coordinates: { lat: 34.0522, lng: -118.2437 },
  },
  {
    id: "3",
    name: "David Williams",
    status: "idle",
    location: "Depot - North Station",
    phone: "(555) 345-6789",
    coordinates: { lat: 41.8781, lng: -87.6298 },
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    status: "on-site",
    location: "789 Pine Rd, Building B",
    phone: "(555) 456-7890",
    currentJob: "HVAC Maintenance",
    coordinates: { lat: 29.7604, lng: -95.3698 },
  },
  {
    id: "5",
    name: "James Thompson",
    status: "en-route",
    location: "En route to 321 Elm St",
    phone: "(555) 567-8901",
    currentJob: "Emergency Heat Pump Repair",
    coordinates: { lat: 33.4484, lng: -112.0740 },
  },
  {
    id: "6",
    name: "Lisa Park",
    status: "idle",
    location: "Depot - South Station",
    phone: "(555) 678-9012",
    coordinates: { lat: 47.6062, lng: -122.3321 },
  },
  {
    id: "7",
    name: "Robert Garcia",
    status: "on-site",
    location: "555 Maple Dr, Floor 2",
    phone: "(555) 789-0123",
    currentJob: "Ductwork Inspection",
    coordinates: { lat: 39.7392, lng: -104.9903 },
  },
  {
    id: "8",
    name: "Amanda Foster",
    status: "en-route",
    location: "En route to 888 Cedar Ln",
    phone: "(555) 890-1234",
    currentJob: "Thermostat Replacement",
    coordinates: { lat: 25.7617, lng: -80.1918 },
  },
  {
    id: "9",
    name: "Carlos Mendez",
    status: "on-site",
    location: "777 Industrial Blvd",
    phone: "(555) 901-2345",
    currentJob: "Chiller Maintenance",
    coordinates: { lat: 32.7767, lng: -96.7970 },
  },
  {
    id: "10",
    name: "Jennifer Lee",
    status: "en-route",
    location: "En route to 999 Commerce St",
    phone: "(555) 012-3456",
    currentJob: "Rooftop Unit Inspection",
    coordinates: { lat: 37.7749, lng: -122.4194 },
  },
  {
    id: "11",
    name: "Thomas Brown",
    status: "idle",
    location: "Depot - East Station",
    phone: "(555) 111-2222",
    coordinates: { lat: 42.3601, lng: -71.0589 },
  },
  {
    id: "12",
    name: "Michelle Davis",
    status: "on-site",
    location: "444 Tower Ave, Penthouse",
    phone: "(555) 333-4444",
    currentJob: "VRF System Install",
    coordinates: { lat: 36.1627, lng: -86.7816 },
  },
]

interface EventItem {
  id: string
  type: EventType
  technician: string
  message: string
  timestamp: string
  location?: string
}

const events: EventItem[] = [
  {
    id: "1",
    type: "arrival",
    technician: "Mike Johnson",
    message: "Arrived at job site for AC repair",
    timestamp: "2 min ago",
    location: "123 Main St, Suite 400",
  },
  {
    id: "2",
    type: "alert",
    technician: "Sarah Chen",
    message: "Reporting traffic delay - ETA +15 min",
    timestamp: "5 min ago",
  },
  {
    id: "3",
    type: "completion",
    technician: "Emily Rodriguez",
    message: "Completed furnace maintenance inspection",
    timestamp: "12 min ago",
    location: "234 Industrial Pkwy",
  },
  {
    id: "4",
    type: "departure",
    technician: "James Thompson",
    message: "Departing depot for emergency call",
    timestamp: "18 min ago",
  },
  {
    id: "5",
    type: "arrival",
    technician: "Robert Garcia",
    message: "Arrived for scheduled ductwork inspection",
    timestamp: "25 min ago",
    location: "555 Maple Dr, Floor 2",
  },
  {
    id: "6",
    type: "completion",
    technician: "David Williams",
    message: "Completed heat pump installation",
    timestamp: "32 min ago",
    location: "677 Birch Way",
  },
  {
    id: "7",
    type: "alert",
    technician: "Amanda Foster",
    message: "Parts required - requesting delivery",
    timestamp: "45 min ago",
  },
  {
    id: "8",
    type: "departure",
    technician: "Lisa Park",
    message: "Starting route for afternoon calls",
    timestamp: "1 hr ago",
  },
  {
    id: "9",
    type: "completion",
    technician: "Mike Johnson",
    message: "Completed commercial refrigeration service",
    timestamp: "1.5 hr ago",
    location: "891 Commerce Blvd",
  },
  {
    id: "10",
    type: "arrival",
    technician: "Sarah Chen",
    message: "Arrived for scheduled maintenance",
    timestamp: "2 hr ago",
    location: "456 Oak Ave",
  },
]

export default function DashboardPage() {
  const [stats, setStats] = useState<WorkdayStats>(getInitialStats)
  const [workdayStatus, setWorkdayStatus] = useState({
    isActive: isWithinWorkday(),
    timeRemaining: getTimeUntilWorkdayEnd(),
  })
  const [currentDate, setCurrentDate] = useState("")
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string | null>(null)

  // Count active crews (non-idle technicians)
  const activeCrewsCount = technicians.filter(t => t.status !== "idle").length

  // Check for workday reset and update time remaining
  useEffect(() => {
    // Set initial date on client
    setCurrentDate(new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }))

    const interval = setInterval(() => {
      const currentWorkdayKey = getWorkdayKey()
      
      // Check if we've crossed into a new workday
      if (currentWorkdayKey !== stats.workdayKey) {
        // Reset stats for new workday
        setStats({
          pendingCalls: 0,
          completedJobs: 0,
          urgentAlerts: 0,
          workdayKey: currentWorkdayKey,
        })
      }
      
      // Update workday status
      setWorkdayStatus({
        isActive: isWithinWorkday(),
        timeRemaining: getTimeUntilWorkdayEnd(),
      })

      // Update date
      setCurrentDate(new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }))
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [stats.workdayKey])

  const statCards = [
    {
      title: "Active Crews",
      value: activeCrewsCount,
      icon: Users,
      iconColorClass: "text-primary",
      trend: { value: "today", positive: true },
    },
    {
      title: "Pending Calls",
      value: stats.pendingCalls,
      icon: PhoneCall,
      iconColorClass: "text-[oklch(0.75_0.15_85)]",
      trend: { value: "queued", positive: stats.pendingCalls < 10 },
    },
    {
      title: "Completed Jobs",
      value: stats.completedJobs,
      icon: CheckCircle,
      iconColorClass: "text-primary",
      trend: { value: "today", positive: true },
    },
    {
      title: "Urgent Alerts",
      value: stats.urgentAlerts,
      icon: AlertTriangle,
      iconColorClass: "text-destructive",
      trend: { value: "active", positive: stats.urgentAlerts === 0 },
    },
  ]

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-border bg-card px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Thermometer className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              HVAC Dispatch
            </h1>
            <p className="text-xs text-muted-foreground">
              Field Operations Center
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NotificationsMenu />
          <UserMenu />
        </div>
      </header>

      {/* Stats Bar */}
      <div className="flex-shrink-0 border-b border-border bg-background px-6 py-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-medium text-foreground">
              {currentDate || "Loading..."}
            </h2>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              workdayStatus.isActive 
                ? "bg-primary/10 text-primary" 
                : "bg-muted text-muted-foreground"
            }`}>
              {workdayStatus.isActive ? "Workday Active" : "After Hours"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {workdayStatus.timeRemaining} | Stats reset at {WORKDAY_START_HOUR}:00 AM
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              iconColorClass={stat.iconColorClass}
              trend={stat.trend}
            />
          ))}
        </div>
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Technicians */}
        <aside className="flex w-80 flex-shrink-0 flex-col border-r border-border bg-sidebar">
          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <h2 className="text-sm font-semibold text-foreground">
              Field Technicians
            </h2>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {activeCrewsCount} active
            </span>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {technicians.map((tech) => (
              <TechnicianCard
                key={tech.id}
                technician={tech}
                isSelected={selectedTechnicianId === tech.id}
                onClick={() => setSelectedTechnicianId(
                  selectedTechnicianId === tech.id ? null : tech.id
                )}
              />
            ))}
          </div>
        </aside>

        {/* Center - Map */}
        <main className="flex-1 overflow-hidden p-4">
          <MapPlaceholder 
            technicians={technicians}
            selectedTechnicianId={selectedTechnicianId}
            onSelectTechnician={setSelectedTechnicianId}
          />
        </main>

        {/* Right Sidebar - Event Feed */}
        <aside className="flex w-80 flex-shrink-0 flex-col border-l border-border bg-sidebar">
          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <h2 className="text-sm font-semibold text-foreground">
              Live Activity
            </h2>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {events.map((event) => (
              <EventFeedItem
                key={event.id}
                type={event.type}
                technician={event.technician}
                message={event.message}
                timestamp={event.timestamp}
                location={event.location}
              />
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
