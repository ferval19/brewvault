"use client"

import Link from "next/link"
import { useState } from "react"
import { MoreHorizontal, Pencil, Trash2, MapPin, Globe, Coffee } from "lucide-react"

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

import { DeleteRoasterDialog } from "./delete-roaster-dialog"
import type { Roaster } from "./actions"

interface RoasterCardProps {
  roaster: Roaster
}

export function RoasterCard({ roaster }: RoasterCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const location = [roaster.city, roaster.country].filter(Boolean).join(", ")

  return (
    <>
      <Card className="group relative overflow-hidden hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight">
                <Link
                  href={`/roasters/${roaster.id}`}
                  className="hover:underline"
                >
                  {roaster.name}
                </Link>
              </CardTitle>
              {location && (
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {location}
                </CardDescription>
              )}
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
                  <Link href={`/roasters/${roaster.id}/edit`}>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Coffee className="h-4 w-4" />
              <span>
                {roaster._count?.beans || 0} {roaster._count?.beans === 1 ? "cafe" : "cafes"}
              </span>
            </div>
            {roaster.rating && (
              <span className="text-amber-500 text-sm">
                {"★".repeat(roaster.rating)}{"☆".repeat(5 - roaster.rating)}
              </span>
            )}
          </div>

          {roaster.website && (
            <a
              href={roaster.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <Globe className="h-3.5 w-3.5" />
              Sitio web
            </a>
          )}
        </CardContent>
      </Card>

      <DeleteRoasterDialog
        roasterId={roaster.id}
        roasterName={roaster.name}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  )
}
