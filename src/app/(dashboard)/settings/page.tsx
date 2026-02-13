import Link from "next/link"
import Image from "next/image"
import { headers } from "next/headers"
import { User, Bell, Coffee, Flame, Cog, LogOut, Calendar, ChevronRight, QrCode } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { getUserProfile, getStats, getEquipmentForQR } from "./actions"
import { getUnreadAlertCount } from "@/app/(dashboard)/alerts/actions"
import { ProfileForm } from "./profile-form"
import { SignOutButton } from "./sign-out-button"
import { NotificationSettings } from "./notification-settings"
import { QuickBrewUrls } from "./quick-brew-urls"

export const metadata = {
  title: "Configuracion",
}

export default async function SettingsPage() {
  const headersList = await headers()
  const host = headersList.get("host") || "localhost:3000"
  const protocol = host.includes("localhost") ? "http" : "https"
  const baseUrl = `${protocol}://${host}`

  const [profileResult, statsResult, alertsResult, equipmentResult] = await Promise.all([
    getUserProfile(),
    getStats(),
    getUnreadAlertCount(),
    getEquipmentForQR(),
  ])

  if (!profileResult.success) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{profileResult.error}</p>
      </div>
    )
  }

  const profile = profileResult.data
  const stats = statsResult.success ? statsResult.data : null
  const alertCount = alertsResult.success ? alertsResult.data : 0
  const equipment = equipmentResult.success ? equipmentResult.data : []

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Configuracion</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona tu perfil y preferencias
        </p>
      </div>

      {/* Stats Hero */}
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <div className="relative overflow-hidden rounded-3xl glass-panel p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Cafés
                </p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.totalBeans}</p>
              </div>
              <div className="p-2 rounded-xl bg-amber-500/10">
                <Coffee className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl glass-panel p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Preparaciones
                </p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.totalBrews}</p>
              </div>
              <div className="p-2 rounded-xl bg-orange-500/10">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl glass-panel p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Equipos
                </p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.totalEquipment}</p>
              </div>
              <div className="p-2 rounded-xl bg-gray-500/10">
                <Cog className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile */}
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-4">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.full_name || "Avatar"}
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <User className="h-6 w-6 text-blue-500" />
              </div>
            )}
            <div className="space-y-1">
              <CardTitle className="text-lg">Perfil</CardTitle>
              <CardDescription>
                Tu informacion de cuenta
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>

      {/* Alerts */}
      <Link href="/alerts">
        <Card className="rounded-2xl hover:bg-muted/50 transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-amber-500/10 relative">
                <Bell className="h-5 w-5 text-amber-500" />
                {alertCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {alertCount > 9 ? "9+" : alertCount}
                  </span>
                )}
              </div>
              <div>
                <CardTitle className="text-lg">Alertas</CardTitle>
                <CardDescription>
                  {alertCount > 0
                    ? `Tienes ${alertCount} alerta${alertCount > 1 ? "s" : ""} pendiente${alertCount > 1 ? "s" : ""}`
                    : "Sin alertas pendientes"}
                </CardDescription>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
        </Card>
      </Link>

      {/* Notifications */}
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-lg">Notificaciones</CardTitle>
            <CardDescription>
              Configura las alertas que quieres recibir
            </CardDescription>
          </div>
          <div className="p-2 rounded-xl bg-amber-500/10">
            <Bell className="h-5 w-5 text-amber-500" />
          </div>
        </CardHeader>
        <CardContent>
          <NotificationSettings />
        </CardContent>
      </Card>

      {/* Quick Brew URLs */}
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-lg">Quick Brew</CardTitle>
            <CardDescription>
              URLs para QR o NFC en tus cafeteras
            </CardDescription>
          </div>
          <div className="p-2 rounded-xl bg-orange-500/10">
            <QrCode className="h-5 w-5 text-orange-500" />
          </div>
        </CardHeader>
        <CardContent>
          <QuickBrewUrls equipment={equipment} baseUrl={baseUrl} />
        </CardContent>
      </Card>

      {/* Membership */}
      {stats && (
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-lg">Membresia</CardTitle>
              <CardDescription>
                Informacion de tu cuenta
              </CardDescription>
            </div>
            <div className="p-2 rounded-xl bg-green-500/10">
              <Calendar className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">Miembro desde</span>
              <Badge variant="secondary" className="rounded-full">
                {new Date(stats.memberSince).toLocaleDateString("es-ES", {
                  month: "long",
                  year: "numeric",
                })}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sign Out */}
      <Card className="rounded-2xl border-destructive/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg text-destructive">Cerrar sesion</CardTitle>
          <div className="p-2 rounded-xl bg-destructive/10">
            <LogOut className="h-5 w-5 text-destructive" />
          </div>
        </CardHeader>
        <CardContent>
          <SignOutButton />
        </CardContent>
      </Card>
    </div>
  )
}
