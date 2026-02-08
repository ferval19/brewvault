import { User, Bell, Coffee, Flame, Cog, LogOut, Calendar } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { getUserProfile, getStats } from "./actions"
import { ProfileForm } from "./profile-form"
import { SignOutButton } from "./sign-out-button"
import { NotificationSettings } from "./notification-settings"

export const metadata = {
  title: "Configuracion",
}

export default async function SettingsPage() {
  const [profileResult, statsResult] = await Promise.all([
    getUserProfile(),
    getStats(),
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
          <div className="relative overflow-hidden rounded-2xl bg-card border p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Cafes
                </p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.totalBeans}</p>
              </div>
              <div className="p-2 rounded-xl bg-amber-500/10">
                <Coffee className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-card border p-5">
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
          <div className="relative overflow-hidden rounded-2xl bg-card border p-5">
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
          <div className="space-y-1">
            <CardTitle className="text-lg">Perfil</CardTitle>
            <CardDescription>
              Tu informacion de cuenta
            </CardDescription>
          </div>
          <div className="p-2 rounded-xl bg-blue-500/10">
            <User className="h-5 w-5 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>

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
