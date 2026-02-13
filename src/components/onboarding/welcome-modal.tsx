"use client"

import { Coffee, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useOnboarding } from "./onboarding-provider"
import { tourSteps } from "./tour-steps"

export function WelcomeModal() {
  const { isActive, currentStep, nextStep, skipTour } = useOnboarding()

  const step = tourSteps[currentStep]
  if (!isActive || !step || step.type !== "modal") return null

  const isWelcome = step.id === "welcome"
  const isCompleted = step.id === "completed"

  return (
    <Dialog open onOpenChange={() => skipTour()}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "max-w-sm rounded-3xl",
          // Liquid Glass surface
          "bg-white/65 dark:bg-white/[0.08]",
          "backdrop-blur-2xl backdrop-saturate-[1.8]",
          "[-webkit-backdrop-filter:blur(40px)_saturate(1.8)]",
          "border-white/35 dark:border-white/[0.08]",
          "shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12),inset_0_1px_0_0_rgba(255,255,255,0.5)]",
          "dark:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.06)]",
        )}
      >
        <DialogHeader className="items-center text-center pt-2">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-coffee-500 to-coffee-600 shadow-[0_8px_24px_-4px_rgba(139,90,43,0.4),inset_0_1px_0_0_rgba(255,255,255,0.25)]">
            {isWelcome ? (
              <Coffee className="h-8 w-8 text-white" />
            ) : (
              <Sparkles className="h-8 w-8 text-white" />
            )}
          </div>
          <DialogTitle className="text-xl">{step.title}</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            {step.description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center gap-2 pt-2">
          {isWelcome && (
            <>
              <button
                onClick={nextStep}
                className={cn(
                  "px-6 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200",
                  "bg-gradient-to-br from-coffee-600 to-coffee-500 text-white",
                  "shadow-[0_4px_16px_-4px_rgba(139,90,43,0.4),inset_0_1px_0_0_rgba(255,255,255,0.25)]",
                  "hover:from-coffee-700 hover:to-coffee-600",
                  "hover:shadow-[0_6px_20px_-4px_rgba(139,90,43,0.5),inset_0_1px_0_0_rgba(255,255,255,0.25)]",
                )}
              >
                Empezar tour
              </button>
              <button
                onClick={skipTour}
                className={cn(
                  "px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200",
                  "bg-white/35 dark:bg-white/[0.06]",
                  "border border-white/25 dark:border-white/[0.06]",
                  "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]",
                  "text-neutral-600 dark:text-neutral-400",
                  "hover:bg-white/50 dark:hover:bg-white/[0.10]",
                )}
              >
                Saltar
              </button>
            </>
          )}
          {isCompleted && (
            <button
              onClick={nextStep}
              className={cn(
                "px-6 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200",
                "bg-gradient-to-br from-coffee-600 to-coffee-500 text-white",
                "shadow-[0_4px_16px_-4px_rgba(139,90,43,0.4),inset_0_1px_0_0_rgba(255,255,255,0.25)]",
                "hover:from-coffee-700 hover:to-coffee-600",
                "hover:shadow-[0_6px_20px_-4px_rgba(139,90,43,0.5),inset_0_1px_0_0_rgba(255,255,255,0.25)]",
              )}
            >
              Empezar a usar BrewVault
            </button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
