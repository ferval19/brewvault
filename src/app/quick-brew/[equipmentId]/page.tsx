import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Coffee, ArrowRight, Clock, Star, Flame } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getEquipment } from "@/app/(dashboard)/equipment/actions"
import { getQuickBrewStats } from "./actions"
import { equipmentTypes, espressoMachineSubtypes, grinderSubtypes } from "@/lib/validations/equipment"
import { brewMethods } from "@/lib/validations/brews"
import { createClient } from "@/lib/supabase/server"

export default async function QuickBrewPage({
  params,
}: {
  params: Promise<{ equipmentId: string }>
}) {
  const { equipmentId } = await params

  // Check if user is authenticated
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    redirect(`/login?next=/quick-brew/${equipmentId}`)
  }

  const [equipmentResult, statsResult] = await Promise.all([
    getEquipment(equipmentId),
    getQuickBrewStats(equipmentId),
  ])

  if (!equipmentResult.success || !equipmentResult.data) {
    notFound()
  }

  const equipment = equipmentResult.data
  const stats = statsResult.success ? statsResult.data : null

  const typeLabel = equipmentTypes.find(t => t.value === equipment.type)?.label || equipment.type
  const subtypeLabel = equipment.subtype
    ? (equipment.type === "espresso_machine"
        ? espressoMachineSubtypes.find(s => s.value === equipment.subtype)?.label
        : grinderSubtypes.find(s => s.value === equipment.subtype)?.label) || equipment.subtype
    : null

  const lastBrewMethodLabel = stats?.lastBrew
    ? brewMethods.find(m => m.value === stats.lastBrew?.brew_method)?.label || stats.lastBrew?.brew_method
    : null

  function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `hace ${diffMins}min`
    if (diffHours < 24) return `hace ${diffHours}h`
    if (diffDays === 1) return "ayer"
    return `hace ${diffDays} dias`
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      {/* Hero with coffee image overlay */}
      <div className="relative flex-1 flex flex-col">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80')`,
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/50 to-neutral-950" />

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col px-6 pt-8 pb-6">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <Coffee className="h-6 w-6 text-amber-500" />
            <span className="text-white font-semibold text-lg">BrewVault</span>
          </div>

          {/* Equipment Info */}
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            {/* Equipment Image */}
            {equipment.image_url ? (
              <div className="w-40 h-40 rounded-3xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 mb-6 p-4">
                <img
                  src={equipment.image_url}
                  alt={equipment.model}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-40 h-40 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 mb-6 flex items-center justify-center">
                <Coffee className="h-16 w-16 text-amber-500/50" />
              </div>
            )}

            {/* Equipment Name */}
            <h1 className="text-3xl font-bold text-white mb-2">
              {equipment.brand ? `${equipment.brand} ${equipment.model}` : equipment.model}
            </h1>
            <p className="text-white/60 text-lg">
              {typeLabel}
              {subtypeLabel && ` • ${subtypeLabel}`}
            </p>
          </div>

          {/* CTA Button */}
          <div className="mt-8">
            <Link href={`/brews/new?equipment=${equipmentId}`}>
              <Button
                size="lg"
                className="w-full h-16 text-xl font-semibold rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25"
              >
                <Coffee className="mr-3 h-6 w-6" />
                Nueva Brew
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-neutral-900 px-6 py-8 space-y-6">
        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{stats.totalBrews}</p>
              <p className="text-sm text-neutral-400">brews</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-500">
                {stats.avgRating ? `${stats.avgRating.toFixed(1)}★` : "—"}
              </p>
              <p className="text-sm text-neutral-400">promedio</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{stats.brewsToday}</p>
              <p className="text-sm text-neutral-400">hoy</p>
            </div>
          </div>
        )}

        {/* Last Brew */}
        {stats?.lastBrew && (
          <div className="bg-neutral-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-neutral-400 text-sm mb-2">
              <Clock className="h-4 w-4" />
              <span>Última preparación • {formatTimeAgo(stats.lastBrew.brewed_at)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">
                  {stats.lastBrew.beans?.name || "Café"}
                </p>
                <p className="text-neutral-400 text-sm">
                  {lastBrewMethodLabel} • {stats.lastBrew.dose_grams}g
                </p>
              </div>
              {stats.lastBrew.rating && (
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-medium">{stats.lastBrew.rating}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dashboard Link */}
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
          >
            Ir al Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
