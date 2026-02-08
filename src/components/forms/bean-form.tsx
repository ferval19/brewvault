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

import { roastLevels, beanStatuses } from "@/lib/validations/beans"
import { createBean, updateBean } from "@/app/(dashboard)/beans/actions"

interface BeanFormData {
  name: string
  roaster_id?: string | null
  origin_country?: string | null
  origin_region?: string | null
  farm?: string | null
  altitude?: number | null
  variety?: string | null
  process?: string | null
  roast_level?: string | null
  roast_date?: string | null
  flavor_notes?: string[] | null
  sca_score?: number | null
  weight_grams?: number | null
  price?: number | null
  currency?: string
  barcode?: string | null
  certifications?: string[] | null
  personal_rating?: number | null
  status?: string
}

interface BeanFormProps {
  bean?: {
    id: string
    name: string
    roaster_id: string | null
    origin_country: string | null
    origin_region: string | null
    farm: string | null
    altitude: number | null
    variety: string | null
    process: string | null
    roast_level: string | null
    roast_date: string | null
    flavor_notes: string[] | null
    sca_score: number | null
    weight_grams: number | null
    price: number | null
    currency: string | null
    barcode: string | null
    certifications: string[] | null
    personal_rating: number | null
    status: string
  }
  roasters: { id: string; name: string }[]
  onSuccess?: () => void
}

export function BeanForm({ bean, roasters, onSuccess }: BeanFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BeanFormData>({
    defaultValues: {
      name: bean?.name || "",
      roaster_id: bean?.roaster_id || undefined,
      origin_country: bean?.origin_country || "",
      origin_region: bean?.origin_region || "",
      farm: bean?.farm || "",
      altitude: bean?.altitude || undefined,
      variety: bean?.variety || "",
      process: bean?.process || "",
      roast_level: bean?.roast_level || undefined,
      roast_date: bean?.roast_date || "",
      flavor_notes: bean?.flavor_notes || [],
      sca_score: bean?.sca_score || undefined,
      weight_grams: bean?.weight_grams || undefined,
      price: bean?.price || undefined,
      currency: bean?.currency || "EUR",
      barcode: bean?.barcode || "",
      personal_rating: bean?.personal_rating || undefined,
      status: bean?.status || "active",
    },
  })

  const watchRoastLevel = watch("roast_level")
  const watchStatus = watch("status")

  async function onSubmit(data: BeanFormData) {
    if (!data.name) {
      setError("El nombre es requerido")
      return
    }

    setIsLoading(true)
    setError(null)

    const result = bean
      ? await updateBean(bean.id, data as Parameters<typeof updateBean>[1])
      : await createBean(data as Parameters<typeof createBean>[0])

    if (!result.success) {
      setError(result.error || "Error al guardar")
      setIsLoading(false)
      return
    }

    if (onSuccess) {
      onSuccess()
    } else {
      router.push("/beans")
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

      {/* Información básica */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informacion basica</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              placeholder="Ej: Ethiopia Yirgacheffe"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <p className="text-sm text-destructive">El nombre es requerido</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="roaster_id">Tostador</Label>
            <Select
              value={watch("roaster_id") || ""}
              onValueChange={(value) =>
                setValue("roaster_id", value || undefined)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tostador" />
              </SelectTrigger>
              <SelectContent>
                {roasters.map((roaster) => (
                  <SelectItem key={roaster.id} value={roaster.id}>
                    {roaster.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Origen */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Origen</h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="origin_country">Pais</Label>
            <Input
              id="origin_country"
              placeholder="Ej: Etiopia"
              {...register("origin_country")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="origin_region">Region</Label>
            <Input
              id="origin_region"
              placeholder="Ej: Yirgacheffe"
              {...register("origin_region")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="farm">Finca</Label>
            <Input
              id="farm"
              placeholder="Ej: Konga"
              {...register("farm")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="altitude">Altitud (msnm)</Label>
            <Input
              id="altitude"
              type="number"
              placeholder="Ej: 1900"
              {...register("altitude", { valueAsNumber: true })}
            />
          </div>
        </div>
      </div>

      {/* Características */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Caracteristicas</h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="variety">Variedad</Label>
            <Input
              id="variety"
              placeholder="Ej: Heirloom"
              {...register("variety")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="process">Proceso</Label>
            <Input
              id="process"
              placeholder="Ej: Lavado"
              {...register("process")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roast_level">Nivel de tueste</Label>
            <Select
              value={watchRoastLevel || ""}
              onValueChange={(value) => setValue("roast_level", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {roastLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="roast_date">Fecha de tueste</Label>
            <Input
              id="roast_date"
              type="date"
              {...register("roast_date")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="flavor_notes">Notas de sabor</Label>
          <Textarea
            id="flavor_notes"
            placeholder="Ej: Citrico, floral, te negro (separadas por coma)"
            onChange={(e) => {
              const notes = e.target.value
                .split(",")
                .map((n) => n.trim())
                .filter(Boolean)
              setValue("flavor_notes", notes)
            }}
            defaultValue={bean?.flavor_notes?.join(", ") || ""}
          />
          <p className="text-xs text-muted-foreground">
            Separa las notas con comas
          </p>
        </div>
      </div>

      {/* Inventario y precio */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Inventario</h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="weight_grams">Peso (g)</Label>
            <Input
              id="weight_grams"
              type="number"
              step="0.01"
              placeholder="Ej: 250"
              {...register("weight_grams", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Precio</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="Ej: 15.00"
              {...register("price", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Moneda</Label>
            <Select
              value={watch("currency") || "EUR"}
              onValueChange={(value) => setValue("currency", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              value={watchStatus || "active"}
              onValueChange={(value) => setValue("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {beanStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Puntuación */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Puntuacion</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sca_score">Puntuacion SCA (0-100)</Label>
            <Input
              id="sca_score"
              type="number"
              step="0.1"
              min="0"
              max="100"
              placeholder="Ej: 86.5"
              {...register("sca_score", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personal_rating">Tu puntuacion (1-5)</Label>
            <Select
              value={watch("personal_rating")?.toString() || ""}
              onValueChange={(value) =>
                setValue("personal_rating", parseInt(value))
              }
            >
              <SelectTrigger>
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
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {bean ? "Guardar cambios" : "Crear cafe"}
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
