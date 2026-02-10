"use client"

import { useState } from "react"
import { Search, Coffee, Star, MapPin, Check } from "lucide-react"

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
  coffeeCatalog,
  catalogCategories,
  type CatalogCoffee,
} from "@/lib/data/coffee-catalog"

interface CoffeeCatalogPickerProps {
  onSelect: (coffee: CatalogCoffee) => void
}

const categoryLabels: Record<string, string> = {
  specialty: "Especialidad",
  single_origin: "Single Origin",
  commercial: "Comercial",
}

const roastLevelLabels: Record<string, string> = {
  light: "Claro",
  "medium-light": "Medio-Claro",
  medium: "Medio",
  "medium-dark": "Medio-Oscuro",
  dark: "Oscuro",
}

export function CoffeeCatalogPicker({ onSelect }: CoffeeCatalogPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filteredCoffees = coffeeCatalog.filter((coffee) => {
    const matchesSearch =
      search === "" ||
      coffee.name.toLowerCase().includes(search.toLowerCase()) ||
      coffee.roaster.toLowerCase().includes(search.toLowerCase()) ||
      coffee.origin_country.toLowerCase().includes(search.toLowerCase()) ||
      coffee.flavor_notes.some((note) =>
        note.toLowerCase().includes(search.toLowerCase())
      )

    const matchesCategory =
      category === "all" || coffee.category === category

    return matchesSearch && matchesCategory
  })

  function handleSelect(coffee: CatalogCoffee) {
    setSelectedId(coffee.id)
  }

  function handleConfirm() {
    const selected = coffeeCatalog.find((c) => c.id === selectedId)
    if (selected) {
      onSelect(selected)
      setOpen(false)
      setSearch("")
      setCategory("all")
      setSelectedId(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Coffee className="mr-2 h-4 w-4" />
          Elegir del catalogo
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-2xl h-[90vh] sm:h-auto sm:max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Catálogo de Cafés</DialogTitle>
          <DialogDescription>
            Selecciona un cafe del catalogo para prellenar el formulario
          </DialogDescription>
        </DialogHeader>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 py-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, tostador, origen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Tabs value={category} onValueChange={setCategory} className="w-full sm:w-auto">
            <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:flex">
              {catalogCategories.map((cat) => (
                <TabsTrigger key={cat.value} value={cat.value} className="text-xs sm:text-sm">
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Coffee List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {filteredCoffees.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron cafés
            </div>
          ) : (
            filteredCoffees.map((coffee) => (
              <CoffeeCard
                key={coffee.id}
                coffee={coffee}
                isSelected={selectedId === coffee.id}
                onSelect={() => handleSelect(coffee)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {filteredCoffees.length} cafés encontrados
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleConfirm} disabled={!selectedId}>
                Usar este cafe
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

function CoffeeCard({
  coffee,
  isSelected,
  onSelect,
}: {
  coffee: CatalogCoffee
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
        {/* Coffee Image */}
        <div className="flex-shrink-0">
          <img
            src={coffee.image_url}
            alt={coffee.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium truncate">{coffee.name}</h4>
            {isSelected && (
              <Check className="h-4 w-4 text-primary flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {coffee.roaster}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-2">
            <Badge variant="secondary" className="text-xs">
              {categoryLabels[coffee.category]}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              {coffee.origin_country}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {roastLevelLabels[coffee.roast_level]}
            </Badge>
            {coffee.sca_score && (
              <Badge variant="outline" className="text-xs">
                <Star className="h-3 w-3 mr-1 text-amber-500" />
                SCA {coffee.sca_score}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {coffee.flavor_notes.slice(0, 4).map((note) => (
              <span
                key={note}
                className="text-xs px-2 py-0.5 bg-muted rounded-full"
              >
                {note}
              </span>
            ))}
          </div>
        </div>
      </div>

      {coffee.description && (
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
          {coffee.description}
        </p>
      )}
    </button>
  )
}
