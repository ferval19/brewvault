"use client"

import Link from "next/link"
import { ArrowLeft, Pencil, MapPin, Mountain, Calendar, Star, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Bean } from "../actions"

const roastLevelLabels: Record<string, string> = {
  light: "Claro",
  "medium-light": "Medio-Claro",
  medium: "Medio",
  "medium-dark": "Medio-Oscuro",
  dark: "Oscuro",
}

const roastLevelGradients: Record<string, string> = {
  light: "from-coffee-200/30 to-yellow-300/30",
  "medium-light": "from-coffee-300/30 to-coffee-400/30",
  medium: "from-coffee-400/30 to-coffee-500/30",
  "medium-dark": "from-coffee-600/30 to-coffee-700/30",
  dark: "from-coffee-700/30 to-stone-700/30",
}

const statusLabels: Record<string, string> = {
  active: "Activo",
  finished: "Agotado",
  archived: "Archivado",
}

interface BeanDetailClientProps {
  bean: Bean
}

export function BeanDetailClient({ bean }: BeanDetailClientProps) {
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
    ? roastLevelGradients[bean.roast_level] || "from-coffee-400/30 to-coffee-500/30"
    : "from-coffee-400/30 to-coffee-500/30"

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className={cn("relative overflow-hidden rounded-3xl bg-gradient-to-br", gradient)}>
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
            <Link href={`/beans/${bean.id}/edit`}>
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
                <span className="px-3 py-1.5 rounded-full bg-coffee-500/90 text-white backdrop-blur-sm text-sm font-medium flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current" />
                  {bean.personal_rating}/5
                </span>
              )}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                {bean.name}
              </h1>
              {bean.roasters?.name && (
                <p className="text-white/80 drop-shadow">
                  {bean.roasters.name}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stock Section */}
      {stockPercentage !== null && (
        <>
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

          {/* Stock Bar */}
          <div className="space-y-2">
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  stockPercentage > 50 && "bg-green-500",
                  stockPercentage <= 50 && stockPercentage > 20 && "bg-coffee-500",
                  stockPercentage <= 20 && "bg-red-500"
                )}
                style={{ width: `${stockPercentage}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {stockPercentage}% restante
            </p>
          </div>
        </>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {bean.origin_country && (
          <MetricCard
            icon={<MapPin className="h-4 w-4" />}
            label="Origen"
            value={bean.origin_country}
            subvalue={bean.origin_region || undefined}
          />
        )}
        {bean.altitude && (
          <MetricCard
            icon={<Mountain className="h-4 w-4" />}
            label="Altitud"
            value={`${bean.altitude}`}
            subvalue="msnm"
          />
        )}
        {daysFromRoast !== null && (
          <MetricCard
            icon={<Calendar className="h-4 w-4" />}
            label="Tueste"
            value={daysFromRoast === 0 ? "Hoy" : `${daysFromRoast}`}
            subvalue={daysFromRoast === 0 ? "" : daysFromRoast === 1 ? "dia" : "dias"}
          />
        )}
        {bean.sca_score && (
          <MetricCard
            icon={<Star className="h-4 w-4" />}
            label="SCA Score"
            value={bean.sca_score.toString()}
            subvalue="/100"
          />
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Characteristics */}
        {(bean.variety || bean.process) && (
          <Section title="Caracteristicas">
            {bean.variety && <Row label="Variedad" value={bean.variety} />}
            {bean.process && <Row label="Proceso" value={bean.process} />}
            {bean.farm && <Row label="Finca" value={bean.farm} />}
          </Section>
        )}

        {/* Price Info */}
        {bean.price && (
          <Section title="Precio" icon={<Package className="h-4 w-4 text-muted-foreground" />}>
            <p className="text-3xl font-bold">
              {bean.price} {bean.currency || "EUR"}
            </p>
            {bean.weight_grams && (
              <p className="text-sm text-muted-foreground mt-1">
                {((bean.price / bean.weight_grams) * 100).toFixed(2)} {bean.currency || "EUR"}/100g
              </p>
            )}
          </Section>
        )}
      </div>

      {/* Flavor notes */}
      {bean.flavor_notes && bean.flavor_notes.length > 0 && (
        <Section title="Notas de sabor">
          <div className="flex flex-wrap gap-2">
            {bean.flavor_notes.map((note: string) => (
              <Badge key={note} variant="secondary" className="rounded-full px-4 py-1.5">
                {note}
              </Badge>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
  subvalue,
}: {
  icon: React.ReactNode
  label: string
  value: string
  subvalue?: string
}) {
  return (
    <div className="rounded-3xl glass-panel p-5">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-bold">
        {value}
        {subvalue && <span className="text-sm text-muted-foreground ml-1">{subvalue}</span>}
      </p>
    </div>
  )
}

function Section({
  title,
  icon,
  children,
}: {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-3xl glass-panel overflow-hidden">
      <div className="px-6 py-4 border-b bg-muted/30">
        <h3 className="font-semibold flex items-center gap-2">
          {icon}
          {title}
        </h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
