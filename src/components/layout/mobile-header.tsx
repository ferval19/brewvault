"use client"

import Link from "next/link"
import { Coffee } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function MobileHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-2xl backdrop-saturate-[1.8] [-webkit-backdrop-filter:blur(40px)_saturate(1.8)] border-b border-white/30 dark:border-white/[0.08] md:hidden">
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
