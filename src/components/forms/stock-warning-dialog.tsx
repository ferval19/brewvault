"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Flag, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getBeanBrewStats, markBeanAsFinished } from "@/app/(dashboard)/beans/actions"

interface StockWarningDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  beanId: string
  beanName: string
  onContinue: () => void
  onFinished: () => void
}

export function StockWarningDialog({
  open,
  onOpenChange,
  beanId,
  beanName,
  onContinue,
  onFinished,
}: StockWarningDialogProps) {
  const [view, setView] = useState<"warning" | "finish">("warning")
  const [stats, setStats] = useState<{ brewCount: number; totalDoseGrams: number } | null>(null)
  const [realWeight, setRealWeight] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setView("warning")
      setStats(null)
      setRealWeight("")
      setError(null)
    }
  }, [open])

  async function handleOpenFinish() {
    setView("finish")
    setIsLoading(true)
    const result = await getBeanBrewStats(beanId)
    if (result.success) {
      setStats(result.data)
      setRealWeight(String(Math.round(result.data.totalDoseGrams)))
    }
    setIsLoading(false)
  }

  async function handleConfirmFinish() {
    const weight = parseFloat(realWeight)
    if (isNaN(weight) || weight <= 0) {
      setError("Introduce un peso válido mayor que 0")
      return
    }
    setIsLoading(true)
    setError(null)
    const result = await markBeanAsFinished(beanId, weight)
    if (result.success) {
      onOpenChange(false)
      onFinished()
    } else {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {view === "warning" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Sin stock registrado
              </DialogTitle>
              <DialogDescription>
                El sistema indica 0g de <strong>{beanName}</strong>, pero puedes continuar
                si aún te queda café.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 pt-2">
              <Button onClick={onContinue} className="w-full">
                Continuar de todas formas
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleOpenFinish}
              >
                <Flag className="mr-2 h-4 w-4" />
                Marcar como terminado
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5" />
                ¿Se acabó el café?
              </DialogTitle>
              <DialogDescription>
                <strong>{beanName}</strong>
              </DialogDescription>
            </DialogHeader>

            {isLoading && !stats ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                {stats && (
                  <div className="rounded-lg bg-muted/50 p-4 space-y-1 text-sm">
                    <p className="text-muted-foreground">Según tu registro:</p>
                    <p>
                      <span className="font-medium">{stats.brewCount}</span> preparaciones realizadas
                    </p>
                    <p>
                      <span className="font-medium">{Math.round(stats.totalDoseGrams)}g</span> utilizados en total
                    </p>
                  </div>
                )}

                <p className="text-sm text-muted-foreground">
                  Parece que tenías más café del que el sistema registraba.
                  ¿Cuántos gramos tenías realmente?
                </p>

                <div className="space-y-2">
                  <Label htmlFor="real-weight">Peso inicial real (g)</Label>
                  <Input
                    id="real-weight"
                    type="number"
                    min="1"
                    step="1"
                    value={realWeight}
                    onChange={(e) => setRealWeight(e.target.value)}
                    placeholder="Ej: 250"
                  />
                  {stats && (
                    <p className="text-xs text-muted-foreground">
                      Pre-rellenado con el total consumido ({Math.round(stats.totalDoseGrams)}g)
                    </p>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    className="flex-1"
                    onClick={handleConfirmFinish}
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirmar y marcar terminado
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setView("warning")}
                    disabled={isLoading}
                  >
                    Volver
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
