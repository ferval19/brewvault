import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Pencil, Clock, Thermometer, ClipboardList, ArrowRight, Star } from "lucide-react"

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

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${methodConfig.gradient}`}>
        {brew.image_url ? (
          <div className="relative aspect-[21/9] sm:aspect-[3/1]">
            <img
              src={brew.image_url}
              alt={`${brew.beans?.name || "Preparacion"}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>
        ) : (
          <div className="relative aspect-[21/9] sm:aspect-[3/1] flex items-center justify-center">
            <MethodIcon className={`h-24 w-24 ${methodConfig.color} opacity-30`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        )}

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <Link
              href="/brews"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm text-sm font-medium hover:bg-white dark:hover:bg-black/80 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
            <div className="flex items-center gap-2">
              <SaveAsFavoriteButton brew={brew} />
              <Link href={`/brews/${id}/edit`}>
                <Button variant="secondary" size="sm" className="rounded-full backdrop-blur-sm">
                  <Pencil className="mr-1.5 h-4 w-4" />
                  Editar
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm text-sm font-medium">
                <MethodIcon className={`h-4 w-4 ${methodConfig.color}`} />
                {methodConfig.label}
              </span>
              {brew.rating && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/90 backdrop-blur-sm text-white text-sm font-medium">
                  <Star className="h-4 w-4 fill-current" />
                  {brew.rating}/5
                </span>
              )}
              <span className="px-3 py-1.5 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm text-sm">
                {new Date(brew.brewed_at).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                {brew.beans?.name || "Cafe desconocido"}
              </h1>
              <p className="text-white/80 drop-shadow">
                {brew.beans?.roasters?.name || "Sin tostador"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Diagram */}
      <div className="flex items-center justify-center gap-4 py-6">
        <div className="text-center">
          <p className="text-4xl sm:text-5xl font-bold">{brew.dose_grams}g</p>
          <p className="text-sm text-muted-foreground mt-1">Dosis</p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <ArrowRight className="h-8 w-8" />
          <div className="text-center">
            <p className="text-2xl font-semibold">1:{ratio}</p>
            <p className="text-xs text-muted-foreground">Ratio</p>
          </div>
          <ArrowRight className="h-8 w-8" />
        </div>
        <div className="text-center">
          <p className="text-4xl sm:text-5xl font-bold">{brew.yield_grams || brew.water_grams}g</p>
          <p className="text-sm text-muted-foreground mt-1">{brew.yield_grams ? "Yield" : "Agua"}</p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {brew.water_temperature && (
          <MetricCard
            icon={Thermometer}
            label="Temperatura"
            value={`${brew.water_temperature}°C`}
          />
        )}
        {brew.total_time_seconds && (
          <MetricCard
            icon={Clock}
            label="Tiempo total"
            value={formatTime(brew.total_time_seconds)}
          />
        )}
        {brew.bloom_time_seconds && (
          <MetricCard
            icon={Clock}
            label="Bloom"
            value={formatTime(brew.bloom_time_seconds)}
          />
        )}
        {brew.bloom_water_grams && (
          <MetricCard
            label="Agua bloom"
            value={`${brew.bloom_water_grams}g`}
          />
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Molienda y equipo */}
        {(grindLabel || filterLabel) && (
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Molienda y equipo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {grindLabel && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Molienda</span>
                  <span className="font-medium">{grindLabel}</span>
                </div>
              )}
              {filterLabel && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Filtro</span>
                  <span className="font-medium">{filterLabel}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Notas */}
        {brew.notes && (
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Notas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {brew.notes}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Nota de cata */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Nota de Cata
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cuppingNote ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold">
                  {cuppingNote.total_score ?? 0}
                  <span className="text-xl text-muted-foreground">/100</span>
                </p>
                {cuppingNote.flavor_descriptors && cuppingNote.flavor_descriptors.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {cuppingNote.flavor_descriptors.slice(0, 4).map((d) => (
                      <Badge key={d} variant="secondary" className="rounded-full">
                        {d}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <Link href={`/cupping/${cuppingNote.id}`}>
                <Button variant="outline" className="rounded-xl">
                  Ver detalle
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="p-4 rounded-full bg-muted/50 inline-block mb-4">
                <ClipboardList className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">
                Esta preparacion no tiene nota de cata
              </p>
              <Link href={`/cupping/new?brew_id=${id}`}>
                <Button variant="outline" className="rounded-xl">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Crear nota de cata
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl bg-card border p-5">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        {Icon && <Icon className="h-4 w-4" />}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}
