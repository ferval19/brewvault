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

  const fabHref = pathname.startsWith("/beans")
    ? "/beans/new"
    : pathname.startsWith("/equipment")
    ? "/equipment/new"
    : "/brews/new"

  return (
    <>
      {/* Floating Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden pointer-events-none safe-area-pb">
        <div className="flex items-center justify-center gap-3 px-4 pb-3">
          {/* Main pill tab bar */}
          <nav
            data-tour="mobile-nav"
            className={cn(
              "pointer-events-auto flex items-center gap-1 px-2 py-2 rounded-[28px]",
              "bg-white/55 dark:bg-white/[0.08]",
              "shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12),inset_0_1px_0_0_rgba(255,255,255,0.4)]",
              "dark:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.06)]",
              "border border-white/30 dark:border-white/[0.08]",
              "backdrop-blur-2xl backdrop-saturate-[1.8]",
              "[-webkit-backdrop-filter:blur(40px)_saturate(1.8)]",
            )}
          >
            <NavItem
              href="/dashboard"
              icon={Home}
              label="Inicio"
              active={pathname === "/dashboard"}
            />
            <NavItem
              href="/brews"
              icon={Coffee}
              label="Brews"
              active={pathname === "/brews" || pathname.startsWith("/brews/")}
            />
            <NavItem
              href="/beans"
              icon={Package}
              label="Cafes"
              active={pathname === "/beans" || pathname.startsWith("/beans/")}
            />
            <MoreButton
              active={isMoreActive}
              alertCount={alertCount}
              onClick={() => setShowMore(true)}
            />
          </nav>

          {/* Floating FAB */}
          <Link
            href={fabHref}
            data-tour="fab-button"
            className={cn(
              "pointer-events-auto flex items-center justify-center w-[52px] h-[52px] rounded-full",
              "bg-gradient-to-br from-coffee-600 to-coffee-500",
              "shadow-[0_8px_24px_-4px_rgba(139,90,43,0.45),inset_0_1px_0_0_rgba(255,255,255,0.25)]",
              "hover:shadow-[0_12px_32px_-4px_rgba(139,90,43,0.55),inset_0_1px_0_0_rgba(255,255,255,0.25)]",
              "active:scale-95 hover:scale-105 transition-all duration-200",
              "text-white",
            )}
          >
            <Plus className="h-6 w-6" />
          </Link>
        </div>
      </div>

      {/* Bottom Sheet para "Mas" */}
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

const navItemActive = [
  "bg-white/55 dark:bg-white/[0.14]",
  "border border-white/30 dark:border-white/[0.08]",
  "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45),0_1px_4px_-1px_rgba(0,0,0,0.06)]",
  "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_1px_4px_-1px_rgba(0,0,0,0.2)]",
  "backdrop-blur-sm",
]

const navItemInactive = [
  "border border-transparent",
  "active:scale-95",
]

function NavItem({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string
  icon: React.ElementType
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex flex-col items-center justify-center gap-0.5 rounded-2xl px-4 py-1.5 transition-all duration-200",
        active ? navItemActive : navItemInactive
      )}
    >
      <Icon
        className={cn(
          "h-[22px] w-[22px] transition-colors duration-200",
          active ? "text-coffee-700 dark:text-coffee-300" : "text-neutral-500 dark:text-neutral-400"
        )}
      />
      <span
        className={cn(
          "text-[10px] font-semibold leading-tight transition-colors duration-200",
          active ? "text-coffee-700 dark:text-coffee-300" : "text-neutral-500 dark:text-neutral-400"
        )}
      >
        {label}
      </span>
    </Link>
  )
}

function MoreButton({
  active,
  alertCount,
  onClick,
}: {
  active: boolean
  alertCount: number
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center gap-0.5 rounded-2xl px-4 py-1.5 transition-all duration-200",
        active ? navItemActive : navItemInactive
      )}
    >
      <div className="relative">
        <MoreHorizontal
          className={cn(
            "h-[22px] w-[22px] transition-colors duration-200",
            active ? "text-coffee-700 dark:text-coffee-300" : "text-neutral-500 dark:text-neutral-400"
          )}
        />
        {alertCount > 0 && <AlertBadge count={alertCount} />}
      </div>
      <span
        className={cn(
          "text-[10px] font-semibold leading-tight transition-colors duration-200",
          active ? "text-coffee-700 dark:text-coffee-300" : "text-neutral-500 dark:text-neutral-400"
        )}
      >
        Mas
      </span>
    </button>
  )
}
