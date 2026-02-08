"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { createRoaster, updateRoaster } from "@/app/(dashboard)/roasters/actions"
import type { Roaster } from "@/app/(dashboard)/roasters/actions"

interface RoasterFormData {
  name: string
  country?: string | null
  city?: string | null
  website?: string | null
  notes?: string | null
  rating?: number | null
}

interface RoasterFormProps {
  roaster?: Roaster
  onSuccess?: () => void
}

export function RoasterForm({ roaster, onSuccess }: RoasterFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RoasterFormData>({
    defaultValues: {
      name: roaster?.name || "",
      country: roaster?.country || "",
      city: roaster?.city || "",
      website: roaster?.website || "",
      notes: roaster?.notes || "",
      rating: roaster?.rating || undefined,
    },
  })

  async function onSubmit(data: RoasterFormData) {
    if (!data.name) {
      setError("El nombre es requerido")
      return
    }

    setIsLoading(true)
    setError(null)

    const result = roaster
      ? await updateRoaster(roaster.id, data as Parameters<typeof updateRoaster>[1])
      : await createRoaster(data as Parameters<typeof createRoaster>[0])

    if (!result.success) {
      setError(result.error || "Error al guardar")
      setIsLoading(false)
      return
    }

    if (onSuccess) {
      onSuccess()
    } else {
      router.push("/roasters")
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
            placeholder="Ej: Nomad Coffee"
            {...register("name", { required: true })}
          />
          {errors.name && (
            <p className="text-sm text-destructive">El nombre es requerido</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="country">Pais</Label>
            <Input
              id="country"
              placeholder="Ej: Espana"
              {...register("country")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Ciudad</Label>
            <Input
              id="city"
              placeholder="Ej: Barcelona"
              {...register("city")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Sitio web</Label>
          <Input
            id="website"
            type="url"
            placeholder="https://ejemplo.com"
            {...register("website")}
          />
        </div>
      </div>

      {/* Valoracion */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Valoracion</h3>

        <div className="space-y-2">
          <Label htmlFor="rating">Puntuacion</Label>
          <Select
            value={watch("rating")?.toString() || ""}
            onValueChange={(value) =>
              setValue("rating", value ? parseInt(value) : null)
            }
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((rating) => (
                <SelectItem key={rating} value={rating.toString()}>
                  {"★".repeat(rating)}{"☆".repeat(5 - rating)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notas</Label>
          <Textarea
            id="notes"
            placeholder="Notas sobre el tostador..."
            {...register("notes")}
            rows={3}
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {roaster ? "Guardar cambios" : "Crear tostador"}
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
