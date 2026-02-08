import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Pencil, Calendar, Wrench, Cog } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { getEquipment } from "../actions"
import { equipmentTypes } from "@/lib/validations/equipment"

const typeGradients: Record<string, string> = {
  grinder: "from-gray-500/20 to-slate-600/20",
  brewer: "from-amber-500/20 to-orange-500/20",
  espresso_machine: "from-stone-600/20 to-amber-700/20",
  kettle: "from-blue-500/20 to-cyan-500/20",
  scale: "from-emerald-500/20 to-teal-500/20",
  accessory: "from-purple-500/20 to-pink-500/20",
}

export default async function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getEquipment(id)

  if (!result.success || !result.data) {
    notFound()
  }

  const equipment = result.data
  const typeLabel = equipmentTypes.find((t) => t.value === equipment.type)?.label || equipment.type
  const gradient = typeGradients[equipment.type] || "from-gray-500/20 to-slate-600/20"
  const fullName = equipment.brand ? `${equipment.brand} ${equipment.model}` : equipment.model

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient}`}>
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
            <Link href={`/equipment/${id}/edit`}>
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

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                {fullName}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Dates */}
      {(equipment.purchase_date || equipment.last_maintenance) && (
        <div className="grid grid-cols-2 gap-4">
          {equipment.purchase_date && (
            <div className="rounded-2xl bg-card border p-5">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Calendar className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Comprado</span>
              </div>
              <p className="text-lg font-bold">
                {new Date(equipment.purchase_date).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          )}
          {equipment.last_maintenance && (
            <div className="rounded-2xl bg-card border p-5">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Wrench className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Mantenimiento</span>
              </div>
              <p className="text-lg font-bold">
                {new Date(equipment.last_maintenance).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      {equipment.notes && (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {equipment.notes}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
