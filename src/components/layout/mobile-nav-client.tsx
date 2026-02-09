"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  Package,
  Coffee,
  Gauge,
  Settings,
  Plus,
  MoreHorizontal,
  ClipboardList,
} from "lucide-react"
import { AlertBadge } from "@/components/alerts/alert-badge"
import { BottomSheet, BottomSheetItem } from "./bottom-sheet"

interface MobileNavClientProps {
  alertCount: number
  user: {
    email: string
    full_name: string | null
    avatar_url: string | null
  } | null
}

const mainNavigation = [
  { name: "Inicio", href: "/dashboard", icon: Home },
  { name: "Brews", href: "/brews", icon: Coffee },
  // FAB goes here (index 2)
  { name: "Cafes", href: "/beans", icon: Package },
  // More button (index 4)
]

const moreNavigation = [
  { name: "Equipo", href: "/equipment", icon: Gauge, description: "Cafeteras y molinos" },
  { name: "Catas", href: "/cupping", icon: ClipboardList, description: "Notas de cata SCA" },
  { name: "Ajustes", href: "/settings", icon: Settings, description: "Perfil y preferencias", showBadge: true },
]

export function MobileNavClient({ alertCount }: MobileNavClientProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [showMore, setShowMore] = useState(false)

  const isMoreActive = moreNavigation.some(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  )

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 md:hidden safe-area-pb overflow-visible">
        <div className="flex items-center justify-around h-16 px-2 relative">
          {/* Home */}
          <NavItem
            href="/dashboard"
            icon={Home}
            label="Inicio"
            active={pathname === "/dashboard"}
          />

          {/* Brews */}
          <NavItem
            href="/brews"
            icon={Coffee}
            label="Brews"
            active={pathname === "/brews" || pathname.startsWith("/brews/")}
          />

          {/* FAB - Nueva Brew */}
          <div className="relative flex items-center justify-center flex-1 h-full">
            <Link
              href="/brews/new"
              className="absolute -top-7 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105 transition-all z-10"
            >
              <Plus className="h-7 w-7" />
            </Link>
          </div>

          {/* Cafés */}
          <NavItem
            href="/beans"
            icon={Package}
            label="Cafes"
            active={pathname === "/beans" || pathname.startsWith("/beans/")}
          />

          {/* More */}
          <button
            onClick={() => setShowMore(true)}
            className={cn(
              "relative flex flex-col items-center justify-center flex-1 h-full gap-1 text-xs font-medium transition-colors",
              isMoreActive
                ? "text-primary"
                : "text-neutral-500 dark:text-neutral-400"
            )}
          >
            <div className="relative">
              <MoreHorizontal className={cn("h-5 w-5", isMoreActive && "text-primary")} />
              {alertCount > 0 && <AlertBadge count={alertCount} />}
            </div>
            <span>Mas</span>
          </button>
        </div>
      </nav>

      {/* Bottom Sheet para "Más" */}
      <BottomSheet open={showMore} onOpenChange={setShowMore} title="Mas opciones">
        <div className="space-y-2">
          {moreNavigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <BottomSheetItem
                key={item.href}
                icon={item.icon}
                label={item.name}
                description={item.description}
                href={item.href}
                active={isActive}
                onClick={() => {
                  setShowMore(false)
                  router.push(item.href)
                }}
                badge={
                  item.showBadge && alertCount > 0 ? (
                    <span className="px-2 py-1 text-xs font-medium bg-destructive text-destructive-foreground rounded-full">
                      {alertCount}
                    </span>
                  ) : undefined
                }
              />
            )
          })}
        </div>
      </BottomSheet>
    </>
  )
}

function NavItem({
  href,
  icon: Icon,
  label,
  active,
  badge,
}: {
  href: string
  icon: React.ElementType
  label: string
  active: boolean
  badge?: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex flex-col items-center justify-center flex-1 h-full gap-1 text-xs font-medium transition-colors",
        active
          ? "text-primary"
          : "text-neutral-500 dark:text-neutral-400"
      )}
    >
      <div className="relative">
        <Icon className={cn("h-5 w-5", active && "text-primary")} />
        {badge}
      </div>
      <span>{label}</span>
    </Link>
  )
}
