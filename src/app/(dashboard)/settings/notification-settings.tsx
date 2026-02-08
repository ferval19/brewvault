"use client"

import { useState } from "react"
import { Bell, AlertTriangle, Wrench, ShoppingCart } from "lucide-react"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function NotificationSettings() {
  const [pushEnabled, setPushEnabled] = useState(false)
  const [lowStockAlerts, setLowStockAlerts] = useState(true)
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(true)
  const [reorderSuggestions, setReorderSuggestions] = useState(false)
  const [pushSupported, setPushSupported] = useState(true)

  async function handleEnablePush() {
    if (!("Notification" in window)) {
      setPushSupported(false)
      return
    }

    const permission = await Notification.requestPermission()
    if (permission === "granted") {
      setPushEnabled(true)
      // TODO: Register service worker and save subscription
    }
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
            onCheckedChange={setPushEnabled}
          />
        ) : (
          <Button size="sm" onClick={handleEnablePush} disabled={!pushSupported}>
            Activar
          </Button>
        )}
      </div>

      {!pushSupported && (
        <p className="text-sm text-muted-foreground">
          Tu navegador no soporta notificaciones push
        </p>
      )}

      <div className="border-t pt-6 space-y-4">
        <p className="text-sm font-medium text-muted-foreground">
          Tipos de alertas
        </p>

        {/* Low Stock Alerts */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <Label htmlFor="lowStock" className="text-sm font-medium">
                Stock bajo
              </Label>
              <p className="text-xs text-muted-foreground">
                Cuando un cafe este por agotarse
              </p>
            </div>
          </div>
          <Switch
            id="lowStock"
            checked={lowStockAlerts}
            onCheckedChange={setLowStockAlerts}
          />
        </div>

        {/* Maintenance Alerts */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Wrench className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <Label htmlFor="maintenance" className="text-sm font-medium">
                Mantenimiento
              </Label>
              <p className="text-xs text-muted-foreground">
                Recordatorios de limpieza de equipos
              </p>
            </div>
          </div>
          <Switch
            id="maintenance"
            checked={maintenanceAlerts}
            onCheckedChange={setMaintenanceAlerts}
          />
        </div>

        {/* Reorder Suggestions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <Label htmlFor="reorder" className="text-sm font-medium">
                Sugerencias de compra
              </Label>
              <p className="text-xs text-muted-foreground">
                Recomendaciones basadas en tu consumo
              </p>
            </div>
          </div>
          <Switch
            id="reorder"
            checked={reorderSuggestions}
            onCheckedChange={setReorderSuggestions}
          />
        </div>
      </div>
    </div>
  )
}
