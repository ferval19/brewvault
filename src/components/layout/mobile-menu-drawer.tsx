"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Menu,
  ClipboardList,
  Settings,
  LogOut,
  Coffee,
} from "lucide-react"
import { signOut } from "@/app/(auth)/actions"
import { ThemeToggle } from "@/components/theme-toggle"

const menuItems = [
  { name: "Notas de Cata", href: "/cupping", icon: ClipboardList },
  { name: "Configuracion", href: "/settings", icon: Settings },
]

export function MobileMenuDrawer() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={cn(
            "flex flex-col items-center justify-center flex-1 h-full gap-1 text-xs font-medium transition-colors",
            "text-neutral-500 dark:text-neutral-400"
          )}
        >
          <Menu className="h-5 w-5" />
          <span>Menu</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-amber-600" />
            BrewVault
          </DialogTitle>
        </DialogHeader>

        <nav className="space-y-1 py-4">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors",
                  isActive
                    ? "bg-white/40 dark:bg-white/10 text-neutral-900 dark:text-white glass-subtle"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-white/30 dark:hover:bg-white/[0.06]"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-white/20 dark:border-white/[0.06] pt-4 space-y-3">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Tema</span>
            <ThemeToggle />
          </div>

          <form action={signOut}>
            <Button
              variant="ghost"
              className="w-full justify-start px-4 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Cerrar sesion
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
