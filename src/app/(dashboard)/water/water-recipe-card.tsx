"use client"

import Link from "next/link"
import { Droplets, Pencil } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import type { WaterRecipe } from "./actions"
import { DeleteWaterRecipeDialog } from "./delete-water-recipe-dialog"

interface WaterRecipeCardProps {
  recipe: WaterRecipe
}

export function WaterRecipeCard({ recipe }: WaterRecipeCardProps) {
  const stats = [
    recipe.tds && { label: "TDS", value: `${recipe.tds} ppm` },
    recipe.ph && { label: "pH", value: recipe.ph },
    recipe.gh && { label: "GH", value: recipe.gh },
    recipe.kh && { label: "KH", value: recipe.kh },
  ].filter(Boolean) as { label: string; value: string | number }[]

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
            <Droplets className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  href={`/water/${recipe.id}`}
                  className="font-medium hover:underline block truncate"
                >
                  {recipe.name}
                </Link>
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href={`/water/${recipe.id}/edit`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                <DeleteWaterRecipeDialog
                  recipeId={recipe.id}
                  recipeName={recipe.name}
                />
              </div>
            </div>

            {stats.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {stats.map((stat) => (
                  <Badge key={stat.label} variant="secondary" className="text-xs">
                    {stat.label}: {stat.value}
                  </Badge>
                ))}
              </div>
            )}

            {recipe.notes && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {recipe.notes}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
