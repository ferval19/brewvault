import Link from "next/link"
import { Bell, CheckCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AlertCard } from "@/components/alerts/alert-card"
import { getAlerts, markAllAlertsAsRead } from "./actions"
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

  return (
    <div className="space-y-6">
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
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <Bell className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">Sin alertas</h3>
          <p className="text-muted-foreground mt-2">
            Las alertas apareceran aqui cuando haya algo importante
          </p>
        </div>
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
