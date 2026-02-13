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
      <DialogContent className="sm:max-w-md rounded-3xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-2xl backdrop-saturate-[1.8] [-webkit-backdrop-filter:blur(40px)_saturate(1.8)] border-white/30 dark:border-white/[0.08] shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12),inset_0_1px_0_0_rgba(255,255,255,0.4)] dark:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.06)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-coffee-600" />
            BrewVault
          </DialogTitle>
        </DialogHeader>

        <nav className="space-y-1.5 py-4">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-medium transition-all duration-200",
                  isActive
                    ? [
                        "bg-white/50 dark:bg-white/[0.10]",
                        "text-neutral-900 dark:text-white",
                        "border border-white/30 dark:border-white/[0.08]",
                        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),0_2px_8px_-2px_rgba(0,0,0,0.06)]",
                        "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_2px_8px_-2px_rgba(0,0,0,0.2)]",
                        "backdrop-blur-sm",
                      ]
                    : [
                        "text-neutral-600 dark:text-neutral-400",
                        "hover:bg-white/30 dark:hover:bg-white/[0.06]",
                        "hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]",
                        "dark:hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]",
                      ]
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "text-coffee-600 dark:text-coffee-400")} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-white/20 dark:border-white/[0.06] pt-4 space-y-3">
          <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/25 dark:bg-white/[0.04] border border-white/20 dark:border-white/[0.04] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Tema</span>
            <ThemeToggle />
          </div>

          <form action={signOut}>
            <Button
              variant="ghost"
              className="w-full justify-start px-4 rounded-2xl text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white/30 dark:hover:bg-white/[0.06] transition-all duration-200"
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
