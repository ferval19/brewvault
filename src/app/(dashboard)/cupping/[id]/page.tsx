import Link from "next/link"
import { notFound } from "next/navigation"
import { ClipboardList, Star, Coffee } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  DetailPageHero,
  DetailBadge,
  DetailSection,
  DetailRow,
} from "@/components/ui/detail-page"

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
      <DetailPageHero
        title={beanName}
        subtitle={roasterName}
        backHref="/cupping"
        editHref={`/cupping/${id}/edit`}
        gradient="from-amber-400/20 to-orange-500/20"
        fallbackIcon={<ClipboardList className="h-24 w-24 text-amber-600 opacity-20" />}
        badges={
          <>
            {methodLabel && <DetailBadge>{methodLabel}</DetailBadge>}
            {brewDate && <DetailBadge>{brewDate}</DetailBadge>}
          </>
        }
      />

      {/* Total Score */}
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-sm text-muted-foreground mb-2">Puntuacion total</p>
        <div className={`inline-flex items-center justify-center px-8 py-4 rounded-2xl ${scoreColor}`}>
          <p className="text-5xl sm:text-6xl font-bold text-white">{note.total_score ?? 0}</p>
          <span className="text-2xl text-white/80 ml-2">/100</span>
        </div>
      </div>

      {/* SCA scores */}
      <DetailSection title="Puntuaciones SCA" icon={Star}>
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
      </DetailSection>

      {/* Flavor descriptors */}
      {note.flavor_descriptors && note.flavor_descriptors.length > 0 && (
        <DetailSection title="Descriptores de sabor">
          <div className="flex flex-wrap gap-2">
            {note.flavor_descriptors.map((descriptor) => (
              <Badge key={descriptor} variant="secondary" className="rounded-full px-4 py-1.5">
                {descriptor}
              </Badge>
            ))}
          </div>
        </DetailSection>
      )}

      {/* Brew info */}
      {note.brews && (
        <DetailSection title="Preparacion" icon={Coffee}>
          {methodLabel && <DetailRow label="Metodo" value={methodLabel} />}
          {brewDate && <DetailRow label="Fecha" value={brewDate} />}
          {note.brews.rating && (
            <DetailRow
              label="Valoracion"
              value={
                <span className="text-amber-500">
                  {"★".repeat(note.brews.rating)}{"☆".repeat(5 - note.brews.rating)}
                </span>
              }
            />
          )}
          <div className="pt-4 border-t mt-4">
            <Link href={`/brews/${note.brews.id}`}>
              <Button variant="outline" className="rounded-xl">
                Ver preparacion
              </Button>
            </Link>
          </div>
        </DetailSection>
      )}
    </div>
  )
}
