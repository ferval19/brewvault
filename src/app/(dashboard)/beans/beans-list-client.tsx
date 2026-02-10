"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Search,
  LayoutGrid,
  List,
  Plus,
  SlidersHorizontal,
  ChevronDown,
  X,
  MapPin,
  Calendar,
  Package,
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
import { BeanCard } from "./bean-card"
import { BeanListItem } from "./bean-list-item"
import type { Bean } from "./actions"

type ViewMode = "grid" | "list"
type SortOption = "name" | "roast_date" | "rating" | "stock" | "origin"
type StatusFilter = "all" | "active" | "finished" | "archived"

interface BeansListClientProps {
  beans: Bean[]
  initialStatus?: string
}

export function BeansListClient({ beans: allBeans, initialStatus }: BeansListClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<StatusFilter>((initialStatus as StatusFilter) || "all")
  const [filterOrigin, setFilterOrigin] = useState<string | null>(null)
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>("roast_date")
  const [sortDesc, setSortDesc] = useState(true)

  // Get unique origins
  const origins = useMemo(() => {
    const uniqueOrigins = new Set<string>()
    allBeans.forEach((bean) => {
      if (bean.origin_country) uniqueOrigins.add(bean.origin_country)
    })
    return Array.from(uniqueOrigins).sort()
  }, [allBeans])

  // Status counts
  const statusCounts = useMemo(() => ({
    all: allBeans.length,
    active: allBeans.filter((b) => b.status === "active").length,
    finished: allBeans.filter((b) => b.status === "finished").length,
    archived: allBeans.filter((b) => b.status === "archived").length,
  }), [allBeans])

  // Filter beans
  const filteredBeans = useMemo(() => {
    let result = [...allBeans]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((bean) => {
        const name = bean.name?.toLowerCase() || ""
        const origin = bean.origin_country?.toLowerCase() || ""
        const roasterName = bean.roasters?.name?.toLowerCase() || ""
        const variety = bean.variety?.toLowerCase() || ""
        const process = bean.process?.toLowerCase() || ""
        return (
          name.includes(query) ||
          origin.includes(query) ||
          roasterName.includes(query) ||
          variety.includes(query) ||
          process.includes(query)
        )
      })
    }

    // Status filter
    if (filterStatus !== "all") {
      result = result.filter((b) => b.status === filterStatus)
    }

    // Origin filter
    if (filterOrigin) {
      result = result.filter((b) => b.origin_country === filterOrigin)
    }

    // Rating filter
    if (filterRating) {
      result = result.filter((b) => b.personal_rating && b.personal_rating >= filterRating)
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "name":
          comparison = (a.name || "").localeCompare(b.name || "")
          break
        case "roast_date":
          const dateA = a.roast_date ? new Date(a.roast_date).getTime() : 0
          const dateB = b.roast_date ? new Date(b.roast_date).getTime() : 0
          comparison = dateA - dateB
          break
        case "rating":
          comparison = (a.personal_rating || 0) - (b.personal_rating || 0)
          break
        case "stock":
          comparison = (a.current_weight_grams || 0) - (b.current_weight_grams || 0)
          break
        case "origin":
          comparison = (a.origin_country || "").localeCompare(b.origin_country || "")
          break
      }
      return sortDesc ? -comparison : comparison
    })

    return result
  }, [allBeans, searchQuery, filterStatus, filterOrigin, filterRating, sortBy, sortDesc])

  const hasActiveFilters = searchQuery || filterStatus !== "all" || filterOrigin || filterRating

  function clearFilters() {
    setSearchQuery("")
    setFilterStatus("all")
    setFilterOrigin(null)
    setFilterRating(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Mis Cafes</h1>
          <p className="text-muted-foreground">
            {filteredBeans.length} {filteredBeans.length === 1 ? "cafe" : "cafes"}
            {hasActiveFilters && filteredBeans.length !== allBeans.length && ` de ${allBeans.length}`}
          </p>
        </div>
        <Link href="/beans/new" className="hidden sm:block">
          <Button size="lg" className="rounded-xl">
            <Plus className="mr-2 h-5 w-5" />
            Nuevo cafe
          </Button>
        </Link>
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cafe, origen, tostador, variedad..."
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
            <DropdownMenuItem onClick={() => { setSortBy("roast_date"); setSortDesc(true) }}>
              <Calendar className="mr-2 h-4 w-4" />
              Mas recientes
              {sortBy === "roast_date" && sortDesc && " ✓"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setSortBy("roast_date"); setSortDesc(false) }}>
              <Calendar className="mr-2 h-4 w-4" />
              Mas antiguos
              {sortBy === "roast_date" && !sortDesc && " ✓"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { setSortBy("name"); setSortDesc(false) }}>
              Nombre A-Z
              {sortBy === "name" && !sortDesc && " ✓"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setSortBy("rating"); setSortDesc(true) }}>
              Mejor valorados
              {sortBy === "rating" && " ✓"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setSortBy("stock"); setSortDesc(true) }}>
              <Package className="mr-2 h-4 w-4" />
              Mas stock
              {sortBy === "stock" && sortDesc && " ✓"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setSortBy("origin"); setSortDesc(false) }}>
              <MapPin className="mr-2 h-4 w-4" />
              Por origen
              {sortBy === "origin" && " ✓"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {/* Status filters */}
        {(["all", "active", "finished", "archived"] as StatusFilter[]).map((status) => {
          const labels = { all: "Todos", active: "Activos", finished: "Agotados", archived: "Archivados" }
          if (status !== "all" && statusCounts[status] === 0) return null
          return (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => setFilterStatus(status)}
            >
              {labels[status]}
              <span className="ml-1.5 text-xs opacity-70">({statusCounts[status]})</span>
            </Button>
          )
        })}

        {/* Origin filter */}
        {origins.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={filterOrigin ? "default" : "outline"}
                size="sm"
                className="rounded-full"
              >
                <MapPin className="mr-1 h-3 w-3" />
                {filterOrigin || "Origen"}
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterOrigin(null)}>
                Todos los origenes
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {origins.map((origin) => (
                <DropdownMenuItem key={origin} onClick={() => setFilterOrigin(origin)}>
                  {origin}
                  {filterOrigin === origin && " ✓"}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

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
      {filteredBeans.length === 0 ? (
        <EmptyState hasFilter={!!hasActiveFilters} onClear={clearFilters} hasAnyBeans={allBeans.length > 0} />
      ) : (
        <>
          {viewMode === "grid" && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBeans.map((bean) => (
                <BeanCard key={bean.id} bean={bean} />
              ))}
            </div>
          )}

          {viewMode === "list" && (
            <BeanListItem beans={filteredBeans} />
          )}
        </>
      )}

      {/* Mobile FAB */}
      <Link
        href="/beans/new"
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

function EmptyState({
  hasFilter,
  onClear,
  hasAnyBeans,
}: {
  hasFilter: boolean
  onClear: () => void
  hasAnyBeans: boolean
}) {
  if (hasFilter) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium mb-2">Sin resultados</h3>
        <p className="text-muted-foreground mb-4">
          No hay cafes que coincidan con tu busqueda
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
        <Package className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Tu boveda esta vacia</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Empieza agregando tu primer cafe para llevar un registro de tu coleccion
      </p>
      <Link href="/beans/new">
        <Button size="lg" className="rounded-xl">
          <Plus className="mr-2 h-5 w-5" />
          Agregar primer cafe
        </Button>
      </Link>
    </div>
  )
}
