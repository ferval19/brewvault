import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Pencil, Calendar, Wrench } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { getEquipment } from "../actions"
import { equipmentTypes } from "@/lib/validations/equipment"

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

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Link
            href="/equipment"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Volver a equipamiento
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {equipment.brand ? `${equipment.brand} ${equipment.model}` : equipment.model}
          </h1>
          <Badge variant="secondary">{typeLabel}</Badge>
        </div>
        <Link href={`/equipment/${id}/edit`}>
          <Button variant="outline">
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </Link>
      </div>

      {/* Fechas */}
      {(equipment.purchase_date || equipment.last_maintenance) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Fechas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {equipment.purchase_date && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fecha de compra</span>
                <span className="font-medium">
                  {new Date(equipment.purchase_date).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
            {equipment.last_maintenance && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ultimo mantenimiento</span>
                <span className="font-medium">
                  {new Date(equipment.last_maintenance).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Notas */}
      {equipment.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{equipment.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
