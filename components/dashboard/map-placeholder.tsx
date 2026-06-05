"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Phone, MapPin, Wrench, X } from "lucide-react"
import { type Technician, type TechnicianStatus } from "./technician-card"

interface MapPlaceholderProps {
  technicians: Technician[]
  selectedTechnicianId: string | null
  onSelectTechnician: (id: string | null) => void
}

const statusColors: Record<TechnicianStatus, { color: string; label: string }> = {
  idle: { 
    color: "#8a8a8a",
    label: "Idle"
  },
  "en-route": { 
    color: "#2dd4bf",
    label: "En Route"
  },
  "on-site": { 
    color: "#3b82f6",
    label: "On Site"
  },
}

export function MapPlaceholder({ 
  technicians, 
  selectedTechnicianId,
  onSelectTechnician 
}: MapPlaceholderProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map())
  const popupRef = useRef<mapboxgl.Popup | null>(null)
  const [popupTechnician, setPopupTechnician] = useState<Technician | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-98.5795, 39.8283], // Center of US
      zoom: 3.5,
    })

    map.current.addControl(new mapboxgl.NavigationControl(), "bottom-right")

    map.current.on("load", () => {
      setMapLoaded(true)
    })

    map.current.on("click", () => {
      if (popupRef.current) {
        popupRef.current.remove()
        popupRef.current = null
      }
      setPopupTechnician(null)
      onSelectTechnician(null)
    })

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [onSelectTechnician])

  // Create marker element
  const createMarkerElement = useCallback((tech: Technician, isSelected: boolean) => {
    const el = document.createElement("div")
    el.className = "technician-marker"
    el.style.cssText = `
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: ${statusColors[tech.status].color}33;
      border: 3px solid ${statusColors[tech.status].color};
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      ${isSelected ? `box-shadow: 0 0 0 3px white, 0 0 0 5px ${statusColors[tech.status].color};` : ""}
    `

    const inner = document.createElement("div")
    inner.style.cssText = `
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: ${statusColors[tech.status].color};
    `
    el.appendChild(inner)

    // Hover effect
    el.addEventListener("mouseenter", () => {
      el.style.transform = "scale(1.1)"
    })
    el.addEventListener("mouseleave", () => {
      el.style.transform = "scale(1)"
    })

    return el
  }, [])

  // Add/update markers when technicians change
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    // Remove old markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current.clear()

    // Add new markers
    technicians.forEach((tech) => {
      const el = createMarkerElement(tech, selectedTechnicianId === tech.id)

      el.addEventListener("click", (e) => {
        e.stopPropagation()
        
        // Remove existing popup
        if (popupRef.current) {
          popupRef.current.remove()
          popupRef.current = null
        }

        // Create popup content
        const popupContent = document.createElement("div")
        popupContent.innerHTML = `
          <div style="padding: 8px; min-width: 200px;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
              <div style="width: 48px; height: 48px; border-radius: 50%; background: #2a2a2a; display: flex; align-items: center; justify-content: center; font-weight: 600; color: white;">
                ${tech.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p style="font-weight: 600; color: white; margin: 0;">${tech.name}</p>
                <span style="display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 500; background: ${statusColors[tech.status].color}; color: white;">
                  ${statusColors[tech.status].label}
                </span>
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 14px; color: #a0a0a0;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>${tech.phone}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>${tech.location}</span>
              </div>
              ${tech.currentJob ? `
              <div style="display: flex; align-items: center; gap: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                <span>${tech.currentJob}</span>
              </div>
              ` : ""}
            </div>
          </div>
        `

        const popup = new mapboxgl.Popup({
          closeButton: true,
          closeOnClick: false,
          offset: 25,
          className: "technician-popup",
        })
          .setLngLat([tech.coordinates.lng, tech.coordinates.lat])
          .setDOMContent(popupContent)
          .addTo(map.current!)

        popupRef.current = popup
        setPopupTechnician(tech)
        onSelectTechnician(tech.id)

        popup.on("close", () => {
          popupRef.current = null
          setPopupTechnician(null)
          onSelectTechnician(null)
        })
      })

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([tech.coordinates.lng, tech.coordinates.lat])
        .addTo(map.current!)

      markersRef.current.set(tech.id, marker)
    })
  }, [technicians, mapLoaded, createMarkerElement, selectedTechnicianId, onSelectTechnician])

  // Handle zooming to selected technician (without showing popup)
  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedTechnicianId) return

    const tech = technicians.find(t => t.id === selectedTechnicianId)
    if (tech) {
      // Only fly to location, don't show popup
      map.current.flyTo({
        center: [tech.coordinates.lng, tech.coordinates.lat],
        zoom: 12,
        duration: 1500,
      })

      // Update marker styling for selected state
      markersRef.current.forEach((marker, id) => {
        const el = marker.getElement()
        const t = technicians.find(tech => tech.id === id)
        if (t) {
          if (id === selectedTechnicianId) {
            el.style.boxShadow = `0 0 0 3px white, 0 0 0 5px ${statusColors[t.status].color}`
          } else {
            el.style.boxShadow = "none"
          }
        }
      })
    }
  }, [selectedTechnicianId, technicians, mapLoaded])

  // Count technicians by status
  const statusCounts = technicians.reduce((acc, tech) => {
    acc[tech.status] = (acc[tech.status] || 0) + 1
    return acc
  }, {} as Record<TechnicianStatus, number>)

  return (
    /* STEP 1 FIX: Replaced 'h-full' with concrete minimum and standard desktop heights */
    <div className="relative flex min-h-[500px] h-[600px] md:h-full w-full flex-col overflow-hidden rounded-lg border border-border bg-card">
      
      {/* Map container */}
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
  
      {/* Legend */}
      <div className="absolute left-4 top-4 z-20 rounded-lg border border-border bg-card/95 p-3 backdrop-blur-sm">
        <p className="mb-2 text-xs font-semibold text-foreground">Crew Status</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: statusColors["on-site"].color }} />
            <span className="text-muted-foreground">On Site</span>
            <span className="ml-auto font-medium text-foreground">{statusCounts["on-site"] || 0}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: statusColors["en-route"].color }} />
            <span className="text-muted-foreground">En Route</span>
            <span className="ml-auto font-medium text-foreground">{statusCounts["en-route"] || 0}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: statusColors["idle"].color }} />
            <span className="text-muted-foreground">Idle</span>
            <span className="ml-auto font-medium text-foreground">{statusCounts["idle"] || 0}</span>
          </div>
        </div>
      </div>
  
      {/* Custom popup styles */}
      <style jsx global>{`
        .mapboxgl-popup-content { background: #1a1a1a !important; border: 1px solid #333 !important; border-radius: 8px !important; padding: 0 !important; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5) !important; }
        .mapboxgl-popup-close-button { color: #888 !important; font-size: 18px !important; padding: 4px 8px !important; }
        .mapboxgl-popup-close-button:hover { color: white !important; background: transparent !important; }
        .mapboxgl-popup-tip { border-top-color: #1a1a1a !important; }
        .mapboxgl-ctrl-group { background: #1a1a1a !important; border: 1px solid #333 !important; }
        .mapboxgl-ctrl-group button { background: #1a1a1a !important; }
        .mapboxgl-ctrl-group button:hover { background: #2a2a2a !important; }
        .mapboxgl-ctrl-group button + button { border-top: 1px solid #333 !important; }
        .mapboxgl-ctrl-icon { filter: invert(1) !important; }
      `}</style>
    </div>
  )
}
