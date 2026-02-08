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

const navigation = [
  { name: "Cafes", href: "/beans", icon: Coffee },
  { name: "Brews", href: "/brews", icon: Flame },
  { name: "Equipo", href: "/equipment", icon: Wrench },
  { name: "Stats", href: "/analytics", icon: BarChart3 },
  { name: "Mas", href: "/settings", icon: Menu },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 text-xs font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-neutral-500 dark:text-neutral-400"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
