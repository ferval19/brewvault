import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Pencil, ClipboardList, Star } from "lucide-react"

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

  const scoreColor = note.total_score
    ? note.total_score >= 85
      ? "bg-green-500/90"
      : note.total_score >= 75
      ? "bg-amber-500/90"
      : "bg-orange-500/90"
    : "bg-gray-500/90"

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400/20 to-orange-500/20">
        <div className="relative aspect-[21/9] sm:aspect-[3/1] flex items-center justify-center">
          <ClipboardList className="h-24 w-24 text-amber-600 opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <Link
              href="/cupping"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm text-sm font-medium hover:bg-white dark:hover:bg-black/80 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
            <Link href={`/cupping/${id}/edit`}>
              <Button variant="secondary" size="sm" className="rounded-full backdrop-blur-sm">
                <Pencil className="mr-1.5 h-4 w-4" />
                Editar
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {methodLabel && (
                <span className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm text-sm font-medium">
                  {methodLabel}
                </span>
              )}
              {brewDate && (
                <span className="px-3 py-1.5 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm text-sm">
                  {brewDate}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                {beanName}
              </h1>
              {roasterName && (
                <p className="text-white/80 drop-shadow">
                  {roasterName}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Total Score */}
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-sm text-muted-foreground mb-2">Puntuacion total</p>
        <div className={`inline-flex items-center justify-center px-8 py-4 rounded-2xl ${scoreColor}`}>
          <p className="text-5xl sm:text-6xl font-bold text-white">{note.total_score ?? 0}</p>
          <span className="text-2xl text-white/80 ml-2">/100</span>
        </div>
      </div>

      {/* SCA scores */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5" />
            Puntuaciones SCA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {scores.map((score) => (
              <div key={score.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{score.label}</span>
                  <span className="font-medium">{score.value ?? "-"}/10</span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
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
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Descriptores de sabor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {note.flavor_descriptors.map((descriptor) => (
                <Badge key={descriptor} variant="secondary" className="rounded-full px-4 py-1.5">
                  {descriptor}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Brew info */}
      {note.brews && (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Preparacion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {methodLabel && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Metodo</span>
                <span className="font-medium">{methodLabel}</span>
              </div>
            )}
            {brewDate && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Fecha</span>
                <span className="font-medium">{brewDate}</span>
              </div>
            )}
            {note.brews.rating && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Valoracion</span>
                <span className="font-medium text-amber-500">
                  {"★".repeat(note.brews.rating)}{"☆".repeat(5 - note.brews.rating)}
                </span>
              </div>
            )}
            <div className="pt-3 border-t">
              <Link href={`/brews/${note.brews.id}`}>
                <Button variant="outline" className="rounded-xl">
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
