"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Loader2, Info, Star, X, Coffee, Droplets, Clock, Disc, MessageSquare, Camera } from "lucide-react"

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
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ImageUpload } from "@/components/forms/image-upload"

import {
  brewMethods,
  grindSizes,
  filterTypes,
  automaticDrinkTypes,
} from "@/lib/validations/brews"
import { getBrewMethodIcon } from "@/components/icons/brew-method-icons"
import { createBrew, updateBrew, deleteFavoriteBrew } from "@/app/(dashboard)/brews/actions"
import type { BeanOption, EquipmentOption, Brew, FavoriteBrew } from "@/app/(dashboard)/brews/actions"

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
  favorites?: FavoriteBrew[]
  defaultEquipmentId?: string
  onSuccess?: () => void
}

export function BrewForm({ brew, defaultBrew, beans, equipment, favorites = [], defaultEquipmentId, onSuccess }: BrewFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDrinkType, setSelectedDrinkType] = useState<string | null>(null)
  const [pendingFavorite, setPendingFavorite] = useState<FavoriteBrew | null>(null)
  const [showFavoriteConfirm, setShowFavoriteConfirm] = useState(false)

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

  function handleFavoriteSelect(favorite: FavoriteBrew) {
    // Verificar si el favorito tiene bean guardado o si hay uno seleccionado
    const currentBeanId = watch("bean_id")
    const beanToUse = favorite.bean_id || currentBeanId

    if (!beanToUse) {
      setError("Esta receta no tiene cafe asociado. Selecciona uno primero.")
      return
    }

    // Mostrar confirmacion
    setPendingFavorite(favorite)
    setShowFavoriteConfirm(true)
  }

  async function handleQuickCreateFromFavorite() {
    if (!pendingFavorite) return

    // Usar el bean del favorito o el seleccionado actualmente
    const currentBeanId = watch("bean_id")
    const beanToUse = pendingFavorite.bean_id || currentBeanId

    if (!beanToUse) {
      setError("Debes seleccionar un cafe")
      setShowFavoriteConfirm(false)
      return
    }

    setIsLoading(true)
    setError(null)
    setShowFavoriteConfirm(false)

    const brewData = {
      bean_id: beanToUse,
      brew_method: pendingFavorite.brew_method,
      dose_grams: pendingFavorite.dose_grams || 18,
      water_grams: pendingFavorite.water_grams || 300,
      water_temperature: pendingFavorite.water_temperature || null,
      grind_size: pendingFavorite.grind_size || null,
      total_time_seconds: pendingFavorite.total_time_seconds || null,
      bloom_time_seconds: pendingFavorite.bloom_time_seconds || null,
      bloom_water_grams: pendingFavorite.bloom_water_grams || null,
      filter_type: pendingFavorite.filter_type || null,
      equipment_id: pendingFavorite.equipment_id || null,
      grinder_id: pendingFavorite.grinder_id || null,
      notes: null,
      rating: null,
      yield_grams: null,
      image_url: null,
    }

    const result = await createBrew(brewData)

    if (!result.success) {
      setError(result.error || "Error al crear la preparacion")
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

  function handleDrinkTypeSelect(drinkType: string) {
    setSelectedDrinkType(drinkType)
    const drink = automaticDrinkTypes.find(d => d.value === drinkType)
    if (drink) {
      setValue("dose_grams", drink.dose)
      setValue("water_grams", drink.water)
      setValue("brew_method", "espresso")
    }
  }

  async function handleDeleteFavorite(id: string) {
    await deleteFavoriteBrew(id)
    router.refresh()
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

      {prefill && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Datos precargados de tu ultima preparacion. Selecciona el cafe y ajusta los parametros.
          </AlertDescription>
        </Alert>
      )}

      {/* Favorites Section */}
      {!brew && favorites.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-coffee-500/10">
              <Star className="h-4 w-4 text-coffee-500" />
            </div>
            <h3 className="font-medium">Mis favoritas</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {favorites.map((fav) => {
              const methodConfig = getBrewMethodIcon(fav.brew_method)
              const MethodIcon = methodConfig.icon
              const methodLabel = brewMethods.find(m => m.value === fav.brew_method)?.label || fav.brew_method

              return (
                <button
                  key={fav.id}
                  type="button"
                  onClick={() => handleFavoriteSelect(fav)}
                  className="group relative flex flex-col items-center p-4 rounded-2xl border bg-card hover:bg-muted/50 hover:border-primary/50 hover:shadow-md transition-all duration-200 text-left"
                >
                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteFavorite(fav.id)
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-opacity"
                  >
                    <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                  </button>

                  {/* Method Icon */}
                  <div className={`p-3 rounded-xl ${methodConfig.bgColor} mb-3`}>
                    <MethodIcon className={`h-6 w-6 ${methodConfig.color}`} />
                  </div>

                  {/* Favorite Name */}
                  <span className="font-medium text-sm text-center line-clamp-1 w-full">
                    {fav.name}
                  </span>

                  {/* Method Label */}
                  <span className="text-xs text-muted-foreground mt-0.5">
                    {methodLabel}
                  </span>

                  {/* Bean Name */}
                  {fav.beans && (
                    <span className="text-xs text-primary/80 mt-1 line-clamp-1 w-full text-center">
                      {fav.beans.name}
                    </span>
                  )}

                  {/* Dose Info */}
                  <div className="flex items-center gap-1 mt-2">
                    <Badge variant="secondary" className="text-xs font-normal rounded-full px-2">
                      {fav.dose_grams}g / {fav.water_grams}ml
                    </Badge>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Foto de la preparacion */}
      <FormSection title="Foto" icon={Camera}>
        <ImageUpload
          value={watch("image_url")}
          onChange={(url) => setValue("image_url", url)}
          disabled={isLoading}
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
                {beans.map((bean) => (
                  <SelectItem key={bean.id} value={bean.id}>
                    {bean.name}
                    {bean.roasters?.name && ` - ${bean.roasters.name}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

      {/* Confirmacion para crear desde favorito */}
      <AlertDialog open={showFavoriteConfirm} onOpenChange={setShowFavoriteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Crear preparacion rapida</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                {pendingFavorite && (
                  <>
                    <p>
                      Se creara una preparacion usando la receta <strong>{pendingFavorite.name}</strong> con{" "}
                      {pendingFavorite.dose_grams}g de cafe y {pendingFavorite.water_grams}ml de agua.
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Cafe: </span>
                      <strong>
                        {pendingFavorite.beans?.name ||
                          beans.find(b => b.id === watch("bean_id"))?.name ||
                          "No seleccionado"}
                      </strong>
                    </p>
                  </>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleQuickCreateFromFavorite}>
              Crear preparacion
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  )
}
