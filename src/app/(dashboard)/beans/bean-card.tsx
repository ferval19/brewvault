"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import { MoreHorizontal, Pencil, Trash2, Eye, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  finished: "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300",
  archived: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
}

const statusLabels: Record<string, string> = {
  active: "Activo",
  finished: "Agotado",
  archived: "Archivado",
}

export function BeanCard({ bean }: BeanCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const stockPercentage =
    bean.weight_grams && bean.current_weight_grams
      ? Math.round((bean.current_weight_grams / bean.weight_grams) * 100)
      : null

  const daysFromRoast = useMemo(() => {
    if (!bean.roast_date) return null
    const now = new Date()
    const roastDate = new Date(bean.roast_date)
    return Math.floor((now.getTime() - roastDate.getTime()) / (1000 * 60 * 60 * 24))
  }, [bean.roast_date])

  return (
    <>
      <Card className="group relative overflow-hidden hover:shadow-md transition-shadow">
        {/* Coffee Photo */}
        {bean.photo_url && (
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={bean.photo_url}
              alt={bean.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}

        <CardHeader className="pb-2 pt-4">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1.5 min-w-0">
              <CardTitle className="text-lg leading-tight">
                <Link
                  href={`/beans/${bean.id}`}
                  className="hover:underline line-clamp-2"
                >
                  {bean.name}
                </Link>
              </CardTitle>
              <CardDescription className="line-clamp-1">
                {bean.roasters?.name || "Sin tostador"}
                {bean.origin_country && ` · ${bean.origin_country}`}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
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
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-2 pb-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className={statusColors[bean.status]}>
              {statusLabels[bean.status]}
            </Badge>
            {bean.roast_level && (
              <Badge variant="outline">
                {roastLevelLabels[bean.roast_level] || bean.roast_level}
              </Badge>
            )}
          </div>

          {/* Stock bar */}
          {stockPercentage !== null && bean.status === "active" && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  Stock
                  {stockPercentage <= 20 && (
                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                  )}
                </span>
                <span>
                  {bean.current_weight_grams}g / {bean.weight_grams}g
                </span>
              </div>
              <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
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
          {(daysFromRoast !== null || bean.personal_rating) && (
            <div className="flex items-center justify-between text-sm text-muted-foreground pt-1 border-t">
              <span>
                {daysFromRoast !== null
                  ? daysFromRoast === 0
                    ? "Tostado hoy"
                    : daysFromRoast === 1
                    ? "Hace 1 dia"
                    : `Hace ${daysFromRoast} dias`
                  : ""}
              </span>
              {bean.personal_rating && (
                <span className="text-amber-500">
                  {"★".repeat(bean.personal_rating)}
                  {"☆".repeat(5 - bean.personal_rating)}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteBeanDialog
        beanId={bean.id}
        beanName={bean.name}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  )
}
