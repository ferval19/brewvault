"use client"

import { useState } from "react"
import { Copy, Check, QrCode, Gauge } from "lucide-react"
import { Button } from "@/components/ui/button"

type Equipment = {
  id: string
  type: string
  brand: string | null
  model: string
  image_url: string | null
}

interface QuickBrewUrlsProps {
  equipment: Equipment[]
  baseUrl: string
}

export function QuickBrewUrls({ equipment, baseUrl }: QuickBrewUrlsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const brewers = equipment.filter(
    (e) => e.type === "brewer" || e.type === "espresso_machine"
  )

  async function copyToClipboard(id: string, url: string) {
    await navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (brewers.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No tienes cafeteras registradas. Anade una en la seccion de Equipo.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {brewers.map((item) => {
        const url = `${baseUrl}/quick-brew/${item.id}`
        const isCopied = copiedId === item.id
        const name = item.brand ? `${item.brand} ${item.model}` : item.model

        return (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border"
          >
            <div className="flex items-center gap-3 min-w-0">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={name}
                  className="w-10 h-10 rounded-lg object-contain bg-white"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Gauge className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div className="min-w-0">
                <p className="font-medium truncate">{name}</p>
                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {url}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => copyToClipboard(item.id, url)}
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4 mr-1.5 text-green-500" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1.5" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </div>
        )
      })}
      <p className="text-xs text-muted-foreground pt-2">
        Usa estas URLs para generar codigos QR o programar etiquetas NFC.
      </p>
    </div>
  )
}
