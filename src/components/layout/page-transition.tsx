"use client"

import { usePathname } from "next/navigation"

/**
 * Page transition wrapper using the key trick:
 * When pathname changes, React unmounts and remounts this div,
 * which resets the CSS animation — giving us a native iOS-like
 * page enter transition with zero JavaScript animation library needed.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  )
}
