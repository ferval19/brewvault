import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  Pencil,
  Clock,
  Thermometer,
  ClipboardList,
  Star,
  Droplets,
  Scale,
  Euro,
  Coffee,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SaveAsFavoriteButton } from "@/components/buttons/save-as-favorite-button"

import { getBrew } from "../actions"
import { getCuppingNoteByBrewId } from "../../cupping/actions"
import { grindSizes, filterTypes } from "@/lib/validations/brews"
import { getBrewMethodConfig } from "@/lib/brew-methods"

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function calculateBrewPrice(
  doseGrams: number,
  beanPrice: number | null | undefined,
  beanWeight: number | null | undefined
): number | null {
  if (!beanPrice || !beanWeight || beanWeight === 0) return null
  return (doseGrams / beanWeight) * beanPrice
}

export default async function BrewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getBrew(id)

  if (!result.success || !result.data) {
    notFound()
  }

  const brew = result.data
  const cuppingResult = await getCuppingNoteByBrewId(id)
  const cuppingNote = cuppingResult.success ? cuppingResult.data : null
  const methodConfig = getBrewMethodConfig(brew.brew_method)
  const MethodIcon = methodConfig.icon
  const grindLabel = grindSizes.find((g) => g.value === brew.grind_size)?.label || brew.grind_size
  const filterLabel = filterTypes.find((f) => f.value === brew.filter_type)?.label || brew.filter_type
  const ratio = brew.ratio?.toFixed(1) || (brew.water_grams / brew.dose_grams).toFixed(1)
  const brewPrice = calculateBrewPrice(brew.dose_grams, brew.beans?.price, brew.beans?.weight_grams)

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      {/* Header con navegación */}
      <div className="flex items-center justify-between">
        <Link
          href="/brews"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Volver</span>
        </Link>
        <div className="flex items-center gap-2">
          <SaveAsFavoriteButton brew={brew} />
          <Link href={`/brews/${id}/edit`}>
            <Button variant="outline" size="sm" className="rounded-full">
              <Pencil className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Editar</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      {brew.image_url && (
        <div className="relative aspect-video sm:aspect-[21/9] rounded-2xl overflow-hidden">
          <img
            src={brew.image_url}
            alt={`${brew.beans?.name || "Preparacion"}`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Info Principal */}
      <div className="space-y-4">
        {/* Método y fecha */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${methodConfig.bgColor} text-sm font-medium`}>
            <MethodIcon className={`h-4 w-4 ${methodConfig.color}`} />
            {methodConfig.label}
          </span>
          <span className="text-sm text-muted-foreground">
            {formatDate(brew.brewed_at)}
          </span>
        </div>

        {/* Nombre del café */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {brew.beans?.name || "Cafe desconocido"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {brew.beans?.roasters?.name || "Sin tostador"}
          </p>
        </div>

        {/* Badges de rating y precio */}
        <div className="flex flex-wrap gap-2">
          {brew.rating && (
            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-semibold">{brew.rating}/5</span>
            </div>
          )}
          {brewPrice !== null && (
            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Euro className="h-4 w-4" />
              <span className="font-semibold">{brewPrice.toFixed(2)}</span>
              <span className="text-sm opacity-70">por taza</span>
            </div>
          )}
        </div>
      </div>

      {/* Receta - Cards horizontales en móvil */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-card border p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-2">
            <Scale className="h-4 w-4" />
            <span className="text-xs font-medium uppercase">Dosis</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold">{brew.dose_grams}<span className="text-base font-normal text-muted-foreground">g</span></p>
        </div>
        <div className="rounded-2xl bg-card border p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-2">
            <Coffee className="h-4 w-4" />
            <span className="text-xs font-medium uppercase">Ratio</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold">1:<span className="text-xl sm:text-2xl">{ratio}</span></p>
        </div>
        <div className="rounded-2xl bg-card border p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-2">
            <Droplets className="h-4 w-4" />
            <span className="text-xs font-medium uppercase">{brew.yield_grams ? "Yield" : "Agua"}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold">{brew.yield_grams || brew.water_grams}<span className="text-base font-normal text-muted-foreground">g</span></p>
        </div>
      </div>

      {/* Parámetros de extracción */}
      {(brew.water_temperature || brew.total_time_seconds || brew.bloom_time_seconds || brew.bloom_water_grams) && (
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Parámetros</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {brew.water_temperature && (
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <Thermometer className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Temperatura</p>
                  <p className="font-semibold">{brew.water_temperature}°C</p>
                </div>
              </div>
            )}
            {brew.total_time_seconds && (
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Clock className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tiempo total</p>
                  <p className="font-semibold">{formatTime(brew.total_time_seconds)}</p>
                </div>
              </div>
            )}
            {brew.bloom_time_seconds && (
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Clock className="h-4 w-4 text-purple-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Bloom</p>
                  <p className="font-semibold">{formatTime(brew.bloom_time_seconds)}</p>
                </div>
              </div>
            )}
            {brew.bloom_water_grams && (
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10">
                  <Droplets className="h-4 w-4 text-cyan-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Agua bloom</p>
                  <p className="font-semibold">{brew.bloom_water_grams}g</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Molienda y filtro */}
      {(grindLabel || filterLabel) && (
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Molienda y equipo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {grindLabel && (
              <div className="flex justify-between items-center py-2 border-b last:border-0">
                <span className="text-muted-foreground">Molienda</span>
                <Badge variant="secondary" className="rounded-full">{grindLabel}</Badge>
              </div>
            )}
            {filterLabel && (
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Filtro</span>
                <Badge variant="secondary" className="rounded-full">{filterLabel}</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Notas */}
      {brew.notes && (
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {brew.notes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Nota de cata */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Nota de Cata
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cuppingNote ? (
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-3xl font-bold">
                  {cuppingNote.total_score ?? 0}
                  <span className="text-lg text-muted-foreground">/100</span>
                </p>
                {cuppingNote.flavor_descriptors && cuppingNote.flavor_descriptors.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {cuppingNote.flavor_descriptors.slice(0, 3).map((d) => (
                      <Badge key={d} variant="secondary" className="rounded-full text-xs">
                        {d}
                      </Badge>
                    ))}
                    {cuppingNote.flavor_descriptors.length > 3 && (
                      <Badge variant="outline" className="rounded-full text-xs">
                        +{cuppingNote.flavor_descriptors.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              <Link href={`/cupping/${cuppingNote.id}`}>
                <Button variant="outline" size="sm" className="rounded-full">
                  Ver
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground text-sm mb-3">
                Sin nota de cata
              </p>
              <Link href={`/cupping/new?brew_id=${id}`}>
                <Button variant="outline" size="sm" className="rounded-full">
                  <ClipboardList className="mr-1.5 h-4 w-4" />
                  Crear nota
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
