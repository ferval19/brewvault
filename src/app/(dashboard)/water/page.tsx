import Link from "next/link"
import { Plus, Droplets } from "lucide-react"

import { Button } from "@/components/ui/button"

import { getWaterRecipes } from "./actions"
import { WaterRecipeCard } from "./water-recipe-card"

export const metadata = {
  title: "Recetas de Agua",
}

export default async function WaterPage() {
  const result = await getWaterRecipes()

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{result.error}</p>
      </div>
    )
  }

  const recipes = result.data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Recetas de Agua</h1>
          <p className="text-muted-foreground">
            {recipes.length} {recipes.length === 1 ? "receta" : "recetas"} guardadas
          </p>
        </div>

        <Link href="/water/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva receta
          </Button>
        </Link>
      </div>

      {/* Recipes list */}
      {recipes.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <Droplets className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">Sin recetas de agua</h3>
          <p className="text-muted-foreground mt-2">
            Crea tu primera receta de agua para comenzar
          </p>
          <Link href="/water/new">
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Nueva receta
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <WaterRecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}
