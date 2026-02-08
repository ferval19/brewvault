"use client"

import { useState, useEffect, useTransition } from "react"
import { Bell, AlertTriangle, Wrench, ShoppingCart, Loader2 } from "lucide-react"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import {
  getNotificationPreferences,
  updateNotificationPreferences,
  savePushSubscription,
  removePushSubscription,
  type NotificationPreferences,
} from "./actions"
import {
  registerServiceWorker,
  subscribeToPush,
  unsubscribeFromPush,
  isPushSupported,
} from "@/lib/push-notifications"

export function NotificationSettings() {
  const [isPending, startTransition] = useTransition()
  const [pushEnabled, setPushEnabled] = useState(false)
  const [lowStockAlerts, setLowStockAlerts] = useState(true)
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(true)
  const [reorderSuggestions, setReorderSuggestions] = useState(false)
  const [pushSupported, setPushSupported] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadPreferences() {
      setPushSupported(typeof window !== "undefined" && isPushSupported())

      const result = await getNotificationPreferences()
      if (result.success) {
        setPushEnabled(result.data.push_enabled)
        setLowStockAlerts(result.data.low_stock_alerts)
        setMaintenanceAlerts(result.data.maintenance_alerts)
        setReorderSuggestions(result.data.reorder_suggestions)
      }
      setIsLoading(false)
    }
    loadPreferences()
  }, [])

  async function savePreferences(prefs: NotificationPreferences) {
    startTransition(async () => {
      await updateNotificationPreferences(prefs)
    })
  }

  async function handleEnablePush() {
    if (!("Notification" in window)) {
      setPushSupported(false)
      return
    }

    const permission = await Notification.requestPermission()
    if (permission === "granted") {
      const registration = await registerServiceWorker()
      if (registration) {
        const subscription = await subscribeToPush(registration)
        if (subscription) {
          await savePushSubscription(subscription.toJSON())
          setPushEnabled(true)
          savePreferences({
            push_enabled: true,
            low_stock_alerts: lowStockAlerts,
            maintenance_alerts: maintenanceAlerts,
            reorder_suggestions: reorderSuggestions,
          })
        }
      }
    }
  }

  async function handleDisablePush() {
    await unsubscribeFromPush()
    await removePushSubscription()
    setPushEnabled(false)
    savePreferences({
      push_enabled: false,
      low_stock_alerts: lowStockAlerts,
      maintenance_alerts: maintenanceAlerts,
      reorder_suggestions: reorderSuggestions,
    })
  }

  function handleLowStockChange(checked: boolean) {
    setLowStockAlerts(checked)
    savePreferences({
      push_enabled: pushEnabled,
      low_stock_alerts: checked,
      maintenance_alerts: maintenanceAlerts,
      reorder_suggestions: reorderSuggestions,
    })
  }

  function handleMaintenanceChange(checked: boolean) {
    setMaintenanceAlerts(checked)
    savePreferences({
      push_enabled: pushEnabled,
      low_stock_alerts: lowStockAlerts,
      maintenance_alerts: checked,
      reorder_suggestions: reorderSuggestions,
    })
  }

  function handleReorderChange(checked: boolean) {
    setReorderSuggestions(checked)
    savePreferences({
      push_enabled: pushEnabled,
      low_stock_alerts: lowStockAlerts,
      maintenance_alerts: maintenanceAlerts,
      reorder_suggestions: checked,
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Push Notifications */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <Label htmlFor="push" className="text-base font-medium">
              Notificaciones push
            </Label>
            <p className="text-sm text-muted-foreground">
              Recibe alertas en tu dispositivo
            </p>
          </div>
        </div>
        {pushEnabled ? (
          <Switch
            id="push"
            checked={pushEnabled}
            onCheckedChange={handleDisablePush}
            disabled={isPending}
          />
        ) : (
          <Button size="sm" onClick={handleEnablePush} disabled={!pushSupported || isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Activar"}
          </Button>
        )}
      </div>

      {!pushSupported && (
        <p className="text-sm text-muted-foreground">
          Tu navegador no soporta notificaciones push
        </p>
      )}

      <div className="border-t pt-6 space-y-5">
        <p className="text-sm font-medium text-muted-foreground">
          Tipos de alertas
        </p>

        {/* Low Stock Alerts */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <Label htmlFor="lowStock" className="text-sm font-medium">
                Stock bajo
              </Label>
              <p className="text-sm text-muted-foreground">
                Cuando un cafe este por agotarse
              </p>
            </div>
          </div>
          <Switch
            id="lowStock"
            checked={lowStockAlerts}
            onCheckedChange={handleLowStockChange}
            disabled={isPending}
          />
        </div>

        {/* Maintenance Alerts */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
              <Wrench className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <Label htmlFor="maintenance" className="text-sm font-medium">
                Mantenimiento
              </Label>
              <p className="text-sm text-muted-foreground">
                Recordatorios de limpieza de equipos
              </p>
            </div>
          </div>
          <Switch
            id="maintenance"
            checked={maintenanceAlerts}
            onCheckedChange={handleMaintenanceChange}
            disabled={isPending}
          />
        </div>

        {/* Reorder Suggestions */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <Label htmlFor="reorder" className="text-sm font-medium">
                Sugerencias de compra
              </Label>
              <p className="text-sm text-muted-foreground">
                Recomendaciones basadas en tu consumo
              </p>
            </div>
          </div>
          <Switch
            id="reorder"
            checked={reorderSuggestions}
            onCheckedChange={handleReorderChange}
            disabled={isPending}
          />
        </div>
      </div>
    </div>
  )
}
