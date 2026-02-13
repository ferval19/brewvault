"use client"

import Link from "next/link"
import { Pencil, Calendar, MoreHorizontal, Eye, Trash2 } from "lucide-react"
import { getEquipmentIllustration } from "@/lib/placeholder-illustrations"

import { Button } from "@/components/ui/button"
import { MetricPill } from "@/components/ui/metric-pill"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { Equipment } from "./actions"
import { DeleteEquipmentDialog } from "./delete-equipment-dialog"
import { equipmentTypes } from "@/lib/validations/equipment"
import { useState } from "react"

interface EquipmentCardProps {
  equipment: Equipment
}

const typeGradients: Record<string, string> = {
  grinder: "from-gray-500/20 to-slate-600/20",
  brewer: "from-amber-500/20 to-orange-500/20",
  espresso_machine: "from-stone-600/20 to-amber-700/20",
  kettle: "from-blue-500/20 to-cyan-500/20",
  scale: "from-emerald-500/20 to-teal-500/20",
  accessory: "from-purple-500/20 to-pink-500/20",
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const typeLabel = equipmentTypes.find((t) => t.value === equipment.type)?.label || equipment.type
  const gradient = typeGradients[equipment.type] || "from-gray-500/20 to-slate-600/20"
  const fullName = equipment.brand ? `${equipment.brand} ${equipment.model}` : equipment.model
  const EquipmentIllustration = getEquipmentIllustration(equipment.type)

  return (
    <>
      <Link href={`/equipment/${equipment.id}`} className="group block">
        <div className="relative overflow-hidden rounded-3xl glass-panel hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          {/* Header gradient */}
          <div className={`relative aspect-[16/8] bg-gradient-to-br ${gradient}`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <EquipmentIllustration className="w-20 h-20" />
            </div>

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Top bar */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <span className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm border border-white/25 dark:border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] text-xs font-medium">
                {typeLabel}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-white/90 dark:bg-black/60 backdrop-blur-sm border border-white/25 dark:border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] hover:bg-white dark:hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/equipment/${equipment.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalle
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/equipment/${equipment.id}/edit`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowDeleteDialog(true)
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Bottom overlay */}
            {equipment.purchase_date && (
              <div className="absolute bottom-3 left-3 right-3">
                <MetricPill
                  icon={Calendar}
                  value={new Date(equipment.purchase_date).toLocaleDateString("es-ES", {
                    month: "short",
                    year: "numeric",
                  })}
                  size="sm"
                  className="bg-white/90 dark:bg-black/60 backdrop-blur-sm"
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            <div>
              <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors">
                {fullName}
              </h3>
            </div>

            {equipment.notes && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {equipment.notes}
              </p>
            )}
          </div>
        </div>
      </Link>

      <DeleteEquipmentDialog
        equipmentId={equipment.id}
        equipmentName={fullName}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  )
}
