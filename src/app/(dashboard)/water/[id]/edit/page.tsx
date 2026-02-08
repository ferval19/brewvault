import { notFound } from "next/navigation"
import { WaterRecipeForm } from "@/components/forms/water-recipe-form"
import { getWaterRecipe } from "../../actions"

export const metadata = {
  title: "Editar Receta de Agua",
}

export default async function EditWaterRecipePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getWaterRecipe(id)

  if (!result.success || !result.data) {
    notFound()
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Editar Receta de Agua</h1>
        <p className="text-muted-foreground">
          Modifica la informacion de la receta
        </p>
      </div>

      <WaterRecipeForm recipe={result.data} />
    </div>
  )
}
