import { Bell, AlertTriangle, Wrench } from "lucide-react"

import { AlertCard } from "@/components/alerts/alert-card"
import { getAlerts } from "./actions"
import { MarkAllReadButton } from "./mark-all-read-button"

export const metadata = {
  title: "Alertas",
}

export default async function AlertsPage() {
  const result = await getAlerts({ includeRead: true })

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{result.error}</p>
      </div>
    )
  }

  const alerts = result.data
  const unreadCount = alerts.filter((a) => !a.is_read).length
  const lowStockCount = alerts.filter((a) => a.type === "low_stock" && !a.is_dismissed).length
  const maintenanceCount = alerts.filter((a) => a.type === "maintenance" && !a.is_dismissed).length

  return (
    <div className="space-y-8">
      {/* Hero Stats */}
      {alerts.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            icon={Bell}
            label="Sin leer"
            value={unreadCount.toString()}
            variant={unreadCount > 0 ? "warning" : "default"}
          />
          <StatCard
            icon={AlertTriangle}
            label="Stock bajo"
            value={lowStockCount.toString()}
            variant={lowStockCount > 0 ? "warning" : "default"}
          />
          <StatCard
            icon={Wrench}
            label="Mantenimiento"
            value={maintenanceCount.toString()}
          />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Alertas</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0
              ? `${unreadCount} ${unreadCount === 1 ? "alerta sin leer" : "alertas sin leer"}`
              : "Todas las alertas leidas"
            }
          </p>
        </div>

        {unreadCount > 0 && <MarkAllReadButton />}
      </div>

      {/* Alerts list */}
      {alerts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  variant = "default",
}: {
  icon: React.ElementType
  label: string
  value: string
  variant?: "default" | "warning"
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl glass-panel p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {label}
          </p>
          <p className="text-2xl sm:text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded-xl ${variant === "warning" ? "bg-amber-500/10" : "bg-primary/10"}`}>
          <Icon className={`h-5 w-5 ${variant === "warning" ? "text-amber-500" : "text-primary"}`} />
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-6 rounded-full bg-primary/10 mb-6">
        <Bell className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        Sin alertas
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Las alertas apareceran aqui cuando haya algo importante que revisar
      </p>
    </div>
  )
}
