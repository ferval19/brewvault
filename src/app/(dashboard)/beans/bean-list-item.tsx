"use client"

import { useState } from "react"
import Link from "next/link"
import {
  MapPin,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Package,
  Calendar,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteBeanDialog } from "./delete-bean-dialog"
import { StatusBadge } from "@/components/ui/status-badge"
import type { Bean } from "./actions"

interface BeanListItemProps {
  beans: Bean[]
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-"
  const date = new Date(dateStr)
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  })
}

function getDaysSinceRoast(dateStr: string | null): number | null {
  if (!dateStr) return null
  const roastDate = new Date(dateStr)
  const now = new Date()
  return Math.floor((now.getTime() - roastDate.getTime()) / (1000 * 60 * 60 * 24))
}

export function BeanListItem({ beans }: BeanListItemProps) {
  // Group beans by roaster
  const groupedBeans = beans.reduce((groups, bean) => {
    const roasterName = bean.roasters?.name || "Sin tostador"
    if (!groups[roasterName]) {
      groups[roasterName] = []
    }
    groups[roasterName].push(bean)
    return groups
  }, {} as Record<string, Bean[]>)

  const sortedGroups = Object.entries(groupedBeans).sort((a, b) => {
    if (a[0] === "Sin tostador") return 1
    if (b[0] === "Sin tostador") return -1
    return a[0].localeCompare(b[0])
  })

  return (
    <div className="space-y-6">
      {sortedGroups.map(([roasterName, roasterBeans]) => (
        <div key={roasterName}>
          {/* Roaster Header */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {roasterName}
            </span>
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">
              {roasterBeans.length} {roasterBeans.length === 1 ? "café" : "cafés"}
            </span>
          </div>

          {/* Beans List */}
          <div className="rounded-2xl border bg-card divide-y overflow-hidden">
            {roasterBeans.map((bean) => (
              <ListRow key={bean.id} bean={bean} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ListRow({ bean }: { bean: Bean }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const daysSinceRoast = getDaysSinceRoast(bean.roast_date)
  const isLowStock = bean.current_weight_grams !== null &&
    bean.low_stock_threshold_grams !== null &&
    bean.current_weight_grams <= bean.low_stock_threshold_grams &&
    bean.status === "active"

  const stockPercentage =
    bean.weight_grams && bean.current_weight_grams !== null
      ? Math.round((bean.current_weight_grams / bean.weight_grams) * 100)
      : null

  return (
    <>
      <div className="group relative">
        <Link
          href={`/beans/${bean.id}`}
          className="block p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            {/* Image or placeholder */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-coffee-100 to-coffee-200 dark:from-coffee-900/30 dark:to-coffee-800/30 flex items-center justify-center shrink-0 overflow-hidden">
              {bean.photo_url ? (
                <img
                  src={bean.photo_url}
                  alt={bean.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="h-5 w-5 text-coffee-600/60" />
              )}
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate">{bean.name}</h3>
                <StatusBadge status={bean.status as "active" | "finished" | "archived"} className="text-[10px] px-1.5 py-0.5" />
                {isLowStock && (
                  <AlertTriangle className="h-3.5 w-3.5 text-coffee-500 shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                {bean.origin_country && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {bean.origin_country}
                  </span>
                )}
                {bean.variety && (
                  <span className="hidden sm:inline">· {bean.variety}</span>
                )}
                {bean.process && (
                  <span className="hidden md:inline">· {bean.process}</span>
                )}
              </div>
            </div>

            {/* Metrics - Desktop */}
            <div className="hidden md:flex items-center gap-6 shrink-0">
              {bean.roast_date && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Tueste</p>
                  <p className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {daysSinceRoast !== null ? `${daysSinceRoast}d` : "-"}
                  </p>
                </div>
              )}
              {bean.current_weight_grams !== null && (
                <div className="text-center min-w-[60px]">
                  <p className="text-xs text-muted-foreground">Stock</p>
                  <p className={`text-sm font-medium ${isLowStock ? "text-coffee-500" : ""}`}>
                    {bean.current_weight_grams}g
                  </p>
                </div>
              )}
              {bean.personal_rating && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <p className="text-sm font-medium text-coffee-500">
                    {"★".repeat(bean.personal_rating)}
                  </p>
                </div>
              )}
            </div>

            {/* Mobile: Stock + Rating compact */}
            <div className="flex md:hidden items-center gap-2 shrink-0">
              {bean.personal_rating && (
                <span className="text-coffee-500 text-sm">
                  {"★".repeat(Math.min(bean.personal_rating, 3))}
                </span>
              )}
            </div>

            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </div>

          {/* Stock Bar - Always visible when there's stock data */}
          {stockPercentage !== null && bean.status === "active" && (
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    stockPercentage > 50 && "bg-green-500",
                    stockPercentage <= 50 && stockPercentage > 20 && "bg-coffee-500",
                    stockPercentage <= 20 && "bg-red-500"
                  )}
                  style={{ width: `${Math.max(stockPercentage, 3)}%` }}
                />
              </div>
              <span className={cn(
                "text-xs font-medium min-w-[70px] text-right",
                isLowStock ? "text-coffee-500" : "text-muted-foreground"
              )}>
                {bean.current_weight_grams}g / {bean.weight_grams}g
              </span>
            </div>
          )}
        </Link>

        {/* Actions Button */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
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
      </div>

      <DeleteBeanDialog
        beanId={bean.id}
        beanName={bean.name}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  )
}
