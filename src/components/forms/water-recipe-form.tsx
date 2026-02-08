"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { createWaterRecipe, updateWaterRecipe } from "@/app/(dashboard)/water/actions"
import type { WaterRecipe } from "@/app/(dashboard)/water/actions"

interface WaterRecipeFormData {
  name: string
  gh?: number | null
  kh?: number | null
  calcium?: number | null
  magnesium?: number | null
  tds?: number | null
  ph?: number | null
  notes?: string | null
}

interface WaterRecipeFormProps {
  recipe?: WaterRecipe
  onSuccess?: () => void
}

export function WaterRecipeForm({ recipe, onSuccess }: WaterRecipeFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WaterRecipeFormData>({
    defaultValues: {
      name: recipe?.name || "",
      gh: recipe?.gh ?? undefined,
      kh: recipe?.kh ?? undefined,
      calcium: recipe?.calcium ?? undefined,
      magnesium: recipe?.magnesium ?? undefined,
      tds: recipe?.tds ?? undefined,
      ph: recipe?.ph ?? undefined,
      notes: recipe?.notes || "",
    },
  })

  async function onSubmit(data: WaterRecipeFormData) {
    if (!data.name) {
      setError("El nombre es requerido")
      return
    }

    setIsLoading(true)
    setError(null)

    const input = {
      name: data.name,
      gh: data.gh || null,
      kh: data.kh || null,
      calcium: data.calcium || null,
      magnesium: data.magnesium || null,
      tds: data.tds || null,
      ph: data.ph || null,
      notes: data.notes || null,
    }

    const result = recipe
      ? await updateWaterRecipe(recipe.id, input)
      : await createWaterRecipe(input)

    if (!result.success) {
      setError(result.error || "Error al guardar")
      setIsLoading(false)
      return
    }

    if (onSuccess) {
      onSuccess()
    } else {
      router.push("/water")
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Informacion basica */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informacion basica</h3>

        <div className="space-y-2">
          <Label htmlFor="name">Nombre *</Label>
          <Input
            id="name"
            placeholder="Ej: Agua mineral ligera"
            {...register("name", { required: true })}
          />
          {errors.name && (
            <p className="text-sm text-destructive">El nombre es requerido</p>
          )}
        </div>
      </div>

      {/* Minerales */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Composicion mineral</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="gh">GH (dureza general)</Label>
            <Input
              id="gh"
              type="number"
              step="0.1"
              placeholder="ppm"
              {...register("gh", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kh">KH (dureza carbonatos)</Label>
            <Input
              id="kh"
              type="number"
              step="0.1"
              placeholder="ppm"
              {...register("kh", { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="calcium">Calcio (Ca)</Label>
            <Input
              id="calcium"
              type="number"
              step="0.1"
              placeholder="ppm"
              {...register("calcium", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="magnesium">Magnesio (Mg)</Label>
            <Input
              id="magnesium"
              type="number"
              step="0.1"
              placeholder="ppm"
              {...register("magnesium", { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="tds">TDS</Label>
            <Input
              id="tds"
              type="number"
              step="0.1"
              placeholder="ppm"
              {...register("tds", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ph">pH</Label>
            <Input
              id="ph"
              type="number"
              step="0.1"
              min="0"
              max="14"
              placeholder="0-14"
              {...register("ph", { valueAsNumber: true })}
            />
          </div>
        </div>
      </div>

      {/* Notas */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notas</h3>

        <div className="space-y-2">
          <Textarea
            id="notes"
            placeholder="Notas sobre la receta de agua..."
            {...register("notes")}
            rows={3}
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {recipe ? "Guardar cambios" : "Crear receta"}
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
