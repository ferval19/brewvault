"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Loader2, Package, MapPin, Leaf, Archive, Star, Camera } from "lucide-react"

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

import { roastLevels, beanStatuses } from "@/lib/validations/beans"
import { createBean, updateBean } from "@/app/(dashboard)/beans/actions"
import { ImageUpload } from "@/components/forms/image-upload"

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
  current_weight_grams?: number | null
  low_stock_threshold_grams?: number | null
  price?: number | null
  currency?: string
  barcode?: string | null
  photo_url?: string | null
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
    current_weight_grams: number | null
    low_stock_threshold_grams: number | null
    price: number | null
    currency: string | null
    barcode: string | null
    photo_url: string | null
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
      current_weight_grams: bean?.current_weight_grams || undefined,
      low_stock_threshold_grams: bean?.low_stock_threshold_grams || 100,
      price: bean?.price || undefined,
      currency: bean?.currency || "EUR",
      barcode: bean?.barcode || "",
      photo_url: bean?.photo_url || null,
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Información básica */}
      <FormSection title="Informacion basica" icon={Package}>
        <FormGrid>
          <FormField label="Nombre" htmlFor="name" required>
            <Input
              id="name"
              placeholder="Ej: Ethiopia Yirgacheffe"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <p className="text-sm text-destructive">El nombre es requerido</p>
            )}
          </FormField>

          <FormField label="Tostador" htmlFor="roaster_id">
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
          </FormField>
        </FormGrid>

        {/* Photo Upload */}
        <FormField label="Foto del cafe">
          <ImageUpload
            value={watch("photo_url")}
            onChange={(url) => setValue("photo_url", url)}
            disabled={isLoading}
          />
        </FormField>
      </FormSection>

      {/* Origen */}
      <FormSection title="Origen" icon={MapPin}>
        <FormGrid columns={4}>
          <FormField label="Pais" htmlFor="origin_country">
            <Input
              id="origin_country"
              placeholder="Ej: Etiopia"
              {...register("origin_country")}
            />
          </FormField>

          <FormField label="Region" htmlFor="origin_region">
            <Input
              id="origin_region"
              placeholder="Ej: Yirgacheffe"
              {...register("origin_region")}
            />
          </FormField>

          <FormField label="Finca" htmlFor="farm">
            <Input
              id="farm"
              placeholder="Ej: Konga"
              {...register("farm")}
            />
          </FormField>

          <FormField label="Altitud (msnm)" htmlFor="altitude">
            <Input
              id="altitude"
              type="number"
              placeholder="Ej: 1900"
              {...register("altitude", { valueAsNumber: true })}
            />
          </FormField>
        </FormGrid>
      </FormSection>

      {/* Características */}
      <FormSection title="Caracteristicas" icon={Leaf}>
        <FormGrid columns={4}>
          <FormField label="Variedad" htmlFor="variety">
            <Input
              id="variety"
              placeholder="Ej: Heirloom"
              {...register("variety")}
            />
          </FormField>

          <FormField label="Proceso" htmlFor="process">
            <Input
              id="process"
              placeholder="Ej: Lavado"
              {...register("process")}
            />
          </FormField>

          <FormField label="Nivel de tueste" htmlFor="roast_level">
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
          </FormField>

          <FormField label="Fecha de tueste" htmlFor="roast_date">
            <Input
              id="roast_date"
              type="date"
              {...register("roast_date")}
            />
          </FormField>
        </FormGrid>

        <FormField label="Notas de sabor" htmlFor="flavor_notes" hint="Separa las notas con comas">
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
        </FormField>
      </FormSection>

      {/* Inventario y precio */}
      <FormSection title="Inventario" icon={Archive}>
        <FormGrid columns={4}>
          <FormField label="Peso inicial (g)" htmlFor="weight_grams">
            <Input
              id="weight_grams"
              type="number"
              step="0.01"
              placeholder="Ej: 250"
              {...register("weight_grams", { valueAsNumber: true })}
            />
          </FormField>

          <FormField label="Peso actual (g)" htmlFor="current_weight_grams" hint="Se descuenta automaticamente al preparar">
            <Input
              id="current_weight_grams"
              type="number"
              step="0.01"
              placeholder="Ej: 180"
              {...register("current_weight_grams", { valueAsNumber: true })}
            />
          </FormField>

          <FormField label="Alerta stock bajo (g)" htmlFor="low_stock_threshold_grams" hint="Recibiras una alerta cuando quede menos">
            <Input
              id="low_stock_threshold_grams"
              type="number"
              step="1"
              placeholder="Ej: 100"
              {...register("low_stock_threshold_grams", { valueAsNumber: true })}
            />
          </FormField>

          <FormField label="Estado" htmlFor="status">
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
          </FormField>
        </FormGrid>

        <FormGrid columns={3}>
          <FormField label="Precio" htmlFor="price">
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="Ej: 15.00"
              {...register("price", { valueAsNumber: true })}
            />
          </FormField>

          <FormField label="Moneda" htmlFor="currency">
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
          </FormField>

          <FormField label="Codigo de barras" htmlFor="barcode">
            <Input
              id="barcode"
              placeholder="Ej: 8437000000001"
              {...register("barcode")}
            />
          </FormField>
        </FormGrid>
      </FormSection>

      {/* Puntuación */}
      <FormSection title="Puntuacion" icon={Star}>
        <FormGrid>
          <FormField label="Puntuacion SCA (0-100)" htmlFor="sca_score">
            <Input
              id="sca_score"
              type="number"
              step="0.1"
              min="0"
              max="100"
              placeholder="Ej: 86.5"
              {...register("sca_score", { valueAsNumber: true })}
            />
          </FormField>

          <FormField label="Tu puntuacion (1-5)" htmlFor="personal_rating">
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
          </FormField>
        </FormGrid>
      </FormSection>

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
