"use client"

import Link from "next/link"
import { ClipboardList, Pencil, MoreHorizontal, Eye, Trash2 } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MetricPill } from "@/components/ui/metric-pill"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { brewMethods } from "@/lib/validations/brews"
import type { CuppingNote } from "./actions"
import { DeleteCuppingNoteDialog } from "./delete-cupping-note-dialog"

interface CuppingNoteCardProps {
  note: CuppingNote
}

export function CuppingNoteCard({ note }: CuppingNoteCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const beanName = note.brews?.beans?.name || "Sin cafe"
  const roasterName = note.brews?.beans?.roasters?.name
  const methodLabel = brewMethods.find((m) => m.value === note.brews?.brew_method)?.label || note.brews?.brew_method
  const brewDate = note.brews?.brewed_at
    ? new Date(note.brews.brewed_at).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null

  const scoreVariant = note.total_score
    ? note.total_score >= 85
      ? "success"
      : note.total_score >= 75
      ? "warning"
      : "default"
    : "muted" as const

  return (
    <>
      <Link href={`/cupping/${note.id}`} className="group block">
        <div className="relative overflow-hidden rounded-3xl glass-panel hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          {/* Header gradient */}
          <div className="relative aspect-[16/8] bg-gradient-to-br from-amber-400/20 to-orange-500/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <ClipboardList className="h-16 w-16 text-amber-600 opacity-30" />
            </div>

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Top bar */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              {brewDate && (
                <span className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm text-xs font-medium">
                  {brewDate}
                </span>
              )}
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
                    <Link href={`/cupping/${note.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalle
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/cupping/${note.id}/edit`}>
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

            {/* Bottom overlay with score */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              {methodLabel && (
                <MetricPill
                  value={methodLabel}
                  size="sm"
                  className="bg-white/90 dark:bg-black/60 backdrop-blur-sm"
                />
              )}
              {note.total_score != null && (
                <MetricPill
                  value={note.total_score}
                  label="/100"
                  size="sm"
                  variant={scoreVariant}
                  className="backdrop-blur-sm font-bold"
                />
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            <div>
              <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors">
                {beanName}
              </h3>
              {roasterName && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {roasterName}
                </p>
              )}
            </div>

            {note.flavor_descriptors && note.flavor_descriptors.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {note.flavor_descriptors.slice(0, 4).map((descriptor) => (
                  <Badge key={descriptor} variant="secondary" className="rounded-full text-xs">
                    {descriptor}
                  </Badge>
                ))}
                {note.flavor_descriptors.length > 4 && (
                  <span className="text-xs text-muted-foreground px-2 py-0.5">
                    +{note.flavor_descriptors.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>

      <DeleteCuppingNoteDialog
        noteId={note.id}
        beanName={beanName}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  )
}
