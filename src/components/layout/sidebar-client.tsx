"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Home,
  Coffee,
  Flame,
  Wrench,
  Settings,
  LogOut,
  ClipboardList,
  Bell,
} from "lucide-react"
import { signOut } from "@/app/(auth)/actions"
import { ThemeToggle } from "@/components/theme-toggle"
import { AlertBadge } from "@/components/alerts/alert-badge"

interface SidebarClientProps {
  alertCount: number
}

const navigation = [
  { name: "Inicio", href: "/dashboard", icon: Home },
  { name: "Cafes", href: "/beans", icon: Coffee },
  { name: "Preparaciones", href: "/brews", icon: Flame },
  { name: "Equipamiento", href: "/equipment", icon: Wrench },
  { name: "Notas de Cata", href: "/cupping", icon: ClipboardList },
  { name: "Alertas", href: "/alerts", icon: Bell, showBadge: true },
  { name: "Configuracion", href: "/settings", icon: Settings },
]

export function SidebarClient({ alertCount }: SidebarClientProps) {
  const pathname = usePathname()

  return (
    <aside className="h-full w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col">
      <div className="p-6 pb-4">
        <div className="flex items-center gap-2">
          <Coffee className="h-6 w-6 text-amber-600" />
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            BrewVault
          </h1>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Tu diario de cafe
        </p>
      </div>
      <nav className="px-4 flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              )}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.showBadge && <AlertBadge count={alertCount} />}
              </div>
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 space-y-1">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">Tema</span>
          <ThemeToggle />
        </div>
        <form action={signOut}>
          <Button
            variant="ghost"
            className="w-full justify-start text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Cerrar sesion
          </Button>
        </form>
      </div>
    </aside>
  )
}
