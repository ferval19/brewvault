import Link from "next/link"
import { Plus, Coffee } from "lucide-react"

import { Button } from "@/components/ui/button"

import { getBeans, type Bean } from "./actions"
import { BeanCard } from "./bean-card"
import { BeanFilters } from "./bean-filters"

export const metadata = {
  title: "Mis Cafes",
}

export default async function BeansPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const result = await getBeans()

  if (!result.success) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Error al cargar los cafes</p>
      </div>
    )
  }

  const beans = result.data
  const statusFilter = params.status || "all"

  const filteredBeans =
    statusFilter === "all"
      ? beans
      : beans.filter((bean) => bean.status === statusFilter)

  const activeCount = beans.filter((b) => b.status === "active").length
  const finishedCount = beans.filter((b) => b.status === "finished").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mis Cafes</h1>
          <p className="text-muted-foreground">
            {activeCount} activos · {finishedCount} agotados
          </p>
        </div>
        <Link href="/beans/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo cafe
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <BeanFilters currentStatus={statusFilter} />

      {/* Bean Grid */}
      {filteredBeans.length === 0 ? (
        <EmptyState hasAnyBeans={beans.length > 0} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBeans.map((bean) => (
            <BeanCard key={bean.id} bean={bean} />
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState({ hasAnyBeans }: { hasAnyBeans: boolean }) {
  if (hasAnyBeans) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Coffee className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium mb-2">
          No hay cafes con este filtro
        </h3>
        <p className="text-muted-foreground mb-4">
          Prueba cambiando el filtro de estado
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Coffee className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-medium mb-2">
        Tu boveda esta vacia
      </h3>
      <p className="text-muted-foreground mb-4">
        Empieza agregando tu primer cafe
      </p>
      <Link href="/beans/new">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agregar primer cafe
        </Button>
      </Link>
    </div>
  )
}
