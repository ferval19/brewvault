import Link from "next/link"
import { Plus, Cog } from "lucide-react"

import { Button } from "@/components/ui/button"

import { getEquipmentList } from "./actions"
import { EquipmentCard } from "./equipment-card"
import { equipmentTypes } from "@/lib/validations/equipment"

export const metadata = {
  title: "Mi Equipamiento",
}

export default async function EquipmentPage() {
  const result = await getEquipmentList()

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{result.error}</p>
      </div>
    )
  }

  const equipment = result.data

  // Group equipment by type
  const groupedEquipment = equipmentTypes.reduce((acc, type) => {
    const items = equipment.filter((e) => e.type === type.value)
    if (items.length > 0) {
      acc.push({ type: type.value, label: type.label, items })
    }
    return acc
  }, [] as { type: string; label: string; items: typeof equipment }[])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Mi Equipamiento</h1>
          <p className="text-muted-foreground">
            {equipment.length} {equipment.length === 1 ? "equipo" : "equipos"} en tu coleccion
          </p>
        </div>

        <Link href="/equipment/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Agregar equipo
          </Button>
        </Link>
      </div>

      {/* Equipment list */}
      {equipment.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <Cog className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">Sin equipos</h3>
          <p className="text-muted-foreground mt-2">
            Agrega tu primer equipo para comenzar
          </p>
          <Link href="/equipment/new">
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Agregar equipo
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedEquipment.map((group) => (
            <div key={group.type}>
              <h2 className="text-lg font-semibold mb-4">{group.label}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((eq) => (
                  <EquipmentCard key={eq.id} equipment={eq} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
