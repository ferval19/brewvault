"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Loader2, Store, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormSection, FormGrid, FormField } from "@/components/ui/form-section"
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Informacion basica */}
      <FormSection title="Informacion basica" icon={Store}>
        <FormField label="Nombre" htmlFor="name" required>
          <Input
            id="name"
            placeholder="Ej: Nomad Coffee"
            {...register("name", { required: true })}
          />
          {errors.name && (
            <p className="text-sm text-destructive">El nombre es requerido</p>
          )}
        </FormField>

        <FormGrid>
          <FormField label="Pais" htmlFor="country">
            <Input
              id="country"
              placeholder="Ej: Espana"
              {...register("country")}
            />
          </FormField>

          <FormField label="Ciudad" htmlFor="city">
            <Input
              id="city"
              placeholder="Ej: Barcelona"
              {...register("city")}
            />
          </FormField>
        </FormGrid>

        <FormField label="Sitio web" htmlFor="website">
          <Input
            id="website"
            type="url"
            placeholder="https://ejemplo.com"
            {...register("website")}
          />
        </FormField>
      </FormSection>

      {/* Valoracion */}
      <FormSection title="Valoracion" icon={Star}>
        <FormField label="Puntuacion" htmlFor="rating">
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
        </FormField>

        <FormField label="Notas" htmlFor="notes">
          <Textarea
            id="notes"
            placeholder="Notas sobre el tostador..."
            {...register("notes")}
            rows={3}
          />
        </FormField>
      </FormSection>

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
