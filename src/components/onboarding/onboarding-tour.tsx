"use client"

import { useEffect } from "react"
import { useOnboarding } from "./onboarding-provider"
import { WelcomeModal } from "./welcome-modal"
import { OnboardingOverlay } from "./onboarding-overlay"
import { OnboardingTooltip } from "./onboarding-tooltip"

export function OnboardingTour() {
  const { isActive, hasCompletedOnboarding, startTour } = useOnboarding()

  // Auto-start tour for new users
  useEffect(() => {
    if (!hasCompletedOnboarding && !isActive) {
      startTour()
    }
  }, [hasCompletedOnboarding, isActive, startTour])

  if (!isActive) return null

  return (
    <>
      <OnboardingOverlay />
      <OnboardingTooltip />
      <WelcomeModal />
    </>
  )
}
