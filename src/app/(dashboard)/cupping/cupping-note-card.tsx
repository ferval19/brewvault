"use client"

import Link from "next/link"
import { ClipboardList, Pencil } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { brewMethods } from "@/lib/validations/brews"
import type { CuppingNote } from "./actions"
import { DeleteCuppingNoteDialog } from "./delete-cupping-note-dialog"

interface CuppingNoteCardProps {
  note: CuppingNote
}

export function CuppingNoteCard({ note }: CuppingNoteCardProps) {
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

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
            <ClipboardList className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  href={`/cupping/${note.id}`}
                  className="font-medium hover:underline block truncate"
                >
                  {beanName}
                </Link>
                {roasterName && (
                  <p className="text-xs text-muted-foreground truncate">{roasterName}</p>
                )}
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href={`/cupping/${note.id}/edit`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                <DeleteCuppingNoteDialog
                  noteId={note.id}
                  beanName={beanName}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              {note.total_score != null && (
                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-100">
                  {note.total_score}/100
                </Badge>
              )}
              {methodLabel && (
                <Badge variant="secondary" className="text-xs">
                  {methodLabel}
                </Badge>
              )}
              {brewDate && (
                <span className="text-xs text-muted-foreground">{brewDate}</span>
              )}
            </div>

            {note.flavor_descriptors && note.flavor_descriptors.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {note.flavor_descriptors.slice(0, 4).map((descriptor) => (
                  <Badge key={descriptor} variant="outline" className="text-xs">
                    {descriptor}
                  </Badge>
                ))}
                {note.flavor_descriptors.length > 4 && (
                  <span className="text-xs text-muted-foreground">
                    +{note.flavor_descriptors.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
