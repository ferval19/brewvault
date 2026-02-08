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
import { ImageUpload } from "@/components/forms/image-upload"

import {
  brewMethods,
  grindSizes,
  filterTypes,
} from "@/lib/validations/brews"
import { createBrew, updateBrew } from "@/app/(dashboard)/brews/actions"
import type { BeanOption, EquipmentOption, Brew } from "@/app/(dashboard)/brews/actions"

interface BrewFormData {
  bean_id: string
  equipment_id?: string | null
  grinder_id?: string | null
  brew_method: string
  grind_size?: string | null
  dose_grams: number
  water_grams: number
  water_temperature?: number | null
  total_time_seconds?: number | null
  bloom_time_seconds?: number | null
  bloom_water_grams?: number | null
  yield_grams?: number | null
  filter_type?: string | null
  notes?: string | null
  rating?: number | null
  image_url?: string | null
}

interface BrewFormProps {
  brew?: Brew
  beans: BeanOption[]
  equipment: EquipmentOption[]
  onSuccess?: () => void
}

export function BrewForm({ brew, beans, equipment, onSuccess }: BrewFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const brewers = equipment.filter((e) => e.type === "brewer" || e.type === "espresso_machine")
  const grinders = equipment.filter((e) => e.type === "grinder")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm<BrewFormData>({
    defaultValues: {
      bean_id: brew?.bean_id || "",
      equipment_id: brew?.equipment_id || undefined,
      grinder_id: brew?.grinder_id || undefined,
      brew_method: brew?.brew_method || "",
      grind_size: brew?.grind_size || undefined,
      dose_grams: brew?.dose_grams || 18,
      water_grams: brew?.water_grams || 300,
      water_temperature: brew?.water_temperature || 93,
      total_time_seconds: brew?.total_time_seconds || undefined,
      bloom_time_seconds: brew?.bloom_time_seconds || undefined,
      bloom_water_grams: brew?.bloom_water_grams || undefined,
      yield_grams: brew?.yield_grams || undefined,
      filter_type: brew?.filter_type || undefined,
      notes: brew?.notes || "",
      rating: brew?.rating || undefined,
      image_url: brew?.image_url || null,
    },
  })

  const doseGrams = watch("dose_grams")
  const waterGrams = watch("water_grams")
  const ratio = doseGrams && waterGrams ? (waterGrams / doseGrams).toFixed(1) : "-"

  async function onSubmit(data: BrewFormData) {
    if (!data.bean_id) {
      setError("Debes seleccionar un cafe")
      return
    }
    if (!data.brew_method) {
      setError("Debes seleccionar un metodo")
      return
    }

    setIsLoading(true)
    setError(null)

    const result = brew
      ? await updateBrew(brew.id, data as Parameters<typeof updateBrew>[1])
      : await createBrew(data as Parameters<typeof createBrew>[0])

    if (!result.success) {
      setError(result.error || "Error al guardar")
      setIsLoading(false)
      return
    }

    if (onSuccess) {
      onSuccess()
    } else {
      router.push("/brews")
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

      {/* Foto de la preparacion */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Foto de la preparacion</h3>
        <ImageUpload
          value={watch("image_url")}
          onChange={(url) => setValue("image_url", url)}
          disabled={isLoading}
        />
      </div>

      {/* Cafe y metodo */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Cafe y metodo</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="bean_id">Cafe *</Label>
            <Select
              value={watch("bean_id") || ""}
              onValueChange={(value) => setValue("bean_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cafe" />
              </SelectTrigger>
              <SelectContent>
                {beans.map((bean) => (
                  <SelectItem key={bean.id} value={bean.id}>
                    {bean.name}
                    {bean.roasters?.name && ` - ${bean.roasters.name}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="brew_method">Metodo *</Label>
            <Select
              value={watch("brew_method") || ""}
              onValueChange={(value) => setValue("brew_method", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar metodo" />
              </SelectTrigger>
              <SelectContent>
                {brewMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Dosis y agua */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Dosis y agua</h3>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="dose_grams">Dosis (g) *</Label>
            <Input
              id="dose_grams"
              type="number"
              step="0.1"
              placeholder="18"
              {...register("dose_grams", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="water_grams">Agua (g) *</Label>
            <Input
              id="water_grams"
              type="number"
              step="1"
              placeholder="300"
              {...register("water_grams", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label>Ratio</Label>
            <div className="h-10 px-3 py-2 rounded-md border bg-muted text-sm">
              1:{ratio}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="water_temperature">Temp (°C)</Label>
            <Input
              id="water_temperature"
              type="number"
              step="1"
              placeholder="93"
              {...register("water_temperature", { valueAsNumber: true })}
            />
          </div>
        </div>
      </div>

      {/* Tiempos */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Tiempos</h3>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="total_time_seconds">Total (seg)</Label>
            <Input
              id="total_time_seconds"
              type="number"
              placeholder="180"
              {...register("total_time_seconds", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bloom_time_seconds">Bloom (seg)</Label>
            <Input
              id="bloom_time_seconds"
              type="number"
              placeholder="30"
              {...register("bloom_time_seconds", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bloom_water_grams">Agua bloom (g)</Label>
            <Input
              id="bloom_water_grams"
              type="number"
              step="1"
              placeholder="40"
              {...register("bloom_water_grams", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yield_grams">Yield (g)</Label>
            <Input
              id="yield_grams"
              type="number"
              step="1"
              placeholder="250"
              {...register("yield_grams", { valueAsNumber: true })}
            />
          </div>
        </div>
      </div>

      {/* Molienda y equipo */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Molienda y equipo</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="grind_size">Tamano de molienda</Label>
            <Select
              value={watch("grind_size") || ""}
              onValueChange={(value) => setValue("grind_size", value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {grindSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter_type">Tipo de filtro</Label>
            <Select
              value={watch("filter_type") || ""}
              onValueChange={(value) => setValue("filter_type", value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {filterTypes.map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {grinders.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="grinder_id">Molino</Label>
              <Select
                value={watch("grinder_id") || ""}
                onValueChange={(value) => setValue("grinder_id", value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {grinders.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.brand ? `${g.brand} ${g.model}` : g.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {brewers.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="equipment_id">Cafetera</Label>
              <Select
                value={watch("equipment_id") || ""}
                onValueChange={(value) => setValue("equipment_id", value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {brewers.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.brand ? `${b.brand} ${b.model}` : b.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* Valoracion y notas */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Valoracion</h3>

        <div className="space-y-4">
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
              placeholder="Observaciones sobre la extraccion..."
              {...register("notes")}
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {brew ? "Guardar cambios" : "Registrar preparacion"}
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
