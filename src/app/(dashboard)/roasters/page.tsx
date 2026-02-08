import Link from "next/link"
import { Plus, Factory } from "lucide-react"

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Tostadores</h1>
          <p className="text-muted-foreground">
            {roasters.length} {roasters.length === 1 ? "tostador" : "tostadores"}
          </p>
        </div>
        <Link href="/roasters/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo tostador
          </Button>
        </Link>
      </div>

      {/* Roasters Grid */}
      {roasters.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roasters.map((roaster) => (
            <RoasterCard key={roaster.id} roaster={roaster} />
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Factory className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-medium mb-2">
        Sin tostadores
      </h3>
      <p className="text-muted-foreground mb-4">
        Agrega tus tostadores favoritos
      </p>
      <Link href="/roasters/new">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agregar tostador
        </Button>
      </Link>
    </div>
  )
}
