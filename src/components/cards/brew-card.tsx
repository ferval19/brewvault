"use client"

import Link from "next/link"
import { useState } from "react"
import { MoreHorizontal, Pencil, Trash2, Eye, Clock, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { DeleteBrewDialog } from "@/app/(dashboard)/brews/delete-brew-dialog"
import { getBrewMethodConfig } from "@/lib/brew-methods"
import { getBrewMethodIllustration } from "@/lib/placeholder-illustrations"
import type { Brew } from "@/app/(dashboard)/brews/actions"

interface BrewCardProps {
  brew: Brew
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Hoy"
  if (diffDays === 1) return "Ayer"
  if (diffDays < 7) return `Hace ${diffDays} dias`

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  })
}

export function BrewCard({ brew }: BrewCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const methodConfig = getBrewMethodConfig(brew.brew_method)
  const MethodIcon = methodConfig.icon
  const MethodIllustration = getBrewMethodIllustration(brew.brew_method)
  const ratio = brew.ratio?.toFixed(1) || (brew.water_grams / brew.dose_grams).toFixed(1)

  return (
    <>
      <Link href={`/brews/${brew.id}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl bg-card border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
          {/* Header with image or gradient */}
          <div className={`relative aspect-[16/10] bg-gradient-to-br ${methodConfig.gradient}`}>
            {brew.image_url ? (
              <img
                src={brew.image_url}
                alt={`${brew.beans?.name || "Preparacion"}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <MethodIllustration className="w-24 h-24" />
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Top bar with actions */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <span className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm text-xs font-medium">
                {formatDate(brew.brewed_at)}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-white/90 dark:bg-black/60 backdrop-blur-sm hover:bg-white dark:hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/brews/${brew.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalle
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/brews/${brew.id}/edit`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowDeleteDialog(true)
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Bottom overlay with method badge */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm text-sm font-medium">
                  <MethodIcon className={`h-4 w-4 ${methodConfig.color}`} />
                  {methodConfig.label}
                </span>
              </div>
              {brew.rating && (
                <span className="px-2 py-1 rounded-full bg-amber-500/90 backdrop-blur-sm text-white text-sm font-medium">
                  {"★".repeat(brew.rating)}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            {/* Bean info */}
            <div>
              <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors">
                {brew.beans?.name || "Cafe desconocido"}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {brew.beans?.roasters?.name || "Sin tostador"}
              </p>
            </div>

            {/* Metrics row */}
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/50">
                <span className="font-medium">{brew.dose_grams}g</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span className="font-medium">{brew.yield_grams || brew.water_grams}g</span>
              </div>
              <div className="px-2.5 py-1.5 rounded-lg bg-muted/50">
                <span className="text-muted-foreground">1:</span>
                <span className="font-medium">{ratio}</span>
              </div>
              {brew.total_time_seconds && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/50">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-medium">{formatTime(brew.total_time_seconds)}</span>
                </div>
              )}
            </div>

            {/* Temperature */}
            {brew.water_temperature && (
              <div className="flex items-center justify-between pt-3 border-t text-sm text-muted-foreground">
                <span>Temperatura</span>
                <span className="font-medium text-foreground">{brew.water_temperature}°C</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      <DeleteBrewDialog
        brewId={brew.id}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  )
}
