"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { signOut } from "./actions"

export function SignOutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSignOut() {
    setIsLoading(true)
    await signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <Button
      variant="destructive"
      onClick={handleSignOut}
      disabled={isLoading}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Cerrar sesion
    </Button>
  )
}
