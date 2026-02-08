import Link from "next/link"
import { Plus, Flame } from "lucide-react"

import { Button } from "@/components/ui/button"

import { getBrews } from "./actions"
import { BrewCard } from "./brew-card"

export const metadata = {
  title: "Mis Preparaciones",
}

export default async function BrewsPage() {
  const result = await getBrews()

  if (!result.success) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Error al cargar las preparaciones</p>
      </div>
    )
  }

  const brews = result.data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Mis Preparaciones</h1>
          <p className="text-muted-foreground">
            {brews.length} {brews.length === 1 ? "preparacion" : "preparaciones"}
          </p>
        </div>
        <Link href="/brews/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva preparacion
          </Button>
        </Link>
      </div>

      {/* Brews Grid */}
      {brews.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brews.map((brew) => (
            <BrewCard key={brew.id} brew={brew} />
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Flame className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-medium mb-2">
        Sin preparaciones
      </h3>
      <p className="text-muted-foreground mb-4">
        Registra tu primera extraccion de cafe
      </p>
      <Link href="/brews/new">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva preparacion
        </Button>
      </Link>
    </div>
  )
}
