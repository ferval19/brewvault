"use client"

import { useEffect, useState } from "react"
import { useOnboarding } from "./onboarding-provider"
import { tourSteps } from "./tour-steps"

export function OnboardingOverlay() {
  const { isActive, currentStep, skipTour } = useOnboarding()
  const [rect, setRect] = useState<DOMRect | null>(null)

  const step = tourSteps[currentStep]
  const isTooltipStep = step?.type === "tooltip"

  useEffect(() => {
    if (!isActive || !isTooltipStep || !step.targetId) {
      setRect(null)
      return
    }

    function update() {
      const el = document.querySelector(`[data-tour="${step.targetId}"]`)
      if (el) {
        setRect(el.getBoundingClientRect())
      } else {
        setRect(null)
      }
    }

    update()
    window.addEventListener("resize", update)
    window.addEventListener("scroll", update, true)
    return () => {
      window.removeEventListener("resize", update)
      window.removeEventListener("scroll", update, true)
    }
  }, [isActive, currentStep, isTooltipStep, step?.targetId])

  if (!isActive || !isTooltipStep) return null

  const padding = 8

  return (
    <div
      className="fixed inset-0 z-[9998] transition-opacity duration-300 backdrop-blur-[2px]"
      onClick={skipTour}
    >
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <mask id="onboarding-mask">
            <rect width="100%" height="100%" fill="white" />
            {rect && (
              <rect
                x={rect.left - padding}
                y={rect.top - padding}
                width={rect.width + padding * 2}
                height={rect.height + padding * 2}
                rx={20}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.3)"
          mask="url(#onboarding-mask)"
        />
        {/* Subtle glass ring around spotlight */}
        {rect && (
          <rect
            x={rect.left - padding - 1}
            y={rect.top - padding - 1}
            width={rect.width + padding * 2 + 2}
            height={rect.height + padding * 2 + 2}
            rx={21}
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={1}
          />
        )}
      </svg>
    </div>
  )
}
