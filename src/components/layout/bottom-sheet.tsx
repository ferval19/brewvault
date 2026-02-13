"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  title?: string
}

export function BottomSheet({ open, onOpenChange, children, title }: BottomSheetProps) {
  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false)
    }
    if (open) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md animate-in fade-in-0"
        onClick={() => onOpenChange(false)}
      />

      {/* Sheet */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 bg-white/75 dark:bg-black/80 glass-heavy rounded-t-3xl shadow-xl glass-border",
          "animate-in slide-in-from-bottom duration-300",
          "safe-area-pb"
        )}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-neutral-400/50 dark:bg-white/20" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 pb-4 border-b border-white/20 dark:border-white/[0.06]">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 -mr-2 rounded-full hover:bg-white/30 dark:hover:bg-white/[0.06] transition-colors"
            >
              <X className="h-5 w-5 text-neutral-500" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  )
}

interface BottomSheetItemProps {
  icon: React.ElementType
  label: string
  description?: string
  href?: string
  onClick?: () => void
  badge?: React.ReactNode
  active?: boolean
}

export function BottomSheetItem({
  icon: Icon,
  label,
  description,
  href,
  onClick,
  badge,
  active,
}: BottomSheetItemProps) {
  const Wrapper = href ? "a" : "button"

  return (
    <Wrapper
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 w-full p-4 rounded-2xl transition-colors text-left",
        active
          ? "bg-white/40 dark:bg-white/10 text-primary glass-subtle glass-border"
          : "hover:bg-white/30 dark:hover:bg-white/[0.06]"
      )}
    >
      <div
        className={cn(
          "p-3 rounded-xl",
          active ? "bg-primary/20" : "bg-white/40 dark:bg-white/[0.06]"
        )}
      >
        <Icon className={cn("h-5 w-5", active ? "text-primary" : "text-neutral-600 dark:text-neutral-400")} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium">{label}</p>
        {description && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
            {description}
          </p>
        )}
      </div>
      {badge}
    </Wrapper>
  )
}
