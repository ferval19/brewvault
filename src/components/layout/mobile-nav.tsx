"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  Coffee,
  Flame,
  Wrench,
} from "lucide-react"
import { MobileMenuDrawer } from "./mobile-menu-drawer"

const navigation = [
  { name: "Inicio", href: "/dashboard", icon: Home },
  { name: "Cafes", href: "/beans", icon: Coffee },
  { name: "Brews", href: "/brews", icon: Flame },
  { name: "Equipo", href: "/equipment", icon: Wrench },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href))
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
        <MobileMenuDrawer />
      </div>
    </nav>
  )
}
