"use client"

import Link from "next/link"
import { useState } from "react"
import { MoreHorizontal, Pencil, Trash2, Eye, Clock, Droplets, Scale } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { DeleteBrewDialog } from "./delete-brew-dialog"
import { brewMethods } from "@/lib/validations/brews"
import type { Brew } from "./actions"

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

  const methodLabel = brewMethods.find((m) => m.value === brew.brew_method)?.label || brew.brew_method

  return (
    <>
      <Card className="group relative overflow-hidden hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {methodLabel}
                </Badge>
                {brew.rating && (
                  <span className="text-amber-500 text-sm">
                    {"★".repeat(brew.rating)}
                  </span>
                )}
              </div>
              <CardTitle className="text-base leading-tight">
                <Link
                  href={`/brews/${brew.id}`}
                  className="hover:underline"
                >
                  {brew.beans?.name || "Cafe desconocido"}
                </Link>
              </CardTitle>
              <CardDescription className="text-xs">
                {brew.beans?.roasters?.name || "Sin tostador"}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
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
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Brew params */}
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Scale className="h-3.5 w-3.5" />
              <span>{brew.dose_grams}g</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Droplets className="h-3.5 w-3.5" />
              <span>{brew.water_grams}g</span>
            </div>
            {brew.total_time_seconds && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{formatTime(brew.total_time_seconds)}</span>
              </div>
            )}
          </div>

          {/* Ratio */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Ratio</span>
            <span className="font-medium">
              1:{brew.ratio?.toFixed(1) || (brew.water_grams / brew.dose_grams).toFixed(1)}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span>{formatDate(brew.brewed_at)}</span>
            {brew.water_temperature && (
              <span>{brew.water_temperature}°C</span>
            )}
          </div>
        </CardContent>
      </Card>

      <DeleteBrewDialog
        brewId={brew.id}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  )
}
