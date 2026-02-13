"use client"

import { useEffect, useState, useCallback } from "react"
import { createPortal } from "react-dom"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useOnboarding } from "./onboarding-provider"
import { tourSteps } from "./tour-steps"

const GAP = 12
const TOOLTIP_WIDTH = 300

export function OnboardingTooltip() {
  const { isActive, currentStep, nextStep, prevStep, skipTour } =
    useOnboarding()
  const [position, setPosition] = useState<{
    top: number
    left: number
    placement: "top" | "bottom" | "left" | "right"
  } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const step = tourSteps[currentStep]
  const isTooltipStep = step?.type === "tooltip"

  const calculatePosition = useCallback(() => {
    if (!isTooltipStep || !step.targetId) return

    const el = document.querySelector(`[data-tour="${step.targetId}"]`)
    if (!el) {
      setPosition(null)
      return
    }

    const rect = el.getBoundingClientRect()
    const preferred = step.position || "bottom"
    const vw = window.innerWidth
    const vh = window.innerHeight
    const tooltipHeight = 190

    let placement = preferred
    let top = 0
    let left = 0

    // Check if preferred placement fits, fallback otherwise
    if (placement === "bottom" && rect.bottom + GAP + tooltipHeight > vh) {
      placement = "top"
    } else if (placement === "top" && rect.top - GAP - tooltipHeight < 0) {
      placement = "bottom"
    } else if (
      placement === "right" &&
      rect.right + GAP + TOOLTIP_WIDTH > vw
    ) {
      placement = "bottom"
    } else if (placement === "left" && rect.left - GAP - TOOLTIP_WIDTH < 0) {
      placement = "bottom"
    }

    switch (placement) {
      case "bottom":
        top = rect.bottom + GAP
        left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2
        break
      case "top":
        top = rect.top - GAP - tooltipHeight
        left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2
        break
      case "right":
        top = rect.top + rect.height / 2 - tooltipHeight / 2
        left = rect.right + GAP
        break
      case "left":
        top = rect.top + rect.height / 2 - tooltipHeight / 2
        left = rect.left - GAP - TOOLTIP_WIDTH
        break
    }

    // Clamp to viewport
    left = Math.max(12, Math.min(left, vw - TOOLTIP_WIDTH - 12))
    top = Math.max(12, Math.min(top, vh - tooltipHeight - 12))

    setPosition({ top, left, placement })
  }, [currentStep, isTooltipStep, step?.targetId, step?.position])

  useEffect(() => {
    if (!isActive || !isTooltipStep) {
      setPosition(null)
      return
    }

    // Small delay to allow DOM to settle
    const timer = setTimeout(calculatePosition, 50)
    window.addEventListener("resize", calculatePosition)
    window.addEventListener("scroll", calculatePosition, true)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", calculatePosition)
      window.removeEventListener("scroll", calculatePosition, true)
    }
  }, [isActive, isTooltipStep, calculatePosition])

  if (!mounted || !isActive || !isTooltipStep || !position || !step) return null

  // Progress: tooltip steps only (between modals)
  const tooltipSteps = tourSteps.filter((s) => s.type === "tooltip")
  const tooltipIndex = tooltipSteps.findIndex((s) => s.id === step.id)

  return createPortal(
    <div
      className={cn(
        "fixed z-[9999] animate-in fade-in-0 zoom-in-95 duration-200",
        "rounded-3xl p-5",
        // Liquid Glass surface
        "bg-white/65 dark:bg-white/[0.08]",
        "backdrop-blur-2xl backdrop-saturate-[1.8]",
        "[-webkit-backdrop-filter:blur(40px)_saturate(1.8)]",
        "border border-white/35 dark:border-white/[0.08]",
        "shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12),inset_0_1px_0_0_rgba(255,255,255,0.5)]",
        "dark:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.06)]",
      )}
      style={{
        top: position.top,
        left: position.left,
        width: TOOLTIP_WIDTH,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close button */}
      <button
        onClick={skipTour}
        className="absolute top-3 right-3 p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/40 dark:hover:bg-white/[0.08] transition-all duration-200"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      {/* Content */}
      <div className="pr-6">
        <h3 className="font-semibold text-sm text-neutral-900 dark:text-white">
          {step.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
          {step.description}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 mt-4">
        {tooltipSteps.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === tooltipIndex
                ? "w-5 bg-gradient-to-r from-coffee-500 to-coffee-400 shadow-[0_0_6px_rgba(160,107,53,0.3)]"
                : "w-1.5 bg-white/50 dark:bg-white/[0.15] border border-white/30 dark:border-white/[0.06]"
            )}
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-4 gap-2">
        <button
          onClick={prevStep}
          disabled={currentStep <= 1}
          className={cn(
            "flex items-center gap-1 px-3 py-2 rounded-2xl text-xs font-medium transition-all duration-200",
            "bg-white/35 dark:bg-white/[0.06]",
            "border border-white/25 dark:border-white/[0.06]",
            "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]",
            "text-neutral-600 dark:text-neutral-400",
            "hover:bg-white/50 dark:hover:bg-white/[0.10]",
            "disabled:opacity-40 disabled:pointer-events-none",
          )}
        >
          <ChevronLeft className="h-3 w-3" />
          Anterior
        </button>
        <button
          onClick={nextStep}
          className={cn(
            "flex items-center gap-1 px-4 py-2 rounded-2xl text-xs font-semibold transition-all duration-200",
            "bg-gradient-to-br from-coffee-600 to-coffee-500 text-white",
            "shadow-[0_4px_16px_-4px_rgba(139,90,43,0.4),inset_0_1px_0_0_rgba(255,255,255,0.25)]",
            "hover:from-coffee-700 hover:to-coffee-600",
            "hover:shadow-[0_6px_20px_-4px_rgba(139,90,43,0.5),inset_0_1px_0_0_rgba(255,255,255,0.25)]",
          )}
        >
          Siguiente
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>,
    document.body
  )
}
