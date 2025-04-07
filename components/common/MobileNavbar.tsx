"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Bell, User } from "lucide-react"

import { cn } from "@/lib/utils"

interface NavItem {
  icon: React.ElementType
  label: string
  href: string
}

const defaultItems: NavItem[] = [
  {
    icon: Home,
    label: "Home",
    href: "/",
  },
  {
    icon: Search,
    label: "Explore",
    href: "/explore",
  },
  {
    icon: Bell,
    label: "Notifications",
    href: "/user/notifications",
  },
  {
    icon: User,
    label: "Profile",
    href: "/user/profile",
  },
]

interface MobileNavProps {
  items?: NavItem[]
  className?: string
}

export function MobileNav({ items = defaultItems, className }: MobileNavProps) {
  const pathname = usePathname()

  return (
    <div className={cn("fixed bottom-0 left-0 z-50 w-full border-t bg-background md:hidden", className)}>
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-6">
        {items.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors",
                isActive && "text-primary",
              )}
            >
              <Icon className={cn("h-6 w-6", isActive && "text-primary")} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

