"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Star, Trash2, Pencil, Plus, Coffee, Zap, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getBrewMethodConfig } from "@/lib/brew-methods"
import { brewMethods } from "@/lib/validations/brews"
import { createFavoriteBrew, deleteFavoriteBrew, createBrew, type FavoriteBrew, type BeanOption } from "./actions"

interface FavoritesSectionProps {
  favorites: FavoriteBrew[]
  beans: BeanOption[]
}

export function FavoritesSection({ favorites, beans }: FavoritesSectionProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingFavorite, setEditingFavorite] = useState<FavoriteBrew | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    brew_method: "v60",
    dose_grams: 15,
    water_grams: 250,
    water_temperature: 93,
    grind_size: "",
    total_time_seconds: 180,
    bean_id: "",
  })

  function resetForm() {
    setFormData({
      name: "",
      brew_method: "v60",
      dose_grams: 15,
      water_grams: 250,
      water_temperature: 93,
      grind_size: "",
      total_time_seconds: 180,
      bean_id: "",
    })
  }

  function openEditDialog(favorite: FavoriteBrew) {
    setEditingFavorite(favorite)
    setFormData({
      name: favorite.name,
      brew_method: favorite.brew_method,
      dose_grams: favorite.dose_grams || 15,
      water_grams: favorite.water_grams || 250,
      water_temperature: favorite.water_temperature || 93,
      grind_size: favorite.grind_size || "",
      total_time_seconds: favorite.total_time_seconds || 180,
      bean_id: favorite.bean_id || "",
    })
    setShowAddDialog(true)
  }

  async function handleSave() {
    if (!formData.name.trim()) {
      setError("El nombre es requerido")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      if (editingFavorite) {
        // Delete and recreate (simple approach)
        await deleteFavoriteBrew(editingFavorite.id)
      }

      const result = await createFavoriteBrew({
        name: formData.name,
        brew_method: formData.brew_method,
        dose_grams: formData.dose_grams,
        water_grams: formData.water_grams,
        water_temperature: formData.water_temperature,
        grind_size: formData.grind_size || null,
        total_time_seconds: formData.total_time_seconds,
        bean_id: formData.bean_id || null,
      })

      if (!result.success) {
        setError(result.error)
        return
      }

      setShowAddDialog(false)
      setEditingFavorite(null)
      resetForm()
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: string) {
    setIsLoading(true)
    await deleteFavoriteBrew(id)
    setDeleteConfirm(null)
    setIsLoading(false)
    router.refresh()
  }

  async function handleQuickBrew(favorite: FavoriteBrew) {
    if (!favorite.bean_id) {
      setError("Esta receta no tiene cafe asociado. Editala para asignar uno.")
      return
    }

    const beanExists = beans.some(b => b.id === favorite.bean_id)
    if (!beanExists) {
      setError("El cafe de esta receta ya no esta disponible.")
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await createBrew({
      bean_id: favorite.bean_id,
      brew_method: favorite.brew_method,
      dose_grams: favorite.dose_grams || 15,
      water_grams: favorite.water_grams || 250,
      water_temperature: favorite.water_temperature || null,
      grind_size: favorite.grind_size || null,
      total_time_seconds: favorite.total_time_seconds || null,
      bloom_time_seconds: favorite.bloom_time_seconds || null,
      bloom_water_grams: favorite.bloom_water_grams || null,
      filter_type: favorite.filter_type || null,
      equipment_id: favorite.equipment_id || null,
      grinder_id: favorite.grinder_id || null,
    })

    setIsLoading(false)

    if (!result.success) {
      setError(result.error)
      return
    }

    router.push("/brews")
    router.refresh()
  }

  if (favorites.length === 0 && !showAddDialog) {
    return null
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          <Star className="h-4 w-4" />
          Recetas Favoritas ({favorites.length})
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs"
          onClick={() => {
            resetForm()
            setEditingFavorite(null)
            setShowAddDialog(true)
          }}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Agregar
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-xs underline">
            Cerrar
          </button>
        </div>
      )}

      {/* Horizontal scroll container */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap scrollbar-hide">
          {favorites.map((favorite) => {
            const methodConfig = getBrewMethodConfig(favorite.brew_method)
            const MethodIcon = methodConfig.icon
            const hasBean = favorite.bean_id && beans.some(b => b.id === favorite.bean_id)
            const beanName = favorite.beans?.name

            return (
              <div
                key={favorite.id}
                className="relative flex-shrink-0 w-[200px] sm:w-auto sm:flex-shrink sm:min-w-[180px] sm:max-w-[220px] p-3 rounded-xl border bg-card hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${methodConfig.bgColor}`}>
                    <MethodIcon className={`h-4 w-4 ${methodConfig.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{favorite.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {favorite.dose_grams}g / {favorite.water_grams}g
                    </p>
                    {beanName && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {beanName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex items-center gap-1 mt-2 pt-2 border-t">
                  <Button
                    variant={hasBean ? "default" : "outline"}
                    size="sm"
                    className="flex-1 h-7 text-xs"
                    onClick={() => handleQuickBrew(favorite)}
                    disabled={isLoading || !hasBean}
                    title={hasBean ? "Crear brew con esta receta" : "Asigna un cafe para usar esta receta"}
                  >
                    {hasBean ? (
                      <>
                        <Zap className="h-3 w-3 mr-1" />
                        Preparar
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Sin cafe
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => openEditDialog(favorite)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => setDeleteConfirm(favorite.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={(open) => {
        if (!open) {
          setShowAddDialog(false)
          setEditingFavorite(null)
          resetForm()
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingFavorite ? "Editar receta favorita" : "Nueva receta favorita"}
            </DialogTitle>
            <DialogDescription>
              Guarda tus parametros favoritos para preparar cafe rapidamente
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder="Mi V60 diario"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Metodo</Label>
              <Select
                value={formData.brew_method}
                onValueChange={(value) => setFormData({ ...formData, brew_method: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {brewMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bean">Cafe por defecto</Label>
              <Select
                value={formData.bean_id}
                onValueChange={(value) => setFormData({ ...formData, bean_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un cafe" />
                </SelectTrigger>
                <SelectContent>
                  {beans.map((bean) => (
                    <SelectItem key={bean.id} value={bean.id}>
                      {bean.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                El cafe que se usara al crear una brew rapida
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dose">Dosis (g)</Label>
                <Input
                  id="dose"
                  type="number"
                  value={formData.dose_grams}
                  onChange={(e) => setFormData({ ...formData, dose_grams: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="water">Agua (g)</Label>
                <Input
                  id="water"
                  type="number"
                  value={formData.water_grams}
                  onChange={(e) => setFormData({ ...formData, water_grams: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temp">Temperatura (°C)</Label>
                <Input
                  id="temp"
                  type="number"
                  value={formData.water_temperature}
                  onChange={(e) => setFormData({ ...formData, water_temperature: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Tiempo (seg)</Label>
                <Input
                  id="time"
                  type="number"
                  value={formData.total_time_seconds}
                  onChange={(e) => setFormData({ ...formData, total_time_seconds: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grind">Molienda</Label>
              <Input
                id="grind"
                placeholder="ej. 24 clicks, medio-fino"
                value={formData.grind_size}
                onChange={(e) => setFormData({ ...formData, grind_size: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar favorito</DialogTitle>
            <DialogDescription>
              Esta accion no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              disabled={isLoading}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
