"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Heart, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { createFavoriteBrew } from "@/app/(dashboard)/brews/actions"

interface SaveAsFavoriteButtonProps {
  brew: {
    brew_method: string
    dose_grams: number
    water_grams: number
    water_temperature?: number | null
    grind_size?: string | null
    total_time_seconds?: number | null
    bloom_time_seconds?: number | null
    bloom_water_grams?: number | null
    filter_type?: string | null
    equipment_id?: string | null
    grinder_id?: string | null
    beans?: {
      name?: string | null
    } | null
  }
}

export function SaveAsFavoriteButton({ brew }: SaveAsFavoriteButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState("")

  const defaultName = brew.beans?.name
    ? `Mi ${brew.brew_method} con ${brew.beans.name}`
    : `Mi ${brew.brew_method} favorito`

  async function handleSave() {
    if (!name.trim()) {
      setError("El nombre es requerido")
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await createFavoriteBrew({
      name: name.trim(),
      brew_method: brew.brew_method,
      dose_grams: brew.dose_grams,
      water_grams: brew.water_grams,
      water_temperature: brew.water_temperature,
      grind_size: brew.grind_size,
      total_time_seconds: brew.total_time_seconds,
      bloom_time_seconds: brew.bloom_time_seconds,
      bloom_water_grams: brew.bloom_water_grams,
      filter_type: brew.filter_type,
      equipment_id: brew.equipment_id,
      grinder_id: brew.grinder_id,
    })

    if (!result.success) {
      setError(result.error || "Error al guardar")
      setIsLoading(false)
      return
    }

    setOpen(false)
    setName("")
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="rounded-full backdrop-blur-sm"
          onClick={() => setName(defaultName)}
        >
          <Heart className="mr-1.5 h-4 w-4" />
          Guardar favorita
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Guardar como favorita</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="favorite-name">Nombre de la preparacion</Label>
            <Input
              id="favorite-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Mi V60 matutino"
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Podras usar esta preparacion como plantilla para futuras brews
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
