import Link from "next/link"
import { Bell } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCard } from "./alert-card"
import type { AlertWithEntity } from "@/app/(dashboard)/alerts/actions"

interface AlertsPanelProps {
  alerts: AlertWithEntity[]
  totalCount: number
}

export function AlertsPanel({ alerts, totalCount }: AlertsPanelProps) {
  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alertas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Sin alertas pendientes
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Alertas
          <span className="ml-1 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
            {totalCount}
          </span>
        </CardTitle>
        <Link href="/alerts">
          <Button variant="ghost" size="sm">
            Ver todas
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-2">
        {alerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} compact />
        ))}
      </CardContent>
    </Card>
  )
}
