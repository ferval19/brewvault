"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Home,
  Package,
  Coffee,
  Gauge,
  Settings,
  LogOut,
  User,
  ClipboardList,
  Plus,
  BarChart2,
} from "lucide-react"
import { signOut } from "@/app/(auth)/actions"
import { ThemeToggle } from "@/components/theme-toggle"
import { AlertBadge } from "@/components/alerts/alert-badge"

interface SidebarClientProps {
  alertCount: number
  user: {
    email: string
    full_name: string | null
    avatar_url: string | null
  } | null
}

const mainNavigation = [
  { name: "Inicio", href: "/dashboard", icon: Home },
  { name: "Preparaciones", href: "/brews", icon: Coffee },
  { name: "Cafés", href: "/beans", icon: Package },
]

const collectionNavigation = [
  { name: "Equipo", href: "/equipment", icon: Gauge },
  { name: "Catas", href: "/cupping", icon: ClipboardList },
  { name: "Análisis", href: "/analytics", icon: BarChart2 },
]

export function SidebarClient({ alertCount, user }: SidebarClientProps) {
  const pathname = usePathname()

  return (
    <aside className={cn(
      "h-full w-64 flex flex-col rounded-3xl overflow-hidden",
      "bg-white/55 dark:bg-white/[0.06]",
      "border border-white/35 dark:border-white/[0.08]",
      "shadow-[0_8px_40px_-8px_rgba(0,0,0,0.1),inset_0_1px_0_0_rgba(255,255,255,0.5)]",
      "dark:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.06)]",
      "backdrop-blur-2xl backdrop-saturate-[1.8]",
      "[-webkit-backdrop-filter:blur(40px)_saturate(1.8)]",
    )}>
      {/* Logo */}
      <div className="p-6 pb-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Coffee className="h-6 w-6 text-coffee-600" />
          <h1 className="text-lg font-bold text-neutral-900 dark:text-white">
            BrewVault
          </h1>
        </Link>
      </div>

      {/* Quick Action */}
      <div className="px-4 mb-4">
        <Link href="/brews/new">
          <Button className="w-full rounded-2xl bg-gradient-to-br from-coffee-600 to-coffee-500 hover:from-coffee-700 hover:to-coffee-600 text-white shadow-[0_8px_24px_-4px_rgba(139,90,43,0.4),inset_0_1px_0_0_rgba(255,255,255,0.25)] hover:shadow-[0_12px_32px_-4px_rgba(139,90,43,0.5),inset_0_1px_0_0_rgba(255,255,255,0.25)] transition-all duration-200">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Brew
          </Button>
        </Link>
      </div>

      {/* Navigation */}
      <nav data-tour="sidebar-nav" className="px-4 flex-1 space-y-6">
        {/* Principal */}
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
            Principal
          </p>
          {mainNavigation.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <NavLink key={item.href} item={item} isActive={isActive} />
            )
          })}
        </div>

        {/* Colección */}
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
            Coleccion
          </p>
          {collectionNavigation.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <NavLink key={item.href} item={item} isActive={isActive} />
            )
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/20 dark:border-white/[0.06] space-y-3">
        {/* Settings */}
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200",
            pathname.startsWith("/settings")
              ? [
                  "bg-white/55 dark:bg-white/[0.12]",
                  "text-neutral-900 dark:text-white",
                  "border border-white/35 dark:border-white/[0.08]",
                  "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_2px_8px_-2px_rgba(0,0,0,0.06)]",
                  "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_2px_8px_-2px_rgba(0,0,0,0.2)]",
                  "backdrop-blur-sm",
                ]
              : [
                  "text-neutral-600 dark:text-neutral-400",
                  "hover:bg-white/35 dark:hover:bg-white/[0.08]",
                  "hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)]",
                  "dark:hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]",
                ]
          )}
        >
          <div className="relative">
            <Settings className="h-5 w-5" />
            {alertCount > 0 && <AlertBadge count={alertCount} />}
          </div>
          Ajustes
        </Link>

        {/* User Info */}
        {user && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white/30 dark:bg-white/[0.05] border border-white/20 dark:border-white/[0.04] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]">
            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={user.full_name || "Avatar"}
                width={36}
                height={36}
                className="rounded-full"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-white/40 dark:bg-white/10 flex items-center justify-center">
                <User className="h-4 w-4 text-neutral-500" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                {user.full_name || "Usuario"}
              </p>
              <p className="text-xs text-neutral-500 truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}

        {/* Theme & Logout */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center justify-between px-3 py-2.5 rounded-2xl bg-white/30 dark:bg-white/[0.05] border border-white/20 dark:border-white/[0.04] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Tema</span>
            <ThemeToggle />
          </div>
          <form action={signOut}>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-2xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-white/30 dark:hover:bg-white/[0.06] transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </aside>
  )
}

function NavLink({
  item,
  isActive,
}: {
  item: { name: string; href: string; icon: React.ElementType }
  isActive: boolean
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium",
        "transition-all duration-300 ease-out",
        isActive
          ? [
              "bg-white/55 dark:bg-white/[0.12]",
              "text-coffee-700 dark:text-coffee-300",
              "border border-white/35 dark:border-white/[0.08]",
              "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_2px_12px_-2px_rgba(0,0,0,0.08)]",
              "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_2px_12px_-2px_rgba(0,0,0,0.25)]",
              "backdrop-blur-sm",
            ]
          : [
              "text-neutral-500 dark:text-neutral-400",
              "hover:bg-white/30 dark:hover:bg-white/[0.07]",
              "hover:text-neutral-800 dark:hover:text-neutral-200",
              "hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]",
              "active:scale-[0.97]",
            ]
      )}
    >
      {/* Icon container — bounces on activation */}
      <span
        key={String(isActive)}
        className={cn(
          "shrink-0 flex items-center justify-center w-5 h-5",
          isActive && "nav-item-active"
        )}
      >
        <item.icon
          className={cn(
            "h-[18px] w-[18px] transition-colors duration-300",
            isActive
              ? "text-coffee-600 dark:text-amber-400"
              : "text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300"
          )}
        />
      </span>
      {item.name}

      {/* Active indicator — small dot on the right */}
      {isActive && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-coffee-500 dark:bg-amber-400 shrink-0 animate-[fade-up_0.3s_ease_both]" />
      )}
    </Link>
  )
}
