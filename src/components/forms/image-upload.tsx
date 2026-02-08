"use client"

import { useState, useRef } from "react"
import { Camera, Upload, X, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { uploadCoffeePhoto, deleteCoffeePhoto } from "@/app/(dashboard)/beans/actions"

interface ImageUploadProps {
  value?: string | null
  onChange: (url: string | null) => void
  disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten imagenes")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen debe ser menor a 5MB")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const result = await uploadCoffeePhoto(formData)

      if (result.success) {
        onChange(result.data)
      } else {
        setError(result.error)
      }
    } catch {
      setError("Error al subir la imagen")
    } finally {
      setIsUploading(false)
      // Reset inputs
      if (fileInputRef.current) fileInputRef.current.value = ""
      if (cameraInputRef.current) cameraInputRef.current.value = ""
    }
  }

  async function handleRemove() {
    if (!value) return

    setIsUploading(true)
    setError(null)

    try {
      const result = await deleteCoffeePhoto(value)
      if (result.success) {
        onChange(null)
      } else {
        setError(result.error)
      }
    } catch {
      setError("Error al eliminar la imagen")
    } finally {
      setIsUploading(false)
    }
  }

  if (value) {
    return (
      <div className="space-y-2">
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
          <img
            src={value}
            alt="Foto del cafe"
            className="w-full h-full object-cover"
          />
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={handleRemove}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {/* Camera button (mobile) */}
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => cameraInputRef.current?.click()}
          disabled={disabled || isUploading}
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Camera className="mr-2 h-4 w-4" />
          )}
          Camara
        </Button>

        {/* File upload button */}
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          Galeria
        </Button>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">
        Formatos: JPG, PNG, WebP. Maximo 5MB.
      </p>
    </div>
  )
}
