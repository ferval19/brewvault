"use client"

import { useState, useMemo } from "react"
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
import { BrewCard } from "@/components/cards/brew-card"
import { BrewListItem } from "./brew-list-item"
import { BrewTimeline } from "./brew-timeline"
import { BrewsByBean } from "./brews-by-bean"
import { getBrewMethodConfig } from "@/lib/brew-methods"
import type { Brew } from "./actions"

type ViewMode = "grid" | "list" | "timeline" | "grouped"
type SortOption = "date" | "rating" | "ratio" | "price"

interface BrewsListClientProps {
  brews: Brew[]
  initialMethod?: string
}

export function BrewsListClient({ brews: allBrews, initialMethod }: BrewsListClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterMethod, setFilterMethod] = useState<string | null>(initialMethod || null)
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>("date")
  const [sortDesc, setSortDesc] = useState(true)

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Mis Preparaciones</h1>
          <p className="text-muted-foreground">
            {filteredBrews.length} {filteredBrews.length === 1 ? "preparacion" : "preparaciones"}
            {hasActiveFilters && filteredBrews.length !== allBrews.length && ` de ${allBrews.length}`}
          </p>
        </div>
        <Link href="/brews/new" className="hidden sm:block">
          <Button size="lg" className="rounded-xl">
            <Plus className="mr-2 h-5 w-5" />
            Nueva preparacion
          </Button>
        </Link>
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cafe, tostador..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1 bg-muted rounded-xl">
          <ViewButton
            active={viewMode === "grid"}
            onClick={() => setViewMode("grid")}
            icon={LayoutGrid}
            label="Grid"
          />
          <ViewButton
            active={viewMode === "list"}
            onClick={() => setViewMode("list")}
            icon={List}
            label="Lista"
          />
          <ViewButton
            active={viewMode === "timeline"}
            onClick={() => setViewMode("timeline")}
            icon={Calendar}
            label="Timeline"
          />
          <ViewButton
            active={viewMode === "grouped"}
            onClick={() => setViewMode("grouped")}
            icon={Layers}
            label="Por cafe"
          />
        </div>

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-xl gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Ordenar</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { setSortBy("date"); setSortDesc(true) }}>
              Mas recientes
              {sortBy === "date" && sortDesc && " ✓"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setSortBy("date"); setSortDesc(false) }}>
              Mas antiguas
              {sortBy === "date" && !sortDesc && " ✓"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { setSortBy("rating"); setSortDesc(true) }}>
              Mejor valoradas
              {sortBy === "rating" && " ✓"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setSortBy("ratio"); setSortDesc(false) }}>
              Ratio (menor a mayor)
              {sortBy === "ratio" && !sortDesc && " ✓"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setSortBy("price"); setSortDesc(false) }}>
              Precio por taza
              {sortBy === "price" && " ✓"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Method Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={!filterMethod ? "default" : "outline"}
          size="sm"
          className="rounded-full"
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
              className="rounded-full"
              onClick={() => setFilterMethod(method === filterMethod ? null : method)}
            >
              <MethodIcon className="mr-1.5 h-4 w-4" />
              {config.label}
            </Button>
          )
        })}

        {/* Rating filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={filterRating ? "default" : "outline"}
              size="sm"
              className="rounded-full"
            >
              {filterRating ? `${"★".repeat(filterRating)}+` : "★ Rating"}
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
            className="rounded-full text-muted-foreground"
            onClick={clearFilters}
          >
            <X className="mr-1 h-3 w-3" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Content based on view mode */}
      {filteredBrews.length === 0 ? (
        <EmptyState hasFilter={!!hasActiveFilters} onClear={clearFilters} />
      ) : (
        <>
          {viewMode === "grid" && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBrews.map((brew) => (
                <BrewCard key={brew.id} brew={brew} />
              ))}
            </div>
          )}

          {viewMode === "list" && (
            <BrewListItem brews={filteredBrews} />
          )}

          {viewMode === "timeline" && (
            <BrewTimeline brews={filteredBrews} />
          )}

          {viewMode === "grouped" && (
            <BrewsByBean brews={filteredBrews} />
          )}
        </>
      )}

      {/* Mobile FAB */}
      <Link
        href="/brews/new"
        className="fixed bottom-24 right-6 sm:hidden z-50"
      >
        <Button size="lg" className="h-14 w-14 rounded-full shadow-lg">
          <Plus className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  )
}

function ViewButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ElementType
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
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
