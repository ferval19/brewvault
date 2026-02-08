import { notFound } from "next/navigation"
import { EquipmentForm } from "@/components/forms/equipment-form"
import { getEquipment } from "../../actions"

export const metadata = {
  title: "Editar Equipo",
}

export default async function EditEquipmentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getEquipment(id)

  if (!result.success || !result.data) {
    notFound()
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Editar Equipo</h1>
        <p className="text-muted-foreground">
          Modifica la informacion del equipo
        </p>
      </div>

      <EquipmentForm equipment={result.data} />
    </div>
  )
}
