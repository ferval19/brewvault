"use client"

import { useState } from "react"
import { X, ChevronRight, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { flavorWheel, type FlavorCategory, type FlavorSubcategory } from "@/lib/data/flavor-wheel"

interface FlavorWheelSelectorProps {
  selected: string[]
  onChange: (descriptors: string[]) => void
}

type Level = "categories" | "subcategories" | "descriptors"

export function FlavorWheelSelector({ selected, onChange }: FlavorWheelSelectorProps) {
  const [level, setLevel] = useState<Level>("categories")
  const [activeCategory, setActiveCategory] = useState<FlavorCategory | null>(null)
  const [activeSubcategory, setActiveSubcategory] = useState<FlavorSubcategory | null>(null)

  function toggleDescriptor(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  function removeDescriptor(value: string) {
    onChange(selected.filter((v) => v !== value))
  }

  function getLabelForValue(value: string): string {
    for (const cat of flavorWheel) {
      for (const sub of cat.subcategories) {
        const d = sub.descriptors.find((d) => d.value === value)
        if (d) return d.label
      }
    }
    return value
  }

  function getCategoryForValue(value: string): FlavorCategory | undefined {
    return flavorWheel.find((cat) =>
      cat.subcategories.some((sub) => sub.descriptors.some((d) => d.value === value))
    )
  }

  function selectCategory(cat: FlavorCategory) {
    setActiveCategory(cat)
    setLevel("subcategories")
  }

  function selectSubcategory(sub: FlavorSubcategory) {
    setActiveSubcategory(sub)
    setLevel("descriptors")
  }

  function goBack() {
    if (level === "descriptors") {
      setLevel("subcategories")
      setActiveSubcategory(null)
    } else if (level === "subcategories") {
      setLevel("categories")
      setActiveCategory(null)
    }
  }

  const selectedByCategory = flavorWheel.reduce((acc, cat) => {
    const count = selected.filter((v) =>
      cat.subcategories.some((sub) => sub.descriptors.some((d) => d.value === v))
    ).length
    acc[cat.value] = count
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-4">
      {/* Selected descriptors */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((value) => {
            const cat = getCategoryForValue(value)
            return (
              <span
                key={value}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
                  cat?.borderColor || "border-border",
                  cat?.bgColor || "bg-muted/50",
                  cat?.color || "text-foreground"
                )}
              >
                {cat?.emoji} {getLabelForValue(value)}
                <button
                  type="button"
                  onClick={() => removeDescriptor(value)}
                  className="opacity-60 hover:opacity-100 transition-opacity ml-0.5"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            )
          })}
        </div>
      )}

      {/* Wheel navigator */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        {/* Breadcrumb header */}
        {level !== "categories" && (
          <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              {level === "subcategories" ? "Categorías" : activeCategory?.label}
            </button>
            {level === "descriptors" && activeSubcategory && (
              <>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm font-medium">{activeSubcategory.label}</span>
              </>
            )}
          </div>
        )}

        <div className="p-3">
          {/* Level 1: Categories */}
          {level === "categories" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {flavorWheel.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => selectCategory(cat)}
                  className={cn(
                    "relative flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-center",
                    cat.bgColor,
                    cat.borderColor,
                    cat.color
                  )}
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="text-xs font-medium leading-tight">{cat.label}</span>
                  {selectedByCategory[cat.value] > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                      {selectedByCategory[cat.value]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Level 2: Subcategories */}
          {level === "subcategories" && activeCategory && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {activeCategory.subcategories.map((sub) => {
                const subSelected = selected.filter((v) =>
                  sub.descriptors.some((d) => d.value === v)
                ).length
                return (
                  <button
                    key={sub.value}
                    type="button"
                    onClick={() => selectSubcategory(sub)}
                    className={cn(
                      "relative flex items-center justify-between gap-2 p-3 rounded-xl border transition-all text-left",
                      activeCategory.bgColor,
                      activeCategory.borderColor,
                      activeCategory.color
                    )}
                  >
                    <span className="text-sm font-medium">{sub.label}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      {subSelected > 0 && (
                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                          {subSelected}
                        </span>
                      )}
                      <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Level 3: Descriptors */}
          {level === "descriptors" && activeSubcategory && activeCategory && (
            <div className="flex flex-wrap gap-2">
              {activeSubcategory.descriptors.map((descriptor) => {
                const isSelected = selected.includes(descriptor.value)
                return (
                  <button
                    key={descriptor.value}
                    type="button"
                    onClick={() => toggleDescriptor(descriptor.value)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
                      isSelected
                        ? cn("bg-primary text-primary-foreground border-primary shadow-sm")
                        : cn(activeCategory.bgColor, activeCategory.borderColor, activeCategory.color)
                    )}
                  >
                    {descriptor.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer hint */}
        {level === "categories" && (
          <p className="text-xs text-muted-foreground text-center py-2 border-t bg-muted/20">
            Toca una categoría para explorar descriptores
          </p>
        )}
      </div>
    </div>
  )
}
