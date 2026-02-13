"use client"

import Link from "next/link"
import { Coffee } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function MobileHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 md:hidden bg-white/60 dark:bg-white/[0.06] backdrop-blur-2xl backdrop-saturate-[1.8] [-webkit-backdrop-filter:blur(40px)_saturate(1.8)] border-b border-white/25 dark:border-white/[0.08] shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.1),0_1px_8px_-2px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.04),0_1px_8px_-2px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-between h-14 px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Coffee className="h-5 w-5 text-amber-600" />
          <span className="font-semibold">BrewVault</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}
