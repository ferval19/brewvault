/**
 * Design Tokens - BrewVault (Liquid Glass Edition)
 *
 * Centralized design constants for consistent styling across the app.
 * Inspired by Apple's Liquid Glass design language (WWDC 2025).
 *
 * Color Palette: Coffee-inspired tones
 * - Primary: Rich espresso brown (#6f4726 / coffee-700)
 * - Accent: Warm crema (#c9a05e / crema-500)
 * - Highlight: Golden roast (#b8854a / coffee-400)
 */

// Spacing tokens for consistent vertical rhythm
export const spacing = {
  /** Between major sections */
  section: "space-y-8",
  /** Between cards or content blocks */
  card: "space-y-6",
  /** Between related items */
  group: "space-y-4",
  /** Between small elements */
  compact: "space-y-2",
} as const

// Border radius tokens - Liquid Glass uses generous radii
export const radius = {
  /** Cards, modals, large containers */
  card: "rounded-3xl",
  /** Buttons, inputs, smaller elements */
  button: "rounded-2xl",
  /** Badges, pills, tags */
  badge: "rounded-full",
  /** Form inputs */
  input: "rounded-xl",
  /** Small elements like checkboxes */
  small: "rounded-lg",
} as const

// Shadow tokens - Liquid Glass specular highlights
export const shadows = {
  /** Glass card shadow with specular highlight */
  card: "glass-specular",
  /** Elevated glass elements (modals, dropdowns) */
  elevated: "shadow-xl glass-specular",
  /** FAB and floating buttons - coffee brown glow */
  fab: "shadow-lg shadow-coffee-600/30",
  /** No shadow */
  none: "shadow-none",
} as const

// Glass effect tokens
export const glass = {
  /** Standard glass panel (card, sidebar, nav) */
  panel: "glass-panel",
  /** Subtle glass (backgrounds, secondary elements) */
  subtle: "glass-subtle",
  /** Heavy glass (modals, focused elements) */
  heavy: "glass-heavy",
  /** Glass border only */
  border: "glass-border",
} as const

// Animation tokens
export const animations = {
  /** Default transition for interactive elements */
  default: "transition-all duration-200",
  /** Fast micro-interactions */
  fast: "transition-all duration-150",
  /** Slower, more noticeable transitions */
  slow: "transition-all duration-300",
  /** Card hover lift effect */
  lift: "hover:-translate-y-1",
} as const

// Color scheme tokens (using Tailwind color classes)
export const colors = {
  // Status colors
  status: {
    active: "bg-emerald-500/90 text-white",
    finished: "bg-stone-500/90 text-white",
    archived: "bg-coffee-500/90 text-white",
    lowStock: "bg-red-500/90 text-white",
    wishlist: "bg-purple-500/90 text-white",
  },
  // Stock indicator colors
  stock: {
    good: "bg-green-500",
    warning: "bg-coffee-400",
    low: "bg-red-500",
  },
  // Score colors
  score: {
    excellent: "bg-green-500/90",
    good: "bg-crema-500/90",
    average: "bg-coffee-400/90",
    poor: "bg-stone-500/90",
  },
  // Accent/brand colors - Coffee palette
  brand: {
    primary: "bg-coffee-600",
    primaryGradient: "bg-gradient-to-r from-coffee-600 to-coffee-500",
    primaryHover: "hover:from-coffee-700 hover:to-coffee-600",
    accent: "bg-crema-500",
    accentGradient: "bg-gradient-to-r from-crema-500 to-coffee-400",
  },
  // Coffee-specific semantic colors
  coffee: {
    espresso: "text-coffee-900 dark:text-coffee-100",
    roast: "text-coffee-700 dark:text-coffee-300",
    crema: "text-crema-500 dark:text-crema-400",
    light: "bg-coffee-50 dark:bg-coffee-900/20",
    medium: "bg-coffee-100 dark:bg-coffee-800/30",
  },
} as const

// Typography tokens
export const typography = {
  /** Page titles */
  pageTitle: "text-2xl sm:text-3xl font-bold",
  /** Section titles */
  sectionTitle: "text-lg font-semibold",
  /** Card titles */
  cardTitle: "text-base font-semibold",
  /** Body text */
  body: "text-sm",
  /** Small/caption text */
  caption: "text-xs text-muted-foreground",
  /** Metric values */
  metric: "text-2xl font-bold",
  /** Large metric values */
  metricLarge: "text-4xl sm:text-5xl font-bold",
} as const

// Layout tokens
export const layout = {
  /** Max width for content pages */
  maxWidth: "max-w-4xl mx-auto",
  /** Standard page padding */
  pagePadding: "px-4 sm:px-6 lg:px-8",
  /** Card padding */
  cardPadding: "p-5",
  /** Compact card padding */
  cardPaddingCompact: "p-4",
} as const

// Aspect ratios
export const aspectRatios = {
  /** Card headers */
  cardHeader: "aspect-[16/10]",
  /** Detail page heroes */
  hero: "aspect-[21/9] sm:aspect-[3/1]",
  /** Square images */
  square: "aspect-square",
} as const

// Z-index layers
export const zIndex = {
  base: "z-0",
  dropdown: "z-10",
  sticky: "z-20",
  fixed: "z-30",
  modal: "z-40",
  overlay: "z-50",
} as const

// Breakpoint-aware utilities
export const responsive = {
  /** Hide on mobile, show on desktop */
  desktopOnly: "hidden md:block",
  /** Show on mobile, hide on desktop */
  mobileOnly: "md:hidden",
  /** Grid columns for different screens */
  grid2to4: "grid-cols-2 sm:grid-cols-4",
  grid1to2: "grid-cols-1 sm:grid-cols-2",
  grid2to3: "grid-cols-2 sm:grid-cols-3",
} as const
