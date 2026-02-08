import { notFound } from "next/navigation"
import { BrewForm } from "@/components/forms/brew-form"
import { getBrew, getActiveBeans, getEquipment } from "../../actions"

export const metadata = {
  title: "Editar Preparacion",
}

export default async function EditBrewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [brewResult, beansResult, equipmentResult] = await Promise.all([
    getBrew(id),
    getActiveBeans(),
    getEquipment(),
  ])

  if (!brewResult.success || !brewResult.data) {
    notFound()
  }

  const beans = beansResult.success ? beansResult.data : []
  const equipment = equipmentResult.success ? equipmentResult.data : []

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Editar Preparacion</h1>
        <p className="text-muted-foreground">
          Modifica los parametros de la extraccion
        </p>
      </div>

      <BrewForm brew={brewResult.data} beans={beans} equipment={equipment} />
    </div>
  )
}
