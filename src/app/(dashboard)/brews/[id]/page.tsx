import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Pencil, Clock, Droplets, Scale, Thermometer } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { getBrew } from "../actions"
import { brewMethods, grindSizes, filterTypes } from "@/lib/validations/brews"

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
  const methodLabel = brewMethods.find((m) => m.value === brew.brew_method)?.label || brew.brew_method
  const grindLabel = grindSizes.find((g) => g.value === brew.grind_size)?.label || brew.grind_size
  const filterLabel = filterTypes.find((f) => f.value === brew.filter_type)?.label || brew.filter_type

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Link
            href="/brews"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Volver a preparaciones
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold">{brew.beans?.name}</h1>
          <p className="text-muted-foreground">
            {brew.beans?.roasters?.name || "Sin tostador"}
          </p>
        </div>
        <Link href={`/brews/${id}/edit`}>
          <Button variant="outline">
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </Link>
      </div>

      {/* Method and rating */}
      <div className="flex flex-wrap gap-3">
        <Badge variant="secondary" className="text-sm">
          {methodLabel}
        </Badge>
        {brew.rating && (
          <Badge variant="outline" className="text-amber-500">
            {"★".repeat(brew.rating)}{"☆".repeat(5 - brew.rating)}
          </Badge>
        )}
        <Badge variant="outline">
          {new Date(brew.brewed_at).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Badge>
      </div>

      {/* Main params */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Scale className="h-4 w-4" />
              <span className="text-xs">Dosis</span>
            </div>
            <p className="text-2xl font-bold">{brew.dose_grams}g</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Droplets className="h-4 w-4" />
              <span className="text-xs">Agua</span>
            </div>
            <p className="text-2xl font-bold">{brew.water_grams}g</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="text-muted-foreground text-xs mb-1">Ratio</div>
            <p className="text-2xl font-bold">
              1:{brew.ratio?.toFixed(1) || (brew.water_grams / brew.dose_grams).toFixed(1)}
            </p>
          </CardContent>
        </Card>

        {brew.water_temperature && (
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Thermometer className="h-4 w-4" />
                <span className="text-xs">Temp</span>
              </div>
              <p className="text-2xl font-bold">{brew.water_temperature}°C</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Tiempos */}
        {(brew.total_time_seconds || brew.bloom_time_seconds) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Tiempos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {brew.total_time_seconds && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tiempo total</span>
                  <span className="font-medium">{formatTime(brew.total_time_seconds)}</span>
                </div>
              )}
              {brew.bloom_time_seconds && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bloom</span>
                  <span className="font-medium">{formatTime(brew.bloom_time_seconds)}</span>
                </div>
              )}
              {brew.bloom_water_grams && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Agua bloom</span>
                  <span className="font-medium">{brew.bloom_water_grams}g</span>
                </div>
              )}
              {brew.yield_grams && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Yield</span>
                  <span className="font-medium">{brew.yield_grams}g</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Molienda y equipo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Molienda y equipo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {grindLabel && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Molienda</span>
                <span className="font-medium">{grindLabel}</span>
              </div>
            )}
            {filterLabel && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Filtro</span>
                <span className="font-medium">{filterLabel}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notas */}
      {brew.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{brew.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
