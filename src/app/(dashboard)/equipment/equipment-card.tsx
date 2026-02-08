"use client"

import Link from "next/link"
import { Cog, Pencil, Calendar } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import type { Equipment } from "./actions"
import { DeleteEquipmentDialog } from "./delete-equipment-dialog"
import { equipmentTypes } from "@/lib/validations/equipment"

interface EquipmentCardProps {
  equipment: Equipment
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  const typeLabel = equipmentTypes.find((t) => t.value === equipment.type)?.label || equipment.type

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
            <Cog className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  href={`/equipment/${equipment.id}`}
                  className="font-medium hover:underline block truncate"
                >
                  {equipment.brand ? `${equipment.brand} ${equipment.model}` : equipment.model}
                </Link>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {typeLabel}
                </Badge>
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href={`/equipment/${equipment.id}/edit`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                <DeleteEquipmentDialog
                  equipmentId={equipment.id}
                  equipmentName={equipment.brand ? `${equipment.brand} ${equipment.model}` : equipment.model}
                />
              </div>
            </div>

            {equipment.purchase_date && (
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>
                  Comprado: {new Date(equipment.purchase_date).toLocaleDateString("es-ES")}
                </span>
              </div>
            )}

            {equipment.notes && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {equipment.notes}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
