"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { updateProfile, type UserProfile } from "./actions"

interface ProfileFormProps {
  profile: UserProfile
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [fullName, setFullName] = useState(profile.full_name || "")
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const result = await updateProfile({ full_name: fullName })

    if (result.success) {
      setMessage("Perfil actualizado")
      router.refresh()
    } else {
      setMessage(result.error)
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={profile.email} disabled className="bg-muted" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name">Nombre completo</Label>
        <Input
          id="full_name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Tu nombre"
        />
      </div>

      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Guardar cambios
      </Button>
    </form>
  )
}
