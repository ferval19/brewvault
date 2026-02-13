"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, Wrench, ShoppingCart, Bell, X, Check, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import { dismissAlert, markAlertAsRead, markMaintenanceDone } from "@/app/(dashboard)/alerts/actions"
import type { AlertWithEntity } from "@/app/(dashboard)/alerts/actions"

interface AlertCardProps {
  alert: AlertWithEntity
  compact?: boolean
}

const alertIcons = {
  low_stock: AlertTriangle,
  maintenance: Wrench,
  reorder: ShoppingCart,
  custom: Bell,
}

const alertColors = {
  low_stock: "text-amber-500 bg-amber-50 dark:bg-amber-950/30",
  maintenance: "text-blue-500 bg-blue-50 dark:bg-blue-950/30",
  reorder: "text-green-500 bg-green-50 dark:bg-green-950/30",
  custom: "text-gray-500 bg-gray-50 dark:bg-gray-950/30",
}

const priorityColors = {
  low: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  normal: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  high: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
}

export function AlertCard({ alert, compact = false }: AlertCardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const Icon = alertIcons[alert.type]

  async function handleDismiss() {
    setIsLoading(true)
    await dismissAlert(alert.id)
    router.refresh()
  }

  async function handleMarkRead() {
    setIsLoading(true)
    await markAlertAsRead(alert.id)
    router.refresh()
  }

  async function handleMaintenanceDone() {
    if (alert.entity_id) {
      setIsLoading(true)
      await markMaintenanceDone(alert.entity_id)
      router.refresh()
    }
  }

  const timeAgo = getTimeAgo(new Date(alert.triggered_at))

  if (compact) {
    return (
      <div className={cn(
        "flex items-start gap-3 p-3 rounded-2xl transition-colors",
        !alert.is_read && "bg-muted/50"
      )}>
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          alertColors[alert.type]
        )}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-medium", !alert.is_read && "font-semibold")}>
            {alert.title}
          </p>
          {alert.message && (
            <p className="text-xs text-muted-foreground truncate">{alert.message}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 flex-shrink-0"
          onClick={handleDismiss}
          disabled={isLoading}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    )
  }

  return (
    <Card className={cn(!alert.is_read && "border-l-4 border-l-primary")}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
            alertColors[alert.type]
          )}>
            <Icon className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className={cn("font-medium", !alert.is_read && "font-semibold")}>
                  {alert.title}
                </p>
                {alert.message && (
                  <p className="text-sm text-muted-foreground mt-0.5">{alert.message}</p>
                )}
              </div>
              {alert.priority === "high" && (
                <Badge className={priorityColors.high}>Urgente</Badge>
              )}
            </div>

            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {timeAgo}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-3">
              {alert.type === "maintenance" && alert.entity_id && (
                <Button
                  size="sm"
                  onClick={handleMaintenanceDone}
                  disabled={isLoading}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Hecho
                </Button>
              )}
              {alert.type === "low_stock" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDismiss}
                  disabled={isLoading}
                >
                  Comprado
                </Button>
              )}
              {!alert.is_read && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleMarkRead}
                  disabled={isLoading}
                >
                  Marcar leida
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-1" />
                Descartar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Ahora"
  if (diffMins < 60) return `Hace ${diffMins} min`
  if (diffHours < 24) return `Hace ${diffHours}h`
  if (diffDays === 1) return "Ayer"
  if (diffDays < 7) return `Hace ${diffDays} dias`
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
}
