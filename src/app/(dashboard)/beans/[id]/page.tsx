import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Pencil, MapPin, Mountain, Calendar, Star, Package } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { getBean } from "../actions"

const roastLevelLabels: Record<string, string> = {
  light: "Claro",
  "medium-light": "Medio-Claro",
  medium: "Medio",
  "medium-dark": "Medio-Oscuro",
  dark: "Oscuro",
}

const roastLevelGradients: Record<string, string> = {
  light: "from-amber-200/30 to-yellow-300/30",
  "medium-light": "from-amber-300/30 to-orange-300/30",
  medium: "from-amber-400/30 to-orange-400/30",
  "medium-dark": "from-amber-600/30 to-orange-600/30",
  dark: "from-amber-800/30 to-stone-700/30",
}

const statusLabels: Record<string, string> = {
  active: "Activo",
  finished: "Agotado",
  archived: "Archivado",
}

export default async function BeanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getBean(id)

  if (!result.success || !result.data) {
    notFound()
  }

  const bean = result.data

  const stockPercentage =
    bean.weight_grams && bean.current_weight_grams
      ? Math.round((bean.current_weight_grams / bean.weight_grams) * 100)
      : null

  const daysFromRoast = (() => {
    if (!bean.roast_date) return null
    const now = new Date()
    return Math.floor((now.getTime() - new Date(bean.roast_date).getTime()) / (1000 * 60 * 60 * 24))
  })()

  const gradient = bean.roast_level
    ? roastLevelGradients[bean.roast_level] || "from-amber-400/30 to-orange-400/30"
    : "from-amber-400/30 to-orange-400/30"

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient}`}>
        {bean.photo_url ? (
          <div className="relative aspect-[21/9] sm:aspect-[3/1]">
            <img
              src={bean.photo_url}
              alt={bean.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>
        ) : (
          <div className="relative aspect-[21/9] sm:aspect-[3/1] flex items-center justify-center">
            <div className="text-8xl opacity-20">☕</div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        )}

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <Link
              href="/beans"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm text-sm font-medium hover:bg-white dark:hover:bg-black/80 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
            <Link href={`/beans/${id}/edit`}>
              <Button variant="secondary" size="sm" className="rounded-full backdrop-blur-sm">
                <Pencil className="mr-1.5 h-4 w-4" />
                Editar
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm text-sm font-medium">
                {statusLabels[bean.status]}
              </span>
              {bean.roast_level && (
                <span className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm text-sm font-medium">
                  {roastLevelLabels[bean.roast_level] || bean.roast_level}
                </span>
              )}
              {bean.personal_rating && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/90 backdrop-blur-sm text-white text-sm font-medium">
                  <Star className="h-4 w-4 fill-current" />
                  {bean.personal_rating}/5
                </span>
              )}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                {bean.name}
              </h1>
              <p className="text-white/80 drop-shadow">
                {bean.roasters?.name || "Sin tostador"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Section */}
      {stockPercentage !== null && (
        <div className="flex items-center justify-center gap-6 py-6">
          <div className="text-center">
            <p className="text-4xl sm:text-5xl font-bold">{bean.current_weight_grams}g</p>
            <p className="text-sm text-muted-foreground mt-1">Restante</p>
          </div>
          <div className="text-2xl text-muted-foreground">/</div>
          <div className="text-center">
            <p className="text-4xl sm:text-5xl font-bold">{bean.weight_grams}g</p>
            <p className="text-sm text-muted-foreground mt-1">Total</p>
          </div>
        </div>
      )}

      {/* Stock Bar */}
      {stockPercentage !== null && (
        <div className="space-y-2">
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                stockPercentage > 50 && "bg-green-500",
                stockPercentage <= 50 && stockPercentage > 20 && "bg-amber-500",
                stockPercentage <= 20 && "bg-red-500"
              )}
              style={{ width: `${stockPercentage}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            {stockPercentage}% restante
          </p>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {bean.origin_country && (
          <MetricCard
            icon={MapPin}
            label="Origen"
            value={bean.origin_country}
            subvalue={bean.origin_region || undefined}
          />
        )}
        {bean.altitude && (
          <MetricCard
            icon={Mountain}
            label="Altitud"
            value={`${bean.altitude}`}
            subvalue="msnm"
          />
        )}
        {daysFromRoast !== null && (
          <MetricCard
            icon={Calendar}
            label="Tueste"
            value={daysFromRoast === 0 ? "Hoy" : `${daysFromRoast}`}
            subvalue={daysFromRoast === 0 ? "" : daysFromRoast === 1 ? "dia" : "dias"}
          />
        )}
        {bean.sca_score && (
          <MetricCard
            icon={Star}
            label="SCA Score"
            value={bean.sca_score.toString()}
            subvalue="/100"
          />
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Characteristics */}
        {(bean.variety || bean.process) && (
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Caracteristicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {bean.variety && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Variedad</span>
                  <span className="font-medium">{bean.variety}</span>
                </div>
              )}
              {bean.process && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Proceso</span>
                  <span className="font-medium">{bean.process}</span>
                </div>
              )}
              {bean.farm && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Finca</span>
                  <span className="font-medium">{bean.farm}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Price Info */}
        {bean.price && (
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" />
                Precio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {bean.price} {bean.currency || "EUR"}
              </p>
              {bean.weight_grams && (
                <p className="text-sm text-muted-foreground mt-1">
                  {((bean.price / bean.weight_grams) * 100).toFixed(2)} {bean.currency || "EUR"}/100g
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Flavor notes */}
      {bean.flavor_notes && bean.flavor_notes.length > 0 && (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Notas de sabor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {bean.flavor_notes.map((note: string) => (
                <Badge key={note} variant="secondary" className="rounded-full px-4 py-1.5">
                  {note}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  subvalue,
}: {
  icon: React.ElementType
  label: string
  value: string
  subvalue?: string
}) {
  return (
    <div className="rounded-2xl bg-card border p-5">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-bold">
        {value}
        {subvalue && <span className="text-sm text-muted-foreground ml-1">{subvalue}</span>}
      </p>
    </div>
  )
}
