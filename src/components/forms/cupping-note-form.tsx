"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { scaCategories } from "@/lib/validations/cupping-notes"
import { brewMethods } from "@/lib/validations/brews"
import {
  createCuppingNote,
  updateCuppingNote,
} from "@/app/(dashboard)/cupping/actions"
import type { CuppingNote, BrewOption } from "@/app/(dashboard)/cupping/actions"

interface CuppingNoteFormData {
  brew_id: string
  fragrance: number | null
  flavor: number | null
  aftertaste: number | null
  acidity: number | null
  body: number | null
  balance: number | null
  sweetness: number | null
  uniformity: number | null
  clean_cup: number | null
  overall: number | null
  flavor_descriptors_text: string
}

interface CuppingNoteFormProps {
  note?: CuppingNote
  availableBrews: BrewOption[]
  preselectedBrewId?: string
}

export function CuppingNoteForm({
  note,
  availableBrews,
  preselectedBrewId,
}: CuppingNoteFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!note

  const {
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm<CuppingNoteFormData>({
    defaultValues: {
      brew_id: note?.brew_id || preselectedBrewId || "",
      fragrance: note?.fragrance ?? null,
      flavor: note?.flavor ?? null,
      aftertaste: note?.aftertaste ?? null,
      acidity: note?.acidity ?? null,
      body: note?.body ?? null,
      balance: note?.balance ?? null,
      sweetness: note?.sweetness ?? null,
      uniformity: note?.uniformity ?? null,
      clean_cup: note?.clean_cup ?? null,
      overall: note?.overall ?? null,
      flavor_descriptors_text: note?.flavor_descriptors?.join(", ") || "",
    },
  })

  const watchedScores = watch(
    scaCategories.map((c) => c.key) as (keyof CuppingNoteFormData)[]
  )
  const totalScore = scaCategories.reduce((sum, _, i) => {
    const val = Number(watchedScores[i]) || 0
    return sum + val
  }, 0)

  const selectedBrewId = watch("brew_id")

  function formatBrewLabel(brew: BrewOption) {
    const beanName = brew.beans?.name || "Sin cafe"
    const method = brewMethods.find((m) => m.value === brew.brew_method)?.label || brew.brew_method
    const date = new Date(brew.brewed_at).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    })
    return `${beanName} — ${method} (${date})`
  }

  async function onSubmit(data: CuppingNoteFormData) {
    if (!data.brew_id) {
      setError("Debes seleccionar una preparacion")
      return
    }

    setIsLoading(true)
    setError(null)

    const descriptors = data.flavor_descriptors_text
      ? data.flavor_descriptors_text
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean)
      : null

    const input = {
      brew_id: data.brew_id,
      fragrance: data.fragrance || null,
      flavor: data.flavor || null,
      aftertaste: data.aftertaste || null,
      acidity: data.acidity || null,
      body: data.body || null,
      balance: data.balance || null,
      sweetness: data.sweetness || null,
      uniformity: data.uniformity || null,
      clean_cup: data.clean_cup || null,
      overall: data.overall || null,
      flavor_descriptors: descriptors,
    }

    const result = isEditing
      ? await updateCuppingNote(note.id, input)
      : await createCuppingNote(input)

    if (!result.success) {
      setError(result.error || "Error al guardar")
      setIsLoading(false)
      return
    }

    router.push("/cupping")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Seleccion de preparacion */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Preparacion</h3>

        <div className="space-y-2">
          <Label htmlFor="brew_id">Preparacion *</Label>
          {isEditing ? (
            <Input
              disabled
              value={
                note.brews
                  ? `${note.brews.beans?.name || "Sin cafe"} — ${
                      brewMethods.find((m) => m.value === note.brews!.brew_method)?.label || note.brews.brew_method
                    }`
                  : "Preparacion"
              }
            />
          ) : (
            <Select
              value={selectedBrewId}
              onValueChange={(value) => setValue("brew_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una preparacion" />
              </SelectTrigger>
              <SelectContent>
                {availableBrews.map((brew) => (
                  <SelectItem key={brew.id} value={brew.id}>
                    {formatBrewLabel(brew)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {availableBrews.length === 0 && !isEditing && (
            <p className="text-sm text-muted-foreground">
              No hay preparaciones disponibles sin nota de cata.
            </p>
          )}
        </div>
      </div>

      {/* Puntuaciones SCA */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Puntuaciones SCA</h3>
          <div className="text-right">
            <span className="text-2xl font-bold">{totalScore.toFixed(2)}</span>
            <span className="text-muted-foreground">/100</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {scaCategories.map((category) => (
            <div key={category.key} className="space-y-2">
              <Label htmlFor={category.key}>{category.label}</Label>
              <Input
                id={category.key}
                type="number"
                step="0.25"
                min="0"
                max="10"
                placeholder="0-10"
                {...register(category.key as keyof CuppingNoteFormData, {
                  valueAsNumber: true,
                })}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Descriptores de sabor */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Descriptores de sabor</h3>

        <div className="space-y-2">
          <Label htmlFor="flavor_descriptors_text">
            Descriptores (separados por coma)
          </Label>
          <Input
            id="flavor_descriptors_text"
            placeholder="Ej: chocolate, caramelo, frutos rojos, citrico"
            {...register("flavor_descriptors_text")}
          />
          <p className="text-xs text-muted-foreground">
            Escribe los descriptores de sabor separados por comas
          </p>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Guardar cambios" : "Crear nota de cata"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
