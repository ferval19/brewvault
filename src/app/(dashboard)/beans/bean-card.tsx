"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import { MoreHorizontal, Pencil, Trash2, Eye, AlertTriangle, MapPin, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { CoffeeBeansIllustration } from "@/lib/placeholder-illustrations"

import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { DeleteBeanDialog } from "./delete-bean-dialog"
import type { Bean } from "./actions"

interface BeanCardProps {
  bean: Bean
}

const roastLevelLabels: Record<string, string> = {
  light: "Claro",
  "medium-light": "Medio-Claro",
  medium: "Medio",
  "medium-dark": "Medio-Oscuro",
  dark: "Oscuro",
}

const roastLevelGradients: Record<string, string> = {
  light: "from-amber-200/30 to-yellow-300/30",
  "medium-light": "from-amber-300/30 to-orange-300/30",
  medium: "from-amber-400/30 to-orange-400/30",
  "medium-dark": "from-amber-600/30 to-orange-600/30",
  dark: "from-amber-800/30 to-stone-700/30",
}


export function BeanCard({ bean }: BeanCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const stockPercentage =
    bean.weight_grams && bean.current_weight_grams
      ? Math.round((bean.current_weight_grams / bean.weight_grams) * 100)
      : null

  const isLowStock = stockPercentage !== null && stockPercentage <= 20

  const daysFromRoast = useMemo(() => {
    if (!bean.roast_date) return null
    const now = new Date()
    const roastDate = new Date(bean.roast_date)
    return Math.floor((now.getTime() - roastDate.getTime()) / (1000 * 60 * 60 * 24))
  }, [bean.roast_date])

  const gradient = bean.roast_level
    ? roastLevelGradients[bean.roast_level] || "from-amber-400/30 to-orange-400/30"
    : "from-amber-400/30 to-orange-400/30"

  return (
    <>
      <Link href={`/beans/${bean.id}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl bg-card border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
          {/* Header with image or gradient */}
          <div className={`relative aspect-[16/10] bg-gradient-to-br ${gradient}`}>
            {bean.photo_url ? (
              <img
                src={bean.photo_url}
                alt={bean.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <CoffeeBeansIllustration className="w-24 h-24" />
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Top bar */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <StatusBadge status={isLowStock && bean.status === "active" ? "low_stock" : bean.status as "active" | "finished" | "archived"} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-white/90 dark:bg-black/60 backdrop-blur-sm hover:bg-white dark:hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/beans/${bean.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalle
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/beans/${bean.id}/edit`}>
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
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <div className="flex flex-wrap gap-2">
                {bean.roast_level && (
                  <span className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm text-xs font-medium">
                    {roastLevelLabels[bean.roast_level] || bean.roast_level}
                  </span>
                )}
                {bean.origin_country && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm text-xs font-medium">
                    <MapPin className="h-3 w-3" />
                    {bean.origin_country}
                  </span>
                )}
              </div>
              {bean.personal_rating && (
                <span className="px-2 py-1 rounded-full bg-amber-500/90 backdrop-blur-sm text-white text-sm font-medium">
                  {"★".repeat(bean.personal_rating)}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            {/* Bean info */}
            <div>
              <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {bean.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {bean.roasters?.name || "Sin tostador"}
              </p>
            </div>

            {/* Stock bar */}
            {stockPercentage !== null && bean.status === "active" && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    Stock
                    {isLowStock && <AlertTriangle className="h-3 w-3 text-amber-500" />}
                  </span>
                  <span className="font-medium">
                    {bean.current_weight_grams}g / {bean.weight_grams}g
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      stockPercentage > 50 && "bg-green-500",
                      stockPercentage <= 50 && stockPercentage > 20 && "bg-amber-500",
                      stockPercentage <= 20 && "bg-red-500"
                    )}
                    style={{ width: `${Math.max(stockPercentage, 5)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Footer info */}
            {daysFromRoast !== null && (
              <div className="flex items-center gap-1.5 pt-3 border-t text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {daysFromRoast === 0
                    ? "Tostado hoy"
                    : daysFromRoast === 1
                    ? "Hace 1 dia"
                    : `Hace ${daysFromRoast} dias`}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>

      <DeleteBeanDialog
        beanId={bean.id}
        beanName={bean.name}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  )
}
