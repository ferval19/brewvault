import { EquipmentForm } from "@/components/forms/equipment-form"

export const metadata = {
  title: "Nuevo Equipo",
}

export default function NewEquipmentPage() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Nuevo Equipo</h1>
        <p className="text-muted-foreground">
          Agrega un equipo a tu coleccion
        </p>
      </div>

      <EquipmentForm />
    </div>
  )
}
