"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Coffee,
  Flame,
  Wrench,
  BarChart3,
  Menu,
} from "lucide-react"
import { AlertBadge } from "@/components/alerts/alert-badge"

interface MobileNavClientProps {
  alertCount: number
}

const navigation = [
  { name: "Cafes", href: "/beans", icon: Coffee },
  { name: "Brews", href: "/brews", icon: Flame },
  { name: "Equipo", href: "/equipment", icon: Wrench },
  { name: "Stats", href: "/analytics", icon: BarChart3, showBadge: true },
  { name: "Mas", href: "/settings", icon: Menu },
]

export function MobileNavClient({ alertCount }: MobileNavClientProps) {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 md:hidden safe-area-pb">
      <div className="flex items-center justify-around h-18 px-2 pb-1">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center flex-1 h-full gap-1.5 text-xs font-medium transition-colors py-2",
                isActive
                  ? "text-primary"
                  : "text-neutral-500 dark:text-neutral-400"
              )}
            >
              <div className="relative">
                <item.icon className={cn("h-6 w-6", isActive && "text-primary")} />
                {item.showBadge && <AlertBadge count={alertCount} />}
              </div>
              <span>{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
