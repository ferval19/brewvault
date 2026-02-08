"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { deleteBean } from "./actions"

interface DeleteBeanDialogProps {
  beanId: string
  beanName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteBeanDialog({
  beanId,
  beanName,
  open,
  onOpenChange,
}: DeleteBeanDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleDelete() {
    setIsLoading(true)
    const result = await deleteBean(beanId)

    if (result.success) {
      onOpenChange(false)
      router.refresh()
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar cafe</DialogTitle>
          <DialogDescription>
            ¿Estas seguro de que quieres eliminar &quot;{beanName}&quot;? Esta
            accion no se puede deshacer y tambien eliminara todas las
            preparaciones asociadas.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
