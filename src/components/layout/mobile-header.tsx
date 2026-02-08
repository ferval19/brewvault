"use client"

import Link from "next/link"
import { Coffee } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function MobileHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 md:hidden">
      <div className="flex items-center justify-between h-14 px-4">
        <Link href="/beans" className="flex items-center gap-2">
          <Coffee className="h-5 w-5 text-amber-600" />
          <span className="font-semibold">BrewVault</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}
