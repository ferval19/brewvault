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
  { name: "Cafes", href: "/beans", icon: Package },
]

const collectionNavigation = [
  { name: "Equipo", href: "/equipment", icon: Gauge },
  { name: "Catas", href: "/cupping", icon: ClipboardList },
]

export function SidebarClient({ alertCount, user }: SidebarClientProps) {
  const pathname = usePathname()

  return (
    <aside className="h-full w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 pb-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Coffee className="h-6 w-6 text-amber-600" />
          <h1 className="text-lg font-bold text-neutral-900 dark:text-white">
            BrewVault
          </h1>
        </Link>
      </div>

      {/* Quick Action */}
      <div className="px-4 mb-4">
        <Link href="/brews/new">
          <Button className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/20">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Brew
          </Button>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="px-4 flex-1 space-y-6">
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
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
        {/* Settings */}
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
            pathname.startsWith("/settings")
              ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
              : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
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
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={user.full_name || "Avatar"}
                width={36}
                height={36}
                className="rounded-full"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
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
          <div className="flex-1 flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Tema</span>
            <ThemeToggle />
          </div>
          <form action={signOut}>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
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
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
        isActive
          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-white"
      )}
    >
      <item.icon className={cn("h-5 w-5", isActive && "text-amber-600 dark:text-amber-400")} />
      {item.name}
    </Link>
  )
}
