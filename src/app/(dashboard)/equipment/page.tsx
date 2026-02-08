import Link from "next/link"
import { Plus, Cog, Coffee, CircleDot } from "lucide-react"

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

  const grinders = equipment.filter((e) => e.type === "grinder").length
  const brewers = equipment.filter((e) => e.type === "brewer" || e.type === "espresso_machine").length

  return (
    <div className="space-y-8">
      {/* Hero Stats */}
      {equipment.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            icon={Cog}
            label="Total equipos"
            value={equipment.length.toString()}
          />
          <StatCard
            icon={CircleDot}
            label="Molinos"
            value={grinders.toString()}
          />
          <StatCard
            icon={Coffee}
            label="Cafeteras"
            value={brewers.toString()}
          />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Mi Equipamiento</h1>
          <p className="text-muted-foreground">
            {equipment.length} {equipment.length === 1 ? "equipo" : "equipos"} en tu coleccion
          </p>
        </div>

        <Link href="/equipment/new" className="hidden sm:block">
          <Button size="lg" className="rounded-xl">
            <Plus className="mr-2 h-5 w-5" />
            Agregar equipo
          </Button>
        </Link>
      </div>

      {/* Equipment list */}
      {equipment.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-10">
          {groupedEquipment.map((group) => (
            <div key={group.type}>
              <h2 className="text-lg font-semibold mb-4">{group.label}</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((eq) => (
                  <EquipmentCard key={eq.id} equipment={eq} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mobile FAB */}
      <Link
        href="/equipment/new"
        className="fixed bottom-6 right-6 sm:hidden z-50"
      >
        <Button size="lg" className="h-14 w-14 rounded-full shadow-lg">
          <Plus className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-card border p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {label}
          </p>
          <p className="text-2xl sm:text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-2 rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-6 rounded-full bg-primary/10 mb-6">
        <Cog className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        Sin equipos
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Agrega tu primer equipo para comenzar a registrar tu setup de cafe
      </p>
      <Link href="/equipment/new">
        <Button size="lg" className="rounded-xl">
          <Plus className="mr-2 h-5 w-5" />
          Agregar equipo
        </Button>
      </Link>
    </div>
  )
}
