import Link from "next/link"
import { Plus, Factory, MapPin, Coffee } from "lucide-react"

import { Button } from "@/components/ui/button"

import { getRoasters } from "./actions"
import { RoasterCard } from "./roaster-card"

export const metadata = {
  title: "Tostadores",
}

export default async function RoastersPage() {
  const result = await getRoasters()

  if (!result.success) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Error al cargar los tostadores</p>
      </div>
    )
  }

  const roasters = result.data
  const totalBeans = roasters.reduce((acc, r) => acc + (r._count?.beans || 0), 0)
  const countries = [...new Set(roasters.filter(r => r.country).map(r => r.country))].length

  return (
    <div className="space-y-8">
      {/* Hero Stats */}
      {roasters.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            icon={Factory}
            label="Tostadores"
            value={roasters.length.toString()}
          />
          <StatCard
            icon={Coffee}
            label="Cafes"
            value={totalBeans.toString()}
          />
          <StatCard
            icon={MapPin}
            label="Paises"
            value={countries.toString()}
          />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Tostadores</h1>
          <p className="text-muted-foreground">
            {roasters.length} {roasters.length === 1 ? "tostador" : "tostadores"}
          </p>
        </div>
        <Link href="/roasters/new" className="hidden sm:block">
          <Button size="lg" className="rounded-xl">
            <Plus className="mr-2 h-5 w-5" />
            Nuevo tostador
          </Button>
        </Link>
      </div>

      {/* Roasters Grid */}
      {roasters.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roasters.map((roaster) => (
            <RoasterCard key={roaster.id} roaster={roaster} />
          ))}
        </div>
      )}

      {/* Mobile FAB */}
      <Link
        href="/roasters/new"
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
        <Factory className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        Sin tostadores
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Agrega tus tostadores favoritos para organizar tu coleccion de cafe
      </p>
      <Link href="/roasters/new">
        <Button size="lg" className="rounded-xl">
          <Plus className="mr-2 h-5 w-5" />
          Agregar tostador
        </Button>
      </Link>
    </div>
  )
}
