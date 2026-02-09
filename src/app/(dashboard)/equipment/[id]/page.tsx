import { notFound } from "next/navigation"
import { Calendar, Wrench, Cog } from "lucide-react"

import {
  DetailPageHero,
  DetailBadge,
  DetailMetricGrid,
  DetailMetricCard,
  DetailSection,
} from "@/components/ui/detail-page"

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
      <DetailPageHero
        title={fullName}
        backHref="/equipment"
        editHref={`/equipment/${id}/edit`}
        gradient={gradient}
        fallbackIcon={<Cog className="h-24 w-24 text-gray-600 opacity-20" />}
        badges={<DetailBadge>{typeLabel}</DetailBadge>}
      />

      {/* Dates */}
      {(equipment.purchase_date || equipment.last_maintenance) && (
        <DetailMetricGrid columns={2}>
          {equipment.purchase_date && (
            <DetailMetricCard
              icon={Calendar}
              label="Comprado"
              value={new Date(equipment.purchase_date).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />
          )}
          {equipment.last_maintenance && (
            <DetailMetricCard
              icon={Wrench}
              label="Mantenimiento"
              value={new Date(equipment.last_maintenance).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />
          )}
        </DetailMetricGrid>
      )}

      {/* Notes */}
      {equipment.notes && (
        <DetailSection title="Notas">
          <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {equipment.notes}
          </p>
        </DetailSection>
      )}
    </div>
  )
}
