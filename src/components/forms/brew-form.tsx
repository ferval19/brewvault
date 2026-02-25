"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Loader2, Info, Coffee, Droplets, Clock, Disc, MessageSquare, Camera } from "lucide-react"

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
import { ImageUpload } from "@/components/forms/image-upload"
import { StockWarningDialog } from "@/components/forms/stock-warning-dialog"

import {
  brewMethods,
  grindSizes,
  filterTypes,
  automaticDrinkTypes,
} from "@/lib/validations/brews"
import { createBrew, updateBrew, uploadBrewPhoto, deleteBrewPhoto } from "@/app/(dashboard)/brews/actions"
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
  defaultBrew?: Brew | null
  beans: BeanOption[]
  equipment: EquipmentOption[]
  defaultEquipmentId?: string
  onSuccess?: () => void
}

export function BrewForm({ brew, defaultBrew, beans, equipment, defaultEquipmentId, onSuccess }: BrewFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDrinkType, setSelectedDrinkType] = useState<string | null>(null)
  const [showStockWarning, setShowStockWarning] = useState(false)
  const [pendingSubmitData, setPendingSubmitData] = useState<BrewFormData | null>(null)

  const brewers = equipment.filter((e) => e.type === "brewer" || e.type === "espresso_machine")
  const grinders = equipment.filter((e) => e.type === "grinder")

  // Use defaultBrew for pre-filling new brews (not for editing)
  const prefill = !brew && defaultBrew ? defaultBrew : null

  const {
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm<BrewFormData>({
    defaultValues: {
      bean_id: brew?.bean_id || "",
      equipment_id: brew?.equipment_id || defaultEquipmentId || prefill?.equipment_id || undefined,
      grinder_id: brew?.grinder_id || prefill?.grinder_id || undefined,
      brew_method: brew?.brew_method || prefill?.brew_method || "",
      grind_size: brew?.grind_size || prefill?.grind_size || undefined,
      dose_grams: brew?.dose_grams || prefill?.dose_grams || 18,
      water_grams: brew?.water_grams || prefill?.water_grams || 300,
      water_temperature: brew?.water_temperature || prefill?.water_temperature || 93,
      total_time_seconds: brew?.total_time_seconds || prefill?.total_time_seconds || undefined,
      bloom_time_seconds: brew?.bloom_time_seconds || prefill?.bloom_time_seconds || undefined,
      bloom_water_grams: brew?.bloom_water_grams || prefill?.bloom_water_grams || undefined,
      yield_grams: brew?.yield_grams || prefill?.yield_grams || undefined,
      filter_type: brew?.filter_type || prefill?.filter_type || undefined,
      notes: brew?.notes || "",
      rating: brew?.rating || undefined,
      image_url: brew?.image_url || null,
    },
  })

  const doseGrams = watch("dose_grams")
  const waterGrams = watch("water_grams")
  const ratio = doseGrams && waterGrams ? (waterGrams / doseGrams).toFixed(1) : "-"

  const selectedEquipmentId = watch("equipment_id")
  const selectedEquipment = selectedEquipmentId
    ? equipment.find(e => e.id === selectedEquipmentId)
    : null
  const isAutomatic = selectedEquipment?.subtype === "super_automatic"

  function handleDrinkTypeSelect(drinkType: string) {
    setSelectedDrinkType(drinkType)
    const drink = automaticDrinkTypes.find(d => d.value === drinkType)
    if (drink) {
      setValue("dose_grams", drink.dose)
      setValue("water_grams", drink.water)
      setValue("brew_method", "espresso")
    }
  }

  // Check stock for selected bean
  const selectedBeanId = watch("bean_id")
  const selectedBean = selectedBeanId ? beans.find(b => b.id === selectedBeanId) : null
  const hasNoStock = selectedBean && selectedBean.current_weight_grams !== null && selectedBean.current_weight_grams <= 0
  const hasLowStock = selectedBean && selectedBean.current_weight_grams !== null && selectedBean.current_weight_grams > 0 && selectedBean.current_weight_grams < doseGrams

  async function submitBrew(data: BrewFormData) {
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

  function handleContinueWithNoStock() {
    setShowStockWarning(false)
    if (pendingSubmitData) {
      submitBrew(pendingSubmitData)
    }
  }

  async function onSubmit(data: BrewFormData) {
    if (!data.bean_id) {
      setError("Debes seleccionar un cafe")
      return
    }
    if (!data.brew_method) {
      setError("Debes seleccionar un metodo")
      return
    }

    // Si no hay stock, mostrar dialogo de advertencia en lugar de bloquear
    const bean = beans.find(b => b.id === data.bean_id)
    if (bean && bean.current_weight_grams !== null && bean.current_weight_grams <= 0) {
      setPendingSubmitData(data)
      setShowStockWarning(true)
      return
    }

    await submitBrew(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {prefill && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Datos precargados de tu ultima preparacion. Selecciona el cafe y ajusta los parametros.
          </AlertDescription>
        </Alert>
      )}

      {/* Foto de la preparacion */}
      <FormSection title="Foto" icon={Camera}>
        <ImageUpload
          value={watch("image_url")}
          onChange={(url) => setValue("image_url", url)}
          disabled={isLoading}
          uploadFn={uploadBrewPhoto}
          deleteFn={deleteBrewPhoto}
        />
      </FormSection>

      {/* Cafe y equipo */}
      <FormSection title="Cafe y equipo" icon={Coffee}>
        <FormGrid>
          <FormField label="Cafe" htmlFor="bean_id" required>
            <Select
              value={watch("bean_id") || ""}
              onValueChange={(value) => setValue("bean_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cafe" />
              </SelectTrigger>
              <SelectContent>
                {beans.map((bean) => {
                  const noStock = bean.current_weight_grams !== null && bean.current_weight_grams <= 0
                  return (
                    <SelectItem
                      key={bean.id}
                      value={bean.id}
                      className={noStock ? "text-muted-foreground" : ""}
                    >
                      {bean.name}
                      {bean.roasters?.name && ` - ${bean.roasters.name}`}
                      {noStock && " (Sin stock)"}
                      {bean.current_weight_grams !== null && bean.current_weight_grams > 0 && (
                        <span className="text-muted-foreground ml-1">({bean.current_weight_grams}g)</span>
                      )}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            {hasNoStock && (
              <p className="text-sm text-amber-600 dark:text-amber-500 mt-1">
                Sin stock registrado. Al guardar podrás continuar o marcar como terminado.
              </p>
            )}
            {hasLowStock && !hasNoStock && (
              <p className="text-sm text-amber-600 dark:text-amber-500 mt-1">
                Stock bajo: solo quedan {selectedBean?.current_weight_grams}g (necesitas {doseGrams}g)
              </p>
            )}
          </FormField>

          {brewers.length > 0 && (
            <FormField label="Cafetera" htmlFor="equipment_id">
              <Select
                value={watch("equipment_id") || ""}
                onValueChange={(value) => {
                  setValue("equipment_id", value || null)
                  setSelectedDrinkType(null)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {brewers.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.brand ? `${b.brand} ${b.model}` : b.model}
                      {b.subtype === "super_automatic" && (
                        <span className="text-muted-foreground ml-1">(Auto)</span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          )}
        </FormGrid>

        {/* Automatic machine drink selector */}
        {isAutomatic && (
          <div className="p-4 rounded-lg bg-muted/50 border space-y-3">
            <p className="text-sm text-muted-foreground">
              Cafetera superautomatica detectada. Selecciona el tipo de bebida:
            </p>
            <div className="flex flex-wrap gap-2">
              {automaticDrinkTypes.map((drink) => (
                <Button
                  key={drink.value}
                  type="button"
                  variant={selectedDrinkType === drink.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDrinkTypeSelect(drink.value)}
                >
                  {drink.label}
                  <span className="text-xs ml-1 opacity-70">({drink.dose}g/{drink.water}ml)</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Method selector - only for non-automatic */}
        {!isAutomatic && (
          <FormField label="Metodo" htmlFor="brew_method" required>
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
          </FormField>
        )}
      </FormSection>

      {/* Dosis y agua */}
      <FormSection title="Dosis y agua" icon={Droplets}>
        <FormGrid columns={4}>
          <FormField label="Dosis (g)" htmlFor="dose_grams" required>
            <Input
              id="dose_grams"
              type="number"
              step="0.1"
              placeholder="18"
              disabled={isAutomatic}
              className={isAutomatic ? "bg-muted" : ""}
              {...register("dose_grams", { valueAsNumber: true })}
            />
          </FormField>

          <FormField label="Agua (g)" htmlFor="water_grams" required>
            <Input
              id="water_grams"
              type="number"
              step="1"
              placeholder="300"
              disabled={isAutomatic}
              className={isAutomatic ? "bg-muted" : ""}
              {...register("water_grams", { valueAsNumber: true })}
            />
          </FormField>

          <FormField label="Ratio">
            <div className="h-10 px-3 py-2 rounded-md border bg-muted text-sm">
              1:{ratio}
            </div>
          </FormField>

          {!isAutomatic && (
            <FormField label="Temp (°C)" htmlFor="water_temperature">
              <Input
                id="water_temperature"
                type="number"
                step="1"
                placeholder="93"
                {...register("water_temperature", { valueAsNumber: true })}
              />
            </FormField>
          )}
        </FormGrid>
      </FormSection>

      {/* Tiempos - only for non-automatic */}
      {!isAutomatic && (
        <FormSection title="Tiempos" icon={Clock}>
          <FormGrid columns={4}>
            <FormField label="Total (seg)" htmlFor="total_time_seconds">
              <Input
                id="total_time_seconds"
                type="number"
                placeholder="180"
                {...register("total_time_seconds", { valueAsNumber: true })}
              />
            </FormField>

            <FormField label="Bloom (seg)" htmlFor="bloom_time_seconds">
              <Input
                id="bloom_time_seconds"
                type="number"
                placeholder="30"
                {...register("bloom_time_seconds", { valueAsNumber: true })}
              />
            </FormField>

            <FormField label="Agua bloom (g)" htmlFor="bloom_water_grams">
              <Input
                id="bloom_water_grams"
                type="number"
                step="1"
                placeholder="40"
                {...register("bloom_water_grams", { valueAsNumber: true })}
              />
            </FormField>

            <FormField label="Yield (g)" htmlFor="yield_grams">
              <Input
                id="yield_grams"
                type="number"
                step="1"
                placeholder="250"
                {...register("yield_grams", { valueAsNumber: true })}
              />
            </FormField>
          </FormGrid>
        </FormSection>
      )}

      {/* Molienda y equipo - only for non-automatic */}
      {!isAutomatic && (
        <FormSection title="Molienda y filtro" icon={Disc}>
          <FormGrid>
            <FormField label="Tamano de molienda" htmlFor="grind_size">
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
            </FormField>

            <FormField label="Tipo de filtro" htmlFor="filter_type">
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
            </FormField>

            {grinders.length > 0 && (
              <FormField label="Molino" htmlFor="grinder_id">
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
              </FormField>
            )}
          </FormGrid>
        </FormSection>
      )}

      {/* Valoracion y notas */}
      <FormSection title="Valoracion" icon={MessageSquare}>
        <div className="space-y-4">
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
              placeholder="Observaciones sobre la extraccion..."
              {...register("notes")}
              rows={3}
            />
          </FormField>
        </div>
      </FormSection>

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

      <StockWarningDialog
        open={showStockWarning}
        onOpenChange={setShowStockWarning}
        beanId={pendingSubmitData?.bean_id || ""}
        beanName={selectedBean?.name || ""}
        onContinue={handleContinueWithNoStock}
        onFinished={() => {
          setValue("bean_id", "")
          router.refresh()
        }}
      />
    </form>
  )
}
