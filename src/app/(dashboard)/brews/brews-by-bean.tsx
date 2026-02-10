"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight, Star, TrendingUp, Coffee, Euro } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getBrewMethodConfig } from "@/lib/brew-methods"
import type { Brew } from "./actions"

interface BrewsByBeanProps {
  brews: Brew[]
}

interface BeanGroup {
  beanId: string
  beanName: string
  roasterName: string | null
  brews: Brew[]
  bestBrew: Brew | null
  avgRating: number
  avgRatio: number
  avgPrice: number | null
  methods: string[]
}

function calculateBrewPrice(brew: Brew): number | null {
  const { beans, dose_grams } = brew
  if (!beans?.price || !beans?.weight_grams || beans.weight_grams === 0) {
    return null
  }
  return (dose_grams / beans.weight_grams) * beans.price
}

export function BrewsByBean({ brews }: BrewsByBeanProps) {
  // Group brews by bean
  const beanGroups = useMemo(() => {
    const groups = new Map<string, BeanGroup>()

    brews.forEach((brew) => {
      const beanId = brew.bean_id || "unknown"
      const beanName = brew.beans?.name || "Cafe desconocido"
      const roasterName = brew.beans?.roasters?.name || null

      if (!groups.has(beanId)) {
        groups.set(beanId, {
          beanId,
          beanName,
          roasterName,
          brews: [],
          bestBrew: null,
          avgRating: 0,
          avgRatio: 0,
          avgPrice: null,
          methods: [],
        })
      }

      groups.get(beanId)!.brews.push(brew)
    })

    // Calculate stats for each group
    groups.forEach((group) => {
      // Best brew (highest rating)
      const ratedBrews = group.brews.filter((b) => b.rating !== null)
      if (ratedBrews.length > 0) {
        group.bestBrew = ratedBrews.reduce((best, b) =>
          (b.rating || 0) > (best.rating || 0) ? b : best
        )
        group.avgRating = ratedBrews.reduce((sum, b) => sum + (b.rating || 0), 0) / ratedBrews.length
      }

      // Average ratio
      group.avgRatio = group.brews.reduce((sum, b) => sum + b.water_grams / b.dose_grams, 0) / group.brews.length

      // Average price
      const prices = group.brews.map(calculateBrewPrice).filter((p): p is number => p !== null)
      if (prices.length > 0) {
        group.avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length
      }

      // Unique methods used
      group.methods = [...new Set(group.brews.map((b) => b.brew_method))]
    })

    // Sort by number of brews (most used first)
    return Array.from(groups.values()).sort((a, b) => b.brews.length - a.brews.length)
  }, [brews])

  return (
    <div className="space-y-4">
      {beanGroups.map((group) => (
        <BeanGroupCard key={group.beanId} group={group} />
      ))}
    </div>
  )
}

function BeanGroupCard({ group }: { group: BeanGroup }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-start gap-4">
          {/* Coffee Icon */}
          <div className="p-3 rounded-xl bg-amber-500/10 shrink-0">
            <Coffee className="h-6 w-6 text-amber-600" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-lg">{group.beanName}</h3>
              <Badge variant="secondary" className="rounded-full">
                {group.brews.length} brews
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {group.roasterName || "Sin tostador"}
            </p>

            {/* Methods used */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {group.methods.map((method) => {
                const config = getBrewMethodConfig(method)
                const MethodIcon = config.icon
                return (
                  <span
                    key={method}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor}`}
                  >
                    <MethodIcon className={`h-3 w-3 ${config.color}`} />
                    {config.label}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="hidden sm:flex items-center gap-6 shrink-0">
            {group.avgRating > 0 && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Media</p>
                <p className="font-semibold flex items-center gap-1 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  {group.avgRating.toFixed(1)}
                </p>
              </div>
            )}
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Ratio</p>
              <p className="font-semibold">1:{group.avgRatio.toFixed(1)}</p>
            </div>
            {group.avgPrice !== null && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Coste</p>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  <Euro className="h-3.5 w-3.5" />
                  {group.avgPrice.toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {/* Expand Icon */}
          <div className="shrink-0">
            {expanded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Best Brew Highlight */}
        {group.bestBrew && (
          <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-amber-600" />
              <span className="font-medium text-amber-700 dark:text-amber-400">Mejor receta:</span>
              <span className="text-muted-foreground">
                {getBrewMethodConfig(group.bestBrew.brew_method).label} ·{" "}
                {group.bestBrew.dose_grams}g ·{" "}
                1:{(group.bestBrew.water_grams / group.bestBrew.dose_grams).toFixed(1)} ·{" "}
                {group.bestBrew.water_temperature || "?"}°C
              </span>
              <span className="ml-auto text-amber-500">
                {"★".repeat(group.bestBrew.rating || 0)}
              </span>
            </div>
          </div>
        )}
      </button>

      {/* Expanded Content - Brew List */}
      {expanded && (
        <div className="border-t">
          <div className="p-4 space-y-2">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Todas las preparaciones
            </p>
            {group.brews
              .sort((a, b) => new Date(b.brewed_at).getTime() - new Date(a.brewed_at).getTime())
              .map((brew) => (
                <BrewRow key={brew.id} brew={brew} isBest={brew.id === group.bestBrew?.id} />
              ))}
          </div>
          <div className="p-4 pt-0">
            <Link href={`/brews?bean=${group.beanId}`}>
              <Button variant="outline" size="sm" className="w-full rounded-xl">
                Ver todas en grid
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

function BrewRow({ brew, isBest }: { brew: Brew; isBest: boolean }) {
  const methodConfig = getBrewMethodConfig(brew.brew_method)
  const MethodIcon = methodConfig.icon
  const ratio = (brew.water_grams / brew.dose_grams).toFixed(1)
  const date = new Date(brew.brewed_at).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  })

  return (
    <Link href={`/brews/${brew.id}`}>
      <div
        className={`flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors ${
          isBest ? "ring-1 ring-amber-500/30 bg-amber-500/5" : ""
        }`}
      >
        <div className={`p-2 rounded-lg ${methodConfig.bgColor}`}>
          <MethodIcon className={`h-4 w-4 ${methodConfig.color}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{methodConfig.label}</span>
            {isBest && (
              <Badge variant="secondary" className="rounded-full text-xs bg-amber-500/10 text-amber-600">
                Mejor
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {brew.dose_grams}g · 1:{ratio} · {brew.water_temperature || "?"}°C
            {brew.total_time_seconds && ` · ${Math.floor(brew.total_time_seconds / 60)}:${(brew.total_time_seconds % 60).toString().padStart(2, "0")}`}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-xs text-muted-foreground">{date}</p>
          {brew.rating && (
            <p className="text-amber-500 text-sm">{"★".repeat(brew.rating)}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
