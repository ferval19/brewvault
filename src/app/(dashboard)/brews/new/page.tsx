import { Suspense } from "react"
import { BrewForm } from "@/components/forms/brew-form"
import { getActiveBeans, getEquipment, getLastBrew, getFavoriteBrews } from "../actions"

export const metadata = {
  title: "Nueva Preparacion",
}

export default async function NewBrewPage({
  searchParams,
}: {
  searchParams: Promise<{ equipment?: string }>
}) {
  const { equipment: equipmentId } = await searchParams

  const [beansResult, equipmentResult, lastBrewResult, favoritesResult] = await Promise.all([
    getActiveBeans(),
    getEquipment(),
    getLastBrew(),
    getFavoriteBrews(),
  ])

  const beans = beansResult.success ? beansResult.data : []
  const equipment = equipmentResult.success ? equipmentResult.data : []
  const lastBrew = lastBrewResult.success ? lastBrewResult.data : null
  const favorites = favoritesResult.success ? favoritesResult.data : []

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Nueva Preparacion</h1>
        <p className="text-muted-foreground">
          Registra los parametros de tu extraccion
        </p>
      </div>

      <Suspense fallback={<div>Cargando...</div>}>
        <BrewForm
          beans={beans}
          equipment={equipment}
          defaultBrew={lastBrew}
          favorites={favorites}
          defaultEquipmentId={equipmentId}
        />
      </Suspense>
    </div>
  )
}
