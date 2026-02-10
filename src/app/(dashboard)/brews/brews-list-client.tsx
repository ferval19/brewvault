"use client"

import { useState, useMemo, useTransition } from "react"
import { usePersistedState } from "@/hooks/use-persisted-state"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Search,
  LayoutGrid,
  List,
  Calendar,
  Layers,
  Plus,
  SlidersHorizontal,
  ChevronDown,
  X,
  CheckSquare,
  Square,
  Trash2,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { BrewCard } from "@/components/cards/brew-card"
import { BrewListItem } from "./brew-list-item"
import { BrewTimeline } from "./brew-timeline"
import { BrewsByBean } from "./brews-by-bean"
import { getBrewMethodConfig } from "@/lib/brew-methods"
import { deleteBrews } from "./actions"
import type { Brew } from "./actions"

type ViewMode = "grid" | "list" | "timeline" | "grouped"
type SortOption = "date" | "rating" | "ratio" | "price"

interface BrewsListClientProps {
  brews: Brew[]
  initialMethod?: string
}

// Get default view mode based on screen size
function getDefaultViewMode(): ViewMode {
  if (typeof window !== "undefined" && window.innerWidth < 768) {
    return "list"
  }
  return "grid"
}

export function BrewsListClient({ brews: allBrews, initialMethod }: BrewsListClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [viewMode, setViewMode] = usePersistedState<ViewMode>("brewvault:brews-view", getDefaultViewMode)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterMethod, setFilterMethod] = useState<string | null>(initialMethod || null)
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>("date")
  const [sortDesc, setSortDesc] = useState(true)

  // Selection state
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Get unique methods used
  const usedMethods = useMemo(() => {
    return [...new Set(allBrews.map((b) => b.brew_method))]
  }, [allBrews])

  // Filter brews
  const filteredBrews = useMemo(() => {
    let result = [...allBrews]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((brew) => {
        const beanName = brew.beans?.name?.toLowerCase() || ""
        const roasterName = brew.beans?.roasters?.name?.toLowerCase() || ""
        const notes = brew.notes?.toLowerCase() || ""
        return beanName.includes(query) || roasterName.includes(query) || notes.includes(query)
      })
    }

    // Method filter
    if (filterMethod) {
      result = result.filter((b) => b.brew_method === filterMethod)
    }

    // Rating filter
    if (filterRating) {
      result = result.filter((b) => b.rating && b.rating >= filterRating)
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "date":
          comparison = new Date(a.brewed_at).getTime() - new Date(b.brewed_at).getTime()
          break
        case "rating":
          comparison = (a.rating || 0) - (b.rating || 0)
          break
        case "ratio":
          const ratioA = a.water_grams / a.dose_grams
          const ratioB = b.water_grams / b.dose_grams
          comparison = ratioA - ratioB
          break
        case "price":
          const priceA = calculateBrewPrice(a) || 0
          const priceB = calculateBrewPrice(b) || 0
          comparison = priceA - priceB
          break
      }
      return sortDesc ? -comparison : comparison
    })

    return result
  }, [allBrews, searchQuery, filterMethod, filterRating, sortBy, sortDesc])

  const hasActiveFilters = searchQuery || filterMethod || filterRating

  function clearFilters() {
    setSearchQuery("")
    setFilterMethod(null)
    setFilterRating(null)
  }

  // Selection helpers
  function toggleSelection(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function selectAll() {
    setSelectedIds(new Set(filteredBrews.map((b) => b.id)))
  }

  function clearSelection() {
    setSelectedIds(new Set())
    setSelectionMode(false)
  }

  function toggleSelectionMode() {
    if (selectionMode) {
      clearSelection()
    } else {
      setSelectionMode(true)
    }
  }

  async function handleBulkDelete() {
    if (selectedIds.size === 0) return

    startTransition(async () => {
      const result = await deleteBrews(Array.from(selectedIds))
      if (result.success) {
        clearSelection()
        router.refresh()
      }
    })
    setShowDeleteDialog(false)
  }

  const allSelected = filteredBrews.length > 0 && selectedIds.size === filteredBrews.length

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold">Mis Preparaciones</h1>
          <p className="text-sm text-muted-foreground">
            {selectionMode && selectedIds.size > 0 ? (
              <span className="text-primary font-medium">
                {selectedIds.size} {selectedIds.size === 1 ? "seleccionada" : "seleccionadas"}
              </span>
            ) : (
              <>
                {filteredBrews.length} {filteredBrews.length === 1 ? "preparacion" : "preparaciones"}
                {hasActiveFilters && filteredBrews.length !== allBrews.length && ` de ${allBrews.length}`}
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Selection mode toggle */}
          {allBrews.length > 0 && (
            <Button
              variant={selectionMode ? "default" : "outline"}
              size="sm"
              className="rounded-xl"
              onClick={toggleSelectionMode}
            >
              {selectionMode ? (
                <>
                  <X className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Cancelar</span>
                </>
              ) : (
                <>
                  <CheckSquare className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Seleccionar</span>
                </>
              )}
            </Button>
          )}
          <Link href="/brews/new" className="hidden sm:block">
            <Button size="lg" className="rounded-xl">
              <Plus className="mr-2 h-5 w-5" />
              Nueva preparacion
            </Button>
          </Link>
        </div>
      </div>

      {/* Search + Controls Row */}
      <div className="flex gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-8 h-9 sm:h-10 rounded-xl text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* View Switcher - compact */}
        <div className="flex items-center p-1 bg-muted rounded-xl">
          <ViewButton active={viewMode === "grid"} onClick={() => setViewMode("grid")} icon={LayoutGrid} />
          <ViewButton active={viewMode === "list"} onClick={() => setViewMode("list")} icon={List} />
          <ViewButton active={viewMode === "timeline"} onClick={() => setViewMode("timeline")} icon={Calendar} />
          <ViewButton active={viewMode === "grouped"} onClick={() => setViewMode("grouped")} icon={Layers} />
        </div>

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-auto sm:px-3 rounded-xl shrink-0">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Ordenar</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { setSortBy("date"); setSortDesc(true) }}>
              Mas recientes {sortBy === "date" && sortDesc && "✓"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setSortBy("date"); setSortDesc(false) }}>
              Mas antiguas {sortBy === "date" && !sortDesc && "✓"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { setSortBy("rating"); setSortDesc(true) }}>
              Mejor valoradas {sortBy === "rating" && "✓"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setSortBy("ratio"); setSortDesc(false) }}>
              Ratio (menor a mayor) {sortBy === "ratio" && !sortDesc && "✓"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setSortBy("price"); setSortDesc(false) }}>
              Precio por taza {sortBy === "price" && "✓"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filter Pills - horizontal scroll on mobile */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap scrollbar-hide">
          <Button
            variant={!filterMethod ? "default" : "outline"}
            size="sm"
            className="rounded-full shrink-0 h-8 text-xs sm:text-sm"
            onClick={() => setFilterMethod(null)}
          >
            Todas
          </Button>
          {usedMethods.map((method) => {
            const config = getBrewMethodConfig(method)
            const MethodIcon = config.icon
            return (
              <Button
                key={method}
                variant={filterMethod === method ? "default" : "outline"}
                size="sm"
                className="rounded-full shrink-0 h-8 text-xs sm:text-sm"
                onClick={() => setFilterMethod(method === filterMethod ? null : method)}
              >
                <MethodIcon className="h-3.5 w-3.5 sm:mr-1.5" />
                <span className="hidden sm:inline">{config.label}</span>
              </Button>
            )
          })}

          {/* Rating filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={filterRating ? "default" : "outline"}
                size="sm"
                className="rounded-full shrink-0 h-8 text-xs sm:text-sm"
              >
                {filterRating ? `${"★".repeat(filterRating)}+` : "★"}
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterRating(null)}>
                Todos los ratings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {[5, 4, 3, 2, 1].map((r) => (
                <DropdownMenuItem key={r} onClick={() => setFilterRating(r)}>
                  {"★".repeat(r)}{"☆".repeat(5 - r)} y mas
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full shrink-0 h-8 text-xs text-muted-foreground"
              onClick={clearFilters}
            >
              <X className="h-3 w-3 sm:mr-1" />
              <span className="hidden sm:inline">Limpiar</span>
            </Button>
          )}
        </div>
      </div>

      {/* Content based on view mode */}
      {filteredBrews.length === 0 ? (
        <EmptyState hasFilter={!!hasActiveFilters} onClear={clearFilters} />
      ) : (
        <>
          {/* Select all row when in selection mode */}
          {selectionMode && (
            <div className="flex items-center gap-2 py-2 px-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={allSelected ? clearSelection : selectAll}
                className="text-muted-foreground"
              >
                {allSelected ? (
                  <>
                    <CheckSquare className="h-4 w-4 mr-2 text-primary" />
                    Deseleccionar todo
                  </>
                ) : (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Seleccionar todo ({filteredBrews.length})
                  </>
                )}
              </Button>
            </div>
          )}

          {viewMode === "grid" && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBrews.map((brew) => (
                <BrewCard
                  key={brew.id}
                  brew={brew}
                  selectionMode={selectionMode}
                  selected={selectedIds.has(brew.id)}
                  onSelect={() => toggleSelection(brew.id)}
                />
              ))}
            </div>
          )}

          {viewMode === "list" && (
            <BrewListItem
              brews={filteredBrews}
              selectionMode={selectionMode}
              selectedIds={selectedIds}
              onSelect={toggleSelection}
            />
          )}

          {viewMode === "timeline" && (
            <BrewTimeline brews={filteredBrews} />
          )}

          {viewMode === "grouped" && (
            <BrewsByBean brews={filteredBrews} />
          )}
        </>
      )}

      {/* Bulk Action Bar */}
      {selectionMode && selectedIds.size > 0 && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-3 px-4 py-3 bg-card border rounded-2xl shadow-lg">
            <span className="text-sm font-medium">
              {selectedIds.size} {selectedIds.size === 1 ? "seleccionada" : "seleccionadas"}
            </span>
            <div className="w-px h-6 bg-border" />
            <Button
              variant="destructive"
              size="sm"
              className="rounded-xl"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar preparaciones</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estas seguro de que quieres eliminar {selectedIds.size}{" "}
              {selectedIds.size === 1 ? "preparacion" : "preparaciones"}?
              Esta accion no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}

function ViewButton({
  active,
  onClick,
  icon: Icon,
}: {
  active: boolean
  onClick: () => void
  icon: React.ElementType
}) {
  return (
    <button
      onClick={onClick}
      className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}

function EmptyState({ hasFilter, onClear }: { hasFilter: boolean; onClear: () => void }) {
  if (hasFilter) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium mb-2">
          Sin resultados
        </h3>
        <p className="text-muted-foreground mb-4">
          No hay preparaciones que coincidan con tu busqueda
        </p>
        <Button variant="outline" onClick={onClear}>
          Limpiar filtros
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-6 rounded-full bg-primary/10 mb-6">
        <LayoutGrid className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        Comienza a registrar tus preparaciones
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Lleva un registro de cada extraccion para perfeccionar tu tecnica
      </p>
      <Link href="/brews/new">
        <Button size="lg" className="rounded-xl">
          <Plus className="mr-2 h-5 w-5" />
          Nueva preparacion
        </Button>
      </Link>
    </div>
  )
}

function calculateBrewPrice(brew: Brew): number | null {
  const { beans, dose_grams } = brew
  if (!beans?.price || !beans?.weight_grams || beans.weight_grams === 0) {
    return null
  }
  return (dose_grams / beans.weight_grams) * beans.price
}
