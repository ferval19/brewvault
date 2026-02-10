import { notFound } from "next/navigation"
import { getBean } from "../actions"
import { BeanDetailClient } from "./bean-detail-client"

export default async function BeanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getBean(id)

  if (!result.success || !result.data) {
    notFound()
  }

  return <BeanDetailClient bean={result.data} />
}
