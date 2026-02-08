import { WaterRecipeForm } from "@/components/forms/water-recipe-form"

export const metadata = {
  title: "Nueva Receta de Agua",
}

export default function NewWaterRecipePage() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Nueva Receta de Agua</h1>
        <p className="text-muted-foreground">
          Crea una receta de agua para tus preparaciones
        </p>
      </div>

      <WaterRecipeForm />
    </div>
  )
}
