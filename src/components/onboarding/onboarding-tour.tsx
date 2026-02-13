"use client"

import { useEffect } from "react"
import { useOnboarding } from "./onboarding-provider"
import { WelcomeModal } from "./welcome-modal"
import { OnboardingOverlay } from "./onboarding-overlay"
import { OnboardingTooltip } from "./onboarding-tooltip"

export function OnboardingTour() {
  const { isActive, hasCompletedOnboarding, isHydrated, startTour } = useOnboarding()

  // Auto-start tour for new users (wait until localStorage is read)
  useEffect(() => {
    if (isHydrated && !hasCompletedOnboarding && !isActive) {
      startTour()
    }
  }, [isHydrated, hasCompletedOnboarding, isActive, startTour])

  if (!isActive) return null

  return (
    <>
      <OnboardingOverlay />
      <OnboardingTooltip />
      <WelcomeModal />
    </>
  )
}
