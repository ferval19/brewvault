"use client"

import { useState } from "react"
import { Search, Cog, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  equipmentCatalog,
  type CatalogEquipment,
} from "@/lib/data/equipment-catalog"

interface EquipmentCatalogPickerProps {
  onSelect: (equipment: CatalogEquipment) => void
}

const typeLabels: Record<string, string> = {
  grinder: "Molinillo",
  brewer: "Cafetera Filtro",
  espresso_machine: "Cafetera Espresso",
  kettle: "Hervidor",
  scale: "Bascula",
  accessory: "Accesorio",
}

const subtypeLabels: Record<string, string> = {
  super_automatic: "Superautomatica",
  semi_automatic: "Semiautomatica",
  manual: "Manual",
  electric: "Electrico",
}

const typeCategories = [
  { value: "all", label: "Todos" },
  { value: "espresso_machine", label: "Espresso" },
  { value: "grinder", label: "Molinillos" },
] as const

export function EquipmentCatalogPicker({ onSelect }: EquipmentCatalogPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filteredEquipment = equipmentCatalog.filter((eq) => {
    const matchesSearch =
      search === "" ||
      eq.name.toLowerCase().includes(search.toLowerCase()) ||
      eq.brand.toLowerCase().includes(search.toLowerCase()) ||
      eq.model.toLowerCase().includes(search.toLowerCase())

    const matchesType =
      typeFilter === "all" || eq.type === typeFilter

    return matchesSearch && matchesType
  })

  function handleSelect(equipment: CatalogEquipment) {
    setSelectedId(equipment.id)
  }

  function handleConfirm() {
    const selected = equipmentCatalog.find((e) => e.id === selectedId)
    if (selected) {
      onSelect(selected)
      setOpen(false)
      setSearch("")
      setTypeFilter("all")
      setSelectedId(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Cog className="mr-2 h-4 w-4" />
          Elegir del catalogo
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-2xl h-[90vh] sm:h-auto sm:max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Catalogo de Equipamiento</DialogTitle>
          <DialogDescription>
            Selecciona un equipo del catalogo para prellenar el formulario
          </DialogDescription>
        </DialogHeader>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 py-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, marca, modelo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Tabs value={typeFilter} onValueChange={setTypeFilter} className="w-full sm:w-auto">
            <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:flex">
              {typeCategories.map((cat) => (
                <TabsTrigger key={cat.value} value={cat.value} className="text-xs sm:text-sm">
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Equipment List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {filteredEquipment.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No se encontro equipamiento
            </div>
          ) : (
            filteredEquipment.map((equipment) => (
              <EquipmentCard
                key={equipment.id}
                equipment={equipment}
                isSelected={selectedId === equipment.id}
                onSelect={() => handleSelect(equipment)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {filteredEquipment.length} equipos encontrados
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleConfirm} disabled={!selectedId}>
                Usar este equipo
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Datos e imagenes obtenidos de las webs oficiales de cada marca.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function EquipmentCard({
  equipment,
  isSelected,
  onSelect,
}: {
  equipment: CatalogEquipment
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-lg border transition-all ${
        isSelected
          ? "border-primary bg-primary/5 ring-1 ring-primary"
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Equipment Image */}
        <div className="flex-shrink-0">
          <img
            src={equipment.image_url}
            alt={equipment.name}
            className="w-20 h-20 object-contain rounded-lg bg-muted/30"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium truncate">{equipment.name}</h4>
            {isSelected && (
              <Check className="h-4 w-4 text-primary flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {equipment.brand}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-2">
            <Badge variant="secondary" className="text-xs">
              {typeLabels[equipment.type]}
            </Badge>
            {equipment.subtype && (
              <Badge variant="outline" className="text-xs">
                {subtypeLabels[equipment.subtype]}
              </Badge>
            )}
            {equipment.price_range && (
              <Badge variant="outline" className="text-xs">
                {equipment.price_range}
              </Badge>
            )}
          </div>

          {equipment.features && (
            <div className="flex flex-wrap gap-1">
              {equipment.features.slice(0, 3).map((feature) => (
                <span
                  key={feature}
                  className="text-xs px-2 py-0.5 bg-muted rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {equipment.description && (
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
          {equipment.description}
        </p>
      )}
    </button>
  )
}
