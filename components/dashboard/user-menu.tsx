"use client"

import { LogIn, LogOut, User } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface UserMenuProps {
  initialUser?: {
    name: string
    email: string
  } | null
}

export function UserMenu({ initialUser = null }: UserMenuProps) {
  const [user, setUser] = useState(initialUser)
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSignIn = () => {
    setUser({
      name: "John Dispatcher",
      email: "john@hvacpro.com",
    })
    setIsOpen(false)
  }

  const handleSignOut = () => {
    setUser(null)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <User className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-border bg-popover p-2 shadow-lg">
          {user ? (
            <>
              <div className="border-b border-border px-3 py-2">
                <p className="text-sm font-medium text-foreground">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={handleSignIn}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </button>
          )}
        </div>
      )}
    </div>
  )
}
