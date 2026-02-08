import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Pencil, MapPin, Mountain, Calendar, Scale } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { getBean } from "../actions"

const roastLevelLabels: Record<string, string> = {
  light: "Claro",
  "medium-light": "Medio-Claro",
  medium: "Medio",
  "medium-dark": "Medio-Oscuro",
  dark: "Oscuro",
}

const statusLabels: Record<string, string> = {
  active: "Activo",
  finished: "Agotado",
  archived: "Archivado",
}

export default async function BeanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getBean(id)

  if (!result.success || !result.data) {
    notFound()
  }

  const bean = result.data

  const stockPercentage =
    bean.weight_grams && bean.current_weight_grams
      ? Math.round((bean.current_weight_grams / bean.weight_grams) * 100)
      : null

  const daysFromRoast = bean.roast_date
    ? Math.floor(
        (Date.now() - new Date(bean.roast_date).getTime()) / (1000 * 60 * 60 * 24)
      )
    : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Link
            href="/beans"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Volver a granos
          </Link>
          <h1 className="text-3xl font-bold">{bean.name}</h1>
          <p className="text-muted-foreground">
            {bean.roasters?.name || "Sin tostador"}
          </p>
        </div>
        <Link href={`/beans/${id}/edit`}>
          <Button variant="outline">
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </Link>
      </div>

      {/* Status and rating */}
      <div className="flex flex-wrap gap-3">
        <Badge variant="secondary">{statusLabels[bean.status]}</Badge>
        {bean.roast_level && (
          <Badge variant="outline">
            {roastLevelLabels[bean.roast_level] || bean.roast_level}
          </Badge>
        )}
        {bean.personal_rating && (
          <Badge variant="outline" className="text-amber-500">
            {"★".repeat(bean.personal_rating)}
            {"☆".repeat(5 - bean.personal_rating)}
          </Badge>
        )}
        {bean.sca_score && (
          <Badge variant="outline">SCA: {bean.sca_score}</Badge>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Origin */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Origen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {bean.origin_country && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  {bean.origin_country}
                  {bean.origin_region && `, ${bean.origin_region}`}
                </span>
              </div>
            )}
            {bean.farm && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Finca:</span>
                <span>{bean.farm}</span>
              </div>
            )}
            {bean.altitude && (
              <div className="flex items-center gap-2">
                <Mountain className="h-4 w-4 text-muted-foreground" />
                <span>{bean.altitude} msnm</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Characteristics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Caracteristicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {bean.variety && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Variedad:</span>
                <span>{bean.variety}</span>
              </div>
            )}
            {bean.process && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Proceso:</span>
                <span>{bean.process}</span>
              </div>
            )}
            {bean.roast_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Tostado el {new Date(bean.roast_date).toLocaleDateString("es-ES")}
                  {daysFromRoast !== null && ` (hace ${daysFromRoast} dias)`}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inventory */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inventario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {bean.weight_grams && (
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-muted-foreground" />
                <span>
                  {bean.current_weight_grams || 0}g de {bean.weight_grams}g
                </span>
              </div>
            )}
            {stockPercentage !== null && (
              <div className="space-y-1">
                <div className="h-3 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all"
                    style={{ width: `${stockPercentage}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {stockPercentage}% restante
                </p>
              </div>
            )}
            {bean.price && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Precio:</span>
                <span>
                  {bean.price} {bean.currency || "EUR"}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Flavor notes */}
        {bean.flavor_notes && bean.flavor_notes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notas de sabor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {bean.flavor_notes.map((note: string) => (
                  <Badge key={note} variant="secondary">
                    {note}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
