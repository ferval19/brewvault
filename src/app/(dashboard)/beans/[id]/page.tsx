import { notFound } from "next/navigation"
import { MapPin, Mountain, Calendar, Star, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

import {
  DetailPageHero,
  DetailBadge,
  DetailMetricGrid,
  DetailMetricCard,
  DetailSection,
  DetailRow,
} from "@/components/ui/detail-page"

import { getBean } from "../actions"

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
    ? roastLevelGradients[bean.roast_level] || "from-coffee-400/30 to-coffee-500/30"
    : "from-coffee-400/30 to-coffee-500/30"

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hero Section */}
      <DetailPageHero
        title={bean.name}
        subtitle={bean.roasters?.name || "Sin tostador"}
        backHref="/beans"
        editHref={`/beans/${id}/edit`}
        gradient={gradient}
        imageUrl={bean.photo_url}
        badges={
          <>
            <DetailBadge>{statusLabels[bean.status]}</DetailBadge>
            {bean.roast_level && (
              <DetailBadge>{roastLevelLabels[bean.roast_level] || bean.roast_level}</DetailBadge>
            )}
            {bean.personal_rating && (
              <DetailBadge variant="coffee">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current" />
                  {bean.personal_rating}/5
                </span>
              </DetailBadge>
            )}
          </>
        }
      />

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
      <DetailMetricGrid>
        {bean.origin_country && (
          <DetailMetricCard
            icon={MapPin}
            label="Origen"
            value={bean.origin_country}
            subvalue={bean.origin_region || undefined}
          />
        )}
        {bean.altitude && (
          <DetailMetricCard
            icon={Mountain}
            label="Altitud"
            value={`${bean.altitude}`}
            subvalue="msnm"
          />
        )}
        {daysFromRoast !== null && (
          <DetailMetricCard
            icon={Calendar}
            label="Tueste"
            value={daysFromRoast === 0 ? "Hoy" : `${daysFromRoast}`}
            subvalue={daysFromRoast === 0 ? "" : daysFromRoast === 1 ? "dia" : "dias"}
          />
        )}
        {bean.sca_score && (
          <DetailMetricCard
            icon={Star}
            label="SCA Score"
            value={bean.sca_score.toString()}
            subvalue="/100"
          />
        )}
      </DetailMetricGrid>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Characteristics */}
        {(bean.variety || bean.process) && (
          <DetailSection title="Caracteristicas">
            {bean.variety && <DetailRow label="Variedad" value={bean.variety} />}
            {bean.process && <DetailRow label="Proceso" value={bean.process} />}
            {bean.farm && <DetailRow label="Finca" value={bean.farm} />}
          </DetailSection>
        )}

        {/* Price Info */}
        {bean.price && (
          <DetailSection title="Precio" icon={Package}>
            <p className="text-3xl font-bold">
              {bean.price} {bean.currency || "EUR"}
            </p>
            {bean.weight_grams && (
              <p className="text-sm text-muted-foreground mt-1">
                {((bean.price / bean.weight_grams) * 100).toFixed(2)} {bean.currency || "EUR"}/100g
              </p>
            )}
          </DetailSection>
        )}
      </div>

      {/* Flavor notes */}
      {bean.flavor_notes && bean.flavor_notes.length > 0 && (
        <DetailSection title="Notas de sabor">
          <div className="flex flex-wrap gap-2">
            {bean.flavor_notes.map((note: string) => (
              <Badge key={note} variant="secondary" className="rounded-full px-4 py-1.5">
                {note}
              </Badge>
            ))}
          </div>
        </DetailSection>
      )}
    </div>
  )
}
