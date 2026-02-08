"use client"

import Link from "next/link"
import { useState } from "react"
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"

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

  const daysFromRoast = bean.roast_date
    ? Math.floor(
        (Date.now() - new Date(bean.roast_date).getTime()) / (1000 * 60 * 60 * 24)
      )
    : null

  return (
    <>
      <Card className="group relative overflow-hidden hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg leading-tight">
                <Link
                  href={`/beans/${bean.id}`}
                  className="hover:underline"
                >
                  {bean.name}
                </Link>
              </CardTitle>
              <CardDescription>
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

        <CardContent className="space-y-3">
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
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Stock</span>
                <span>
                  {bean.current_weight_grams}g / {bean.weight_grams}g
                </span>
              </div>
              <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-green-500 transition-all"
                  style={{ width: `${stockPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
            {daysFromRoast !== null && (
              <span>
                {daysFromRoast === 0
                  ? "Tostado hoy"
                  : daysFromRoast === 1
                  ? "Hace 1 dia"
                  : `Hace ${daysFromRoast} dias`}
              </span>
            )}
            {bean.personal_rating && (
              <span className="text-amber-500">
                {"★".repeat(bean.personal_rating)}
                {"☆".repeat(5 - bean.personal_rating)}
              </span>
            )}
          </div>
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
