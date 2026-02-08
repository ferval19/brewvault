"use client"

import Link from "next/link"
import { useState } from "react"
import { MoreHorizontal, Pencil, Trash2, Eye, MapPin, Globe, Coffee } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { DeleteRoasterDialog } from "./delete-roaster-dialog"
import type { Roaster } from "./actions"

interface RoasterCardProps {
  roaster: Roaster
}

export function RoasterCard({ roaster }: RoasterCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const location = [roaster.city, roaster.country].filter(Boolean).join(", ")
  const beanCount = roaster._count?.beans || 0

  return (
    <>
      <Link href={`/roasters/${roaster.id}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl bg-card border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
          {/* Header gradient */}
          <div className="relative aspect-[16/8] bg-gradient-to-br from-stone-600/20 to-amber-700/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <Coffee className="h-16 w-16 text-stone-600 opacity-30" />
            </div>

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Top bar */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              {location && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm text-xs font-medium">
                  <MapPin className="h-3 w-3" />
                  {location}
                </span>
              )}
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
                    <Link href={`/roasters/${roaster.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalle
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/roasters/${roaster.id}/edit`}>
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

            {/* Bottom overlay with rating */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <span className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm text-xs font-medium">
                {beanCount} {beanCount === 1 ? "cafe" : "cafes"}
              </span>
              {roaster.rating && (
                <span className="px-2 py-1 rounded-full bg-amber-500/90 backdrop-blur-sm text-white text-sm font-medium">
                  {"★".repeat(roaster.rating)}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            <div>
              <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                {roaster.name}
              </h3>
            </div>

            {roaster.website && (
              <a
                href={roaster.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <Globe className="h-3.5 w-3.5" />
                Sitio web
              </a>
            )}
          </div>
        </div>
      </Link>

      <DeleteRoasterDialog
        roasterId={roaster.id}
        roasterName={roaster.name}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  )
}
