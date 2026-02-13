"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react"
import { usePersistedState } from "@/hooks/use-persisted-state"
import { tourSteps } from "./tour-steps"

interface OnboardingContextValue {
  isActive: boolean
  currentStep: number
  totalSteps: number
  hasCompletedOnboarding: boolean
  isHydrated: boolean
  startTour: () => void
  nextStep: () => void
  prevStep: () => void
  skipTour: () => void
  resetTour: () => void
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [hasCompleted, setHasCompleted, isHydrated] = usePersistedState(
    "brewvault-onboarding-completed",
    false
  )
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const startTour = useCallback(() => {
    setCurrentStep(0)
    setIsActive(true)
  }, [])

  const nextStep = useCallback(() => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      setIsActive(false)
      setHasCompleted(true)
    }
  }, [currentStep, setHasCompleted])

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep])

  const skipTour = useCallback(() => {
    setIsActive(false)
    setHasCompleted(true)
  }, [setHasCompleted])

  const resetTour = useCallback(() => {
    setHasCompleted(false)
    setCurrentStep(0)
    setIsActive(true)
  }, [setHasCompleted])

  const value = useMemo(
    () => ({
      isActive,
      currentStep,
      totalSteps: tourSteps.length,
      hasCompletedOnboarding: hasCompleted,
      isHydrated,
      startTour,
      nextStep,
      prevStep,
      skipTour,
      resetTour,
    }),
    [isActive, currentStep, hasCompleted, isHydrated, startTour, nextStep, prevStep, skipTour, resetTour]
  )

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) {
    throw new Error("useOnboarding must be used within OnboardingProvider")
  }
  return ctx
}
