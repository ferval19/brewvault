import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Pencil, MapPin, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Link
            href="/roasters"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Volver a tostadores
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold">{roaster.name}</h1>
          {location && (
            <p className="text-muted-foreground flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {location}
            </p>
          )}
        </div>
        <Link href={`/roasters/${id}/edit`}>
          <Button variant="outline">
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </Link>
      </div>

      {/* Rating */}
      {roaster.rating && (
        <div className="flex items-center gap-2">
          <span className="text-amber-500 text-xl">
            {"★".repeat(roaster.rating)}{"☆".repeat(5 - roaster.rating)}
          </span>
        </div>
      )}

      {/* Website */}
      {roaster.website && (
        <a
          href={roaster.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          <Globe className="h-4 w-4" />
          {roaster.website}
        </a>
      )}

      {/* Notes */}
      {roaster.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{roaster.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
