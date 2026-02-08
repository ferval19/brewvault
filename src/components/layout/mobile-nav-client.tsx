"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  Coffee,
  Flame,
  Gauge,
  Settings,
} from "lucide-react"
import { AlertBadge } from "@/components/alerts/alert-badge"

interface MobileNavClientProps {
  alertCount: number
  user: {
    email: string
    full_name: string | null
    avatar_url: string | null
  } | null
}

const navigation = [
  { name: "Inicio", href: "/dashboard", icon: Home },
  { name: "Cafes", href: "/beans", icon: Coffee },
  { name: "Brews", href: "/brews", icon: Flame },
  { name: "Equipo", href: "/equipment", icon: Gauge },
  { name: "Ajustes", href: "/settings", icon: Settings, showBadge: true },
]

export function MobileNavClient({ alertCount }: MobileNavClientProps) {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 md:hidden safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center flex-1 h-full gap-1 text-xs font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-neutral-500 dark:text-neutral-400"
              )}
            >
              <div className="relative">
                <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                {item.showBadge && alertCount > 0 && <AlertBadge count={alertCount} />}
              </div>
              <span>{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
