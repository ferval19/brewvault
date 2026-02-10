import { notFound } from "next/navigation"
import { getEquipment } from "../actions"
import { EquipmentDetailClient } from "./equipment-detail-client"

export default async function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getEquipment(id)

  if (!result.success || !result.data) {
    notFound()
  }

  return <EquipmentDetailClient equipment={result.data} />
}
