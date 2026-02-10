"use client"

import { useState } from "react"
import Link from "next/link"
import { Clock, Thermometer, Euro, MoreHorizontal, Pencil, Trash2, Eye, ChevronRight, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteBrewDialog } from "./delete-brew-dialog"
import { getBrewMethodConfig } from "@/lib/brew-methods"
import type { Brew } from "./actions"

interface BrewListItemProps {
  brews: Brew[]
  selectionMode?: boolean
  selectedIds?: Set<string>
  onSelect?: (id: string) => void
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function formatDateHeader(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const brewDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  if (brewDate.getTime() === today.getTime()) return "Hoy"
  if (brewDate.getTime() === yesterday.getTime()) return "Ayer"

  const diffDays = Math.floor((today.getTime() - brewDate.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays < 7) return `Hace ${diffDays} dias`

  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}

function getDateKey(dateStr: string): string {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

function calculateBrewPrice(brew: Brew): number | null {
  const { beans, dose_grams } = brew
  if (!beans?.price || !beans?.weight_grams || beans.weight_grams === 0) {
    return null
  }
  return (dose_grams / beans.weight_grams) * beans.price
}

export function BrewListItem({ brews, selectionMode, selectedIds, onSelect }: BrewListItemProps) {
  // Group brews by date
  const groupedBrews = brews.reduce((groups, brew) => {
    const key = getDateKey(brew.brewed_at)
    if (!groups[key]) {
      groups[key] = {
        date: brew.brewed_at,
        brews: [],
      }
    }
    groups[key].brews.push(brew)
    return groups
  }, {} as Record<string, { date: string; brews: Brew[] }>)

  const sortedGroups = Object.values(groupedBrews).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="space-y-6">
      {sortedGroups.map((group) => (
        <div key={getDateKey(group.date)}>
          {/* Date Header */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {formatDateHeader(group.date)}
            </span>
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">
              {group.brews.length} {group.brews.length === 1 ? "brew" : "brews"}
            </span>
          </div>

          {/* Brews List */}
          <div className="rounded-2xl border bg-card divide-y overflow-hidden">
            {group.brews.map((brew) => (
              <ListRow
                key={brew.id}
                brew={brew}
                selectionMode={selectionMode}
                selected={selectedIds?.has(brew.id)}
                onSelect={onSelect ? () => onSelect(brew.id) : undefined}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ListRow({
  brew,
  selectionMode,
  selected,
  onSelect,
}: {
  brew: Brew
  selectionMode?: boolean
  selected?: boolean
  onSelect?: () => void
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const methodConfig = getBrewMethodConfig(brew.brew_method)
  const MethodIcon = methodConfig.icon
  const brewPrice = calculateBrewPrice(brew)

  const handleClick = (e: React.MouseEvent) => {
    if (selectionMode && onSelect) {
      e.preventDefault()
      onSelect()
    }
  }

  return (
    <>
      <div className={cn("group relative", selected && "bg-primary/5")}>
        <Link
          href={selectionMode ? "#" : `/brews/${brew.id}`}
          className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
          onClick={handleClick}
        >
          {/* Selection checkbox */}
          {selectionMode && (
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all border-2",
                selected
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-muted-foreground/30"
              )}
            >
              {selected && <Check className="h-4 w-4" />}
            </div>
          )}

          {/* Method Icon */}
          <div className={`p-2.5 rounded-xl ${methodConfig.bgColor} shrink-0`}>
            <MethodIcon className={`h-5 w-5 ${methodConfig.color}`} />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">
                {brew.beans?.name || "Cafe desconocido"}
              </h3>
              {brew.rating && (
                <span className="text-coffee-500 text-sm shrink-0">
                  {"★".repeat(brew.rating)}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {methodConfig.label}
            </p>
          </div>

          {/* Metrics - Desktop */}
          <div className="hidden md:flex items-center gap-4 text-sm shrink-0">
            <span className="font-mono">
              {brew.dose_grams}g → {brew.yield_grams || brew.water_grams}g
            </span>
            {brew.total_time_seconds && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {formatTime(brew.total_time_seconds)}
              </span>
            )}
            {brew.water_temperature && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Thermometer className="h-3.5 w-3.5" />
                {brew.water_temperature}°C
              </span>
            )}
            {brewPrice !== null && (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <Euro className="h-3.5 w-3.5" />
                {brewPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Metrics - Mobile (compact) */}
          <div className="flex md:hidden items-center gap-2 text-xs shrink-0">
            <span className="font-mono text-muted-foreground">{brew.dose_grams}g</span>
            {brewPrice !== null && (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <Euro className="h-3 w-3" />
                {brewPrice.toFixed(2)}
              </span>
            )}
          </div>

          {!selectionMode && <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
        </Link>

        {/* Actions Button - hidden in selection mode */}
        {!selectionMode && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
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
        )}
      </div>

      <DeleteBrewDialog
        brewId={brew.id}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  )
}
