"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCheck, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { markAllAlertsAsRead } from "./actions"

export function MarkAllReadButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleClick() {
    setIsLoading(true)
    await markAllAlertsAsRead()
    router.refresh()
    setIsLoading(false)
  }

  return (
    <Button variant="outline" onClick={handleClick} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <CheckCheck className="mr-2 h-4 w-4" />
      )}
      Marcar todas como leidas
    </Button>
  )
}
