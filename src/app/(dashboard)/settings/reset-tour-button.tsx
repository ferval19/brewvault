"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/components/onboarding/onboarding-provider"

export function ResetTourButton() {
  const { resetTour } = useOnboarding()
  const router = useRouter()

  function handleReset() {
    resetTour()
    router.push("/dashboard")
  }

  return (
    <Button
      variant="outline"
      onClick={handleReset}
      className="rounded-xl"
    >
      Repetir tour
    </Button>
  )
}
