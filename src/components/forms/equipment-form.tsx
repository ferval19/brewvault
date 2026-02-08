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

import { createEquipment, updateEquipment } from "@/app/(dashboard)/equipment/actions"
import type { Equipment } from "@/app/(dashboard)/equipment/actions"
import { equipmentTypes, maintenanceIntervals } from "@/lib/validations/equipment"
import { EquipmentCatalogPicker } from "@/components/forms/equipment-catalog-picker"
import type { CatalogEquipment } from "@/lib/data/equipment-catalog"

interface EquipmentFormData {
  type: string
  brand?: string | null
  model: string
  notes?: string | null
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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EquipmentFormData>({
    defaultValues: {
      type: equipment?.type || "grinder",
      brand: equipment?.brand || "",
      model: equipment?.model || "",
      notes: equipment?.notes || "",
      purchase_date: equipment?.purchase_date || "",
      last_maintenance: equipment?.last_maintenance || "",
      maintenance_interval_days: equipment?.maintenance_interval_days || undefined,
    },
  })

  function handleCatalogSelect(catalogEquipment: CatalogEquipment) {
    setValue("type", catalogEquipment.type)
    setValue("brand", catalogEquipment.brand)
    setValue("model", catalogEquipment.model)
    setValue("notes", catalogEquipment.description || "")
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
      brand: data.brand || null,
      model: data.model,
      notes: data.notes || null,
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

      {/* Informacion basica */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informacion basica</h3>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo *</Label>
          <Select
            value={watch("type")}
            onValueChange={(value) => setValue("type", value)}
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
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="brand">Marca</Label>
            <Input
              id="brand"
              placeholder="Ej: Baratza"
              {...register("brand")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Modelo *</Label>
            <Input
              id="model"
              placeholder="Ej: Encore ESP"
              {...register("model", { required: true })}
            />
            {errors.model && (
              <p className="text-sm text-destructive">El modelo es requerido</p>
            )}
          </div>
        </div>
      </div>

      {/* Fechas y mantenimiento */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Mantenimiento</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="purchase_date">Fecha de compra</Label>
            <Input
              id="purchase_date"
              type="date"
              {...register("purchase_date")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_maintenance">Ultimo mantenimiento</Label>
            <Input
              id="last_maintenance"
              type="date"
              {...register("last_maintenance")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maintenance_interval_days">Recordar mantenimiento cada</Label>
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
          <p className="text-xs text-muted-foreground">
            Recibiras una alerta cuando sea hora de limpiar o mantener este equipo
          </p>
        </div>
      </div>

      {/* Notas */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notas</h3>

        <div className="space-y-2">
          <Textarea
            id="notes"
            placeholder="Notas sobre el equipo..."
            {...register("notes")}
            rows={3}
          />
        </div>
      </div>

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
