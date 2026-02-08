import { User, Bell, Coffee, Flame, Cog, LogOut } from "lucide-react"

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

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Perfil
          </CardTitle>
          <CardDescription>
            Tu informacion de cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaciones
          </CardTitle>
          <CardDescription>
            Configura las alertas que quieres recibir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationSettings />
        </CardContent>
      </Card>

      {/* Stats */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tu actividad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Coffee className="h-4 w-4" />
                </div>
                <p className="text-2xl font-bold">{stats.totalBeans}</p>
                <p className="text-xs text-muted-foreground">Cafes</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Flame className="h-4 w-4" />
                </div>
                <p className="text-2xl font-bold">{stats.totalBrews}</p>
                <p className="text-xs text-muted-foreground">Preparaciones</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Cog className="h-4 w-4" />
                </div>
                <p className="text-2xl font-bold">{stats.totalEquipment}</p>
                <p className="text-xs text-muted-foreground">Equipos</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t text-center">
              <p className="text-sm text-muted-foreground">
                Miembro desde{" "}
                {new Date(stats.memberSince).toLocaleDateString("es-ES", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sign Out */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-destructive">
            <LogOut className="h-5 w-5" />
            Cerrar sesion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SignOutButton />
        </CardContent>
      </Card>
    </div>
  )
}
