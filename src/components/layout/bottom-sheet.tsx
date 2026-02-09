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
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in-0"
        onClick={() => onOpenChange(false)}
      />

      {/* Sheet */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-neutral-900 rounded-t-3xl shadow-xl",
          "animate-in slide-in-from-bottom duration-300",
          "safe-area-pb"
        )}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 -mr-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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
          ? "bg-primary/10 text-primary"
          : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
      )}
    >
      <div
        className={cn(
          "p-3 rounded-xl",
          active ? "bg-primary/20" : "bg-neutral-100 dark:bg-neutral-800"
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
