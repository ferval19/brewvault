import Link from "next/link"
import { LucideIcon, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  variant?: "default" | "filtered"
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  variant = "default",
}: EmptyStateProps) {
  const DefaultIcon = variant === "filtered" ? Search : Plus

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="p-4 rounded-2xl bg-white/35 dark:bg-white/[0.06] border border-white/25 dark:border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] mb-4">
        {Icon ? (
          <Icon className="h-10 w-10 text-muted-foreground" />
        ) : (
          <DefaultIcon className="h-10 w-10 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button className="rounded-2xl">
            <Plus className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  )
}

// Pre-configured empty states for common use cases
export function BeansEmptyState({ hasAny }: { hasAny: boolean }) {
  if (hasAny) {
    return (
      <EmptyState
        variant="filtered"
        title="Sin resultados"
        description="No hay cafés que coincidan con los filtros seleccionados."
      />
    )
  }

  return (
    <EmptyState
      title="Sin cafés"
      description="Anade tu primer cafe para empezar a registrar tus preparaciones."
      actionLabel="Anadir cafe"
      actionHref="/beans/new"
    />
  )
}

export function BrewsEmptyState({ hasAny }: { hasAny: boolean }) {
  if (hasAny) {
    return (
      <EmptyState
        variant="filtered"
        title="Sin resultados"
        description="No hay preparaciones que coincidan con los filtros seleccionados."
      />
    )
  }

  return (
    <EmptyState
      title="Sin preparaciones"
      description="Registra tu primera preparacion para empezar a llevar un seguimiento."
      actionLabel="Nueva preparacion"
      actionHref="/brews/new"
    />
  )
}

export function EquipmentEmptyState({ hasAny }: { hasAny: boolean }) {
  if (hasAny) {
    return (
      <EmptyState
        variant="filtered"
        title="Sin resultados"
        description="No hay equipos que coincidan con los filtros seleccionados."
      />
    )
  }

  return (
    <EmptyState
      title="Sin equipos"
      description="Anade tu cafetera, molino u otros equipos para registrar tu arsenal cafetero."
      actionLabel="Anadir equipo"
      actionHref="/equipment/new"
    />
  )
}

export function RoastersEmptyState({ hasAny }: { hasAny: boolean }) {
  if (hasAny) {
    return (
      <EmptyState
        variant="filtered"
        title="Sin resultados"
        description="No hay tostadores que coincidan con la busqueda."
      />
    )
  }

  return (
    <EmptyState
      title="Sin tostadores"
      description="Anade tus tostadores favoritos para organizar tu colección de cafés."
      actionLabel="Anadir tostador"
      actionHref="/roasters/new"
    />
  )
}

export function CuppingEmptyState({ hasAny }: { hasAny: boolean }) {
  if (hasAny) {
    return (
      <EmptyState
        variant="filtered"
        title="Sin resultados"
        description="No hay notas de cata que coincidan con los filtros."
      />
    )
  }

  return (
    <EmptyState
      title="Sin notas de cata"
      description="Registra tus primeras notas de cata SCA para evaluar tus cafés."
      actionLabel="Nueva cata"
      actionHref="/cupping/new"
    />
  )
}

export function AlertsEmptyState() {
  return (
    <EmptyState
      title="Sin alertas"
      description="No tienes alertas pendientes. Todo esta en orden."
    />
  )
}
