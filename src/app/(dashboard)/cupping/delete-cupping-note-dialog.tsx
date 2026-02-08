"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Loader2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

import { deleteCuppingNote } from "./actions"

interface DeleteCuppingNoteDialogProps {
  noteId: string
  beanName: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DeleteCuppingNoteDialog({
  noteId,
  beanName,
  open: controlledOpen,
  onOpenChange,
}: DeleteCuppingNoteDialogProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [internalOpen, setInternalOpen] = useState(false)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? (onOpenChange || (() => {})) : setInternalOpen

  async function handleDelete() {
    setIsDeleting(true)
    const result = await deleteCuppingNote(noteId)

    if (result.success) {
      setOpen(false)
      router.refresh()
    } else {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar nota de cata</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estas seguro de que quieres eliminar la nota de cata de &quot;{beanName}&quot;? Esta accion no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
