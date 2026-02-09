import { notFound } from "next/navigation"
import { MapPin, Globe, Star, Coffee } from "lucide-react"

import {
  DetailPageHero,
  DetailBadge,
  DetailSection,
} from "@/components/ui/detail-page"

import { getRoaster } from "../actions"

export default async function RoasterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getRoaster(id)

  if (!result.success || !result.data) {
    notFound()
  }

  const roaster = result.data
  const location = [roaster.city, roaster.country].filter(Boolean).join(", ")

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hero Section */}
      <DetailPageHero
        title={roaster.name}
        backHref="/roasters"
        editHref={`/roasters/${id}/edit`}
        gradient="from-stone-600/20 to-amber-700/20"
        fallbackIcon={<Coffee className="h-24 w-24 text-stone-600 opacity-20" />}
        badges={
          <>
            {location && (
              <DetailBadge>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {location}
                </span>
              </DetailBadge>
            )}
            {roaster.rating && (
              <DetailBadge variant="amber">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current" />
                  {roaster.rating}/5
                </span>
              </DetailBadge>
            )}
          </>
        }
      />

      {/* Website Link */}
      {roaster.website && (
        <a
          href={roaster.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 rounded-2xl bg-card border hover:bg-muted/50 transition-colors"
        >
          <div className="p-3 rounded-xl bg-primary/10">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium">Sitio web</p>
            <p className="text-sm text-muted-foreground truncate">{roaster.website}</p>
          </div>
        </a>
      )}

      {/* Notes */}
      {roaster.notes && (
        <DetailSection title="Notas">
          <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {roaster.notes}
          </p>
        </DetailSection>
      )}
    </div>
  )
}
