import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Pencil, ClipboardList } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { getCuppingNote } from "../actions"
import { scaCategories } from "@/lib/validations/cupping-notes"
import { brewMethods } from "@/lib/validations/brews"

export default async function CuppingNoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getCuppingNote(id)

  if (!result.success || !result.data) {
    notFound()
  }

  const note = result.data
  const beanName = note.brews?.beans?.name || "Sin cafe"
  const roasterName = note.brews?.beans?.roasters?.name
  const methodLabel = brewMethods.find((m) => m.value === note.brews?.brew_method)?.label || note.brews?.brew_method
  const brewDate = note.brews?.brewed_at
    ? new Date(note.brews.brewed_at).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null

  const scores = scaCategories.map((category) => ({
    label: category.label,
    value: note[category.key as keyof typeof note] as number | null,
  }))

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Link
            href="/cupping"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Volver a notas de cata
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold">{beanName}</h1>
          {roasterName && (
            <p className="text-muted-foreground">{roasterName}</p>
          )}
        </div>
        <Link href={`/cupping/${id}/edit`}>
          <Button variant="outline">
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </Link>
      </div>

      {/* Total score */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Puntuacion total</p>
            <p className="text-5xl font-bold">{note.total_score ?? 0}</p>
            <p className="text-muted-foreground">/100</p>
          </div>
        </CardContent>
      </Card>

      {/* SCA scores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Puntuaciones SCA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {scores.map((score) => (
              <div key={score.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{score.label}</span>
                  <span className="font-medium">{score.value ?? "-"}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${((score.value ?? 0) / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Flavor descriptors */}
      {note.flavor_descriptors && note.flavor_descriptors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Descriptores de sabor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {note.flavor_descriptors.map((descriptor) => (
                <Badge key={descriptor} variant="secondary">
                  {descriptor}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Brew info */}
      {note.brews && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preparacion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {methodLabel && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Metodo</span>
                <span className="font-medium">{methodLabel}</span>
              </div>
            )}
            {brewDate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fecha</span>
                <span className="font-medium">{brewDate}</span>
              </div>
            )}
            {note.brews.rating && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valoracion</span>
                <span className="font-medium text-amber-500">
                  {"★".repeat(note.brews.rating)}{"☆".repeat(5 - note.brews.rating)}
                </span>
              </div>
            )}
            <div className="pt-2">
              <Link href={`/brews/${note.brews.id}`}>
                <Button variant="outline" size="sm">
                  Ver preparacion
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
