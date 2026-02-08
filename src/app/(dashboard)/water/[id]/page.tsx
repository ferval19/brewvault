import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Pencil, Droplets } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { getWaterRecipe } from "../actions"

export default async function WaterRecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getWaterRecipe(id)

  if (!result.success || !result.data) {
    notFound()
  }

  const recipe = result.data

  const mineralStats = [
    { label: "GH (Dureza general)", value: recipe.gh, unit: "ppm" },
    { label: "KH (Dureza carbonatos)", value: recipe.kh, unit: "ppm" },
    { label: "Calcio (Ca)", value: recipe.calcium, unit: "ppm" },
    { label: "Magnesio (Mg)", value: recipe.magnesium, unit: "ppm" },
    { label: "TDS", value: recipe.tds, unit: "ppm" },
    { label: "pH", value: recipe.ph, unit: "" },
  ].filter((stat) => stat.value !== null)

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Link
            href="/water"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Volver a recetas de agua
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold">{recipe.name}</h1>
        </div>
        <Link href={`/water/${id}/edit`}>
          <Button variant="outline">
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </Link>
      </div>

      {/* Composicion mineral */}
      {mineralStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              Composicion mineral
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mineralStats.map((stat) => (
              <div key={stat.label} className="flex justify-between">
                <span className="text-muted-foreground">{stat.label}</span>
                <span className="font-medium">
                  {stat.value} {stat.unit}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Notas */}
      {recipe.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{recipe.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
