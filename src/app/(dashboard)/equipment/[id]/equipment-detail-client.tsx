"use client"

import Link from "next/link"
import { ArrowLeft, Pencil, Calendar, Wrench, Cog } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { equipmentTypes } from "@/lib/validations/equipment"

const typeGradients: Record<string, string> = {
  grinder: "from-gray-500/20 to-slate-600/20",
  brewer: "from-coffee-500/20 to-coffee-600/20",
  espresso_machine: "from-stone-600/20 to-coffee-700/20",
  kettle: "from-blue-500/20 to-cyan-500/20",
  scale: "from-emerald-500/20 to-teal-500/20",
  accessory: "from-purple-500/20 to-pink-500/20",
}

interface Equipment {
  id: string
  model: string
  brand: string | null
  type: string
  subtype: string | null
  purchase_date: string | null
  last_maintenance: string | null
  notes: string | null
}

interface EquipmentDetailClientProps {
  equipment: Equipment
}

export function EquipmentDetailClient({ equipment }: EquipmentDetailClientProps) {
  const typeLabel = equipmentTypes.find((t) => t.value === equipment.type)?.label || equipment.type
  const gradient = typeGradients[equipment.type] || "from-gray-500/20 to-slate-600/20"
  const fullName = equipment.brand ? `${equipment.brand} ${equipment.model}` : equipment.model

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className={cn("relative overflow-hidden rounded-3xl bg-gradient-to-br", gradient)}>
        <div className="relative aspect-[21/9] sm:aspect-[3/1] flex items-center justify-center">
          <Cog className="h-24 w-24 text-gray-600 opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <Link
              href="/equipment"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm text-sm font-medium hover:bg-white dark:hover:bg-black/80 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
            <Link href={`/equipment/${equipment.id}/edit`}>
              <Button variant="secondary" size="sm" className="rounded-full backdrop-blur-sm">
                <Pencil className="mr-1.5 h-4 w-4" />
                Editar
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm text-sm font-medium">
                {typeLabel}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
              {fullName}
            </h1>
          </div>
        </div>
      </div>

      {/* Dates */}
      {(equipment.purchase_date || equipment.last_maintenance) && (
        <div className="grid grid-cols-2 gap-4">
          {equipment.purchase_date && (
            <MetricCard
              icon={<Calendar className="h-4 w-4" />}
              label="Comprado"
              value={new Date(equipment.purchase_date).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />
          )}
          {equipment.last_maintenance && (
            <MetricCard
              icon={<Wrench className="h-4 w-4" />}
              label="Mantenimiento"
              value={new Date(equipment.last_maintenance).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />
          )}
        </div>
      )}

      {/* Notes */}
      {equipment.notes && (
        <div className="rounded-2xl bg-card border overflow-hidden">
          <div className="px-6 py-4 border-b bg-muted/30">
            <h3 className="font-semibold">Notas</h3>
          </div>
          <div className="p-6">
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {equipment.notes}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl bg-card border p-5">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-lg font-bold">{value}</p>
    </div>
  )
}
