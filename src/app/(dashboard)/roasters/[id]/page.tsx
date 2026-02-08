import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Pencil, MapPin, Globe, Star, Coffee } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { getRoaster } from "../actions"

export default async function RoasterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getRoaster(id)

  if (!result.success || !result.data) {
    notFound()
  }

  const roaster = result.data
  const location = [roaster.city, roaster.country].filter(Boolean).join(", ")

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-600/20 to-amber-700/20">
        <div className="relative aspect-[21/9] sm:aspect-[3/1] flex items-center justify-center">
          <Coffee className="h-24 w-24 text-stone-600 opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <Link
              href="/roasters"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm text-sm font-medium hover:bg-white dark:hover:bg-black/80 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
            <Link href={`/roasters/${id}/edit`}>
              <Button variant="secondary" size="sm" className="rounded-full backdrop-blur-sm">
                <Pencil className="mr-1.5 h-4 w-4" />
                Editar
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {location && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  {location}
                </span>
              )}
              {roaster.rating && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/90 backdrop-blur-sm text-white text-sm font-medium">
                  <Star className="h-4 w-4 fill-current" />
                  {roaster.rating}/5
                </span>
              )}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                {roaster.name}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Website Link */}
      {roaster.website && (
        <a
          href={roaster.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 rounded-2xl bg-card border hover:bg-muted/50 transition-colors"
        >
          <div className="p-3 rounded-xl bg-primary/10">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium">Sitio web</p>
            <p className="text-sm text-muted-foreground truncate">{roaster.website}</p>
          </div>
        </a>
      )}

      {/* Notes */}
      {roaster.notes && (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {roaster.notes}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
