"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Loader2, Gauge, Wrench, MessageSquare } from "lucide-react"

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

import { createEquipment, updateEquipment } from "@/app/(dashboard)/equipment/actions"
import type { Equipment } from "@/app/(dashboard)/equipment/actions"
import { equipmentTypes, maintenanceIntervals, espressoMachineSubtypes, grinderSubtypes } from "@/lib/validations/equipment"
import { EquipmentCatalogPicker } from "@/components/forms/equipment-catalog-picker"
import type { CatalogEquipment } from "@/lib/data/equipment-catalog"

interface EquipmentFormData {
  type: string
  subtype?: string | null
  brand?: string | null
  model: string
  notes?: string | null
  image_url?: string | null
  purchase_date?: string | null
  last_maintenance?: string | null
  maintenance_interval_days?: number | null
}

interface EquipmentFormProps {
  equipment?: Equipment
  onSuccess?: () => void
}

export function EquipmentForm({ equipment, onSuccess }: EquipmentFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [fromCatalog, setFromCatalog] = useState(false)
  const [catalogImage, setCatalogImage] = useState<string | null>(equipment?.image_url || null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EquipmentFormData>({
    defaultValues: {
      type: equipment?.type || "grinder",
      subtype: equipment?.subtype || undefined,
      brand: equipment?.brand || "",
      model: equipment?.model || "",
      notes: equipment?.notes || "",
      image_url: equipment?.image_url || null,
      purchase_date: equipment?.purchase_date || "",
      last_maintenance: equipment?.last_maintenance || "",
      maintenance_interval_days: equipment?.maintenance_interval_days || undefined,
    },
  })

  const watchType = watch("type")

  function handleCatalogSelect(catalogEquipment: CatalogEquipment) {
    setValue("type", catalogEquipment.type)
    setValue("subtype", catalogEquipment.subtype || null)
    setValue("brand", catalogEquipment.brand)
    setValue("model", catalogEquipment.model)
    setValue("notes", catalogEquipment.description || "")
    setValue("image_url", catalogEquipment.image_url || null)
    setCatalogImage(catalogEquipment.image_url || null)
    setFromCatalog(true)
  }

  async function onSubmit(data: EquipmentFormData) {
    if (!data.model) {
      setError("El modelo es requerido")
      return
    }

    setIsLoading(true)
    setError(null)

    const input = {
      type: data.type as "grinder" | "brewer" | "espresso_machine" | "kettle" | "scale" | "other",
      subtype: data.subtype as "super_automatic" | "semi_automatic" | "manual" | "electric" | null,
      brand: data.brand || null,
      model: data.model,
      notes: data.notes || null,
      image_url: data.image_url || null,
      purchase_date: data.purchase_date || null,
      last_maintenance: data.last_maintenance || null,
      maintenance_interval_days: data.maintenance_interval_days || null,
    }

    const result = equipment
      ? await updateEquipment(equipment.id, input)
      : await createEquipment(input)

    if (!result.success) {
      setError(result.error || "Error al guardar")
      setIsLoading(false)
      return
    }

    if (onSuccess) {
      onSuccess()
    } else {
      router.push("/equipment")
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

      {/* Catalog Picker */}
      {!equipment && (
        <div className="space-y-4">
          <EquipmentCatalogPicker onSelect={handleCatalogSelect} />
          {fromCatalog && (
            <Alert>
              <AlertDescription>
                Datos precargados del catalogo. Informacion obtenida de la web oficial del fabricante.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Image Preview */}
      {catalogImage && (
        <div className="flex justify-center">
          <div className="relative w-48 h-48 rounded-2xl overflow-hidden bg-muted/30 border">
            <img
              src={catalogImage}
              alt={watch("model") || "Equipo"}
              className="w-full h-full object-contain p-4"
            />
          </div>
        </div>
      )}

      {/* Informacion basica */}
      <FormSection title="Informacion basica" icon={Gauge}>
        <FormGrid>
          <FormField label="Tipo" htmlFor="type" required>
            <Select
              value={watch("type")}
              onValueChange={(value) => {
                setValue("type", value)
                setValue("subtype", null)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                {equipmentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {(watchType === "espresso_machine" || watchType === "grinder") && (
            <FormField label="Subtipo" htmlFor="subtype">
              <Select
                value={watch("subtype") || ""}
                onValueChange={(value) => setValue("subtype", value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar subtipo" />
                </SelectTrigger>
                <SelectContent>
                  {(watchType === "espresso_machine" ? espressoMachineSubtypes : grinderSubtypes).map((subtype) => (
                    <SelectItem key={subtype.value} value={subtype.value}>
                      {subtype.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          )}
        </FormGrid>

        <FormGrid>
          <FormField label="Marca" htmlFor="brand">
            <Input
              id="brand"
              placeholder="Ej: Baratza"
              {...register("brand")}
            />
          </FormField>

          <FormField label="Modelo" htmlFor="model" required>
            <Input
              id="model"
              placeholder="Ej: Encore ESP"
              {...register("model", { required: true })}
            />
            {errors.model && (
              <p className="text-sm text-destructive">El modelo es requerido</p>
            )}
          </FormField>
        </FormGrid>
      </FormSection>

      {/* Fechas y mantenimiento */}
      <FormSection title="Mantenimiento" icon={Wrench}>
        <FormGrid>
          <FormField label="Fecha de compra" htmlFor="purchase_date">
            <Input
              id="purchase_date"
              type="date"
              {...register("purchase_date")}
            />
          </FormField>

          <FormField label="Ultimo mantenimiento" htmlFor="last_maintenance">
            <Input
              id="last_maintenance"
              type="date"
              {...register("last_maintenance")}
            />
          </FormField>
        </FormGrid>

        <FormField
          label="Recordar mantenimiento cada"
          htmlFor="maintenance_interval_days"
          hint="Recibiras una alerta cuando sea hora de limpiar o mantener este equipo"
        >
          <Select
            value={watch("maintenance_interval_days")?.toString() || ""}
            onValueChange={(value) =>
              setValue("maintenance_interval_days", value ? parseInt(value) : null)
            }
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sin recordatorio" />
            </SelectTrigger>
            <SelectContent>
              {maintenanceIntervals.map((interval) => (
                <SelectItem key={interval.value} value={interval.value.toString()}>
                  {interval.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </FormSection>

      {/* Notas */}
      <FormSection title="Notas" icon={MessageSquare}>
        <Textarea
          id="notes"
          placeholder="Notas sobre el equipo..."
          {...register("notes")}
          rows={3}
        />
      </FormSection>

      {/* Botones */}
      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {equipment ? "Guardar cambios" : "Crear equipo"}
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
