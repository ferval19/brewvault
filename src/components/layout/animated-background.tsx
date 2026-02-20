"use client"

/**
 * Slowly drifting glass blobs that sit below all content.
 * Ultra-subtle — just enough to make the background feel alive.
 * GPU-composited via will-change: transform for 60fps on mobile.
 * Respects prefers-reduced-motion via CSS.
 */
export function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      {/* Blob 1 — warm amber, top-left */}
      <div
        className="animated-blob absolute rounded-full"
        style={{
          top: "0%",
          left: "5%",
          width: "55vw",
          height: "55vw",
          background:
            "radial-gradient(circle at 50% 50%, rgba(245,158,11,0.09) 0%, transparent 68%)",
          animation: "blob-drift-1 24s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* Blob 2 — orange, right-center */}
      <div
        className="animated-blob absolute rounded-full"
        style={{
          top: "35%",
          right: "-5%",
          width: "45vw",
          height: "45vw",
          background:
            "radial-gradient(circle at 50% 50%, rgba(251,146,60,0.07) 0%, transparent 68%)",
          animation: "blob-drift-2 30s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* Blob 3 — deep coffee, bottom-center */}
      <div
        className="animated-blob absolute rounded-full"
        style={{
          bottom: "5%",
          left: "20%",
          width: "40vw",
          height: "40vw",
          background:
            "radial-gradient(circle at 50% 50%, rgba(160,107,53,0.08) 0%, transparent 68%)",
          animation: "blob-drift-3 38s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* Blob 4 — crema accent, top-right — dark mode only */}
      <div
        className="animated-blob absolute rounded-full dark:opacity-100 opacity-0"
        style={{
          top: "10%",
          right: "15%",
          width: "30vw",
          height: "30vw",
          background:
            "radial-gradient(circle at 50% 50%, rgba(201,160,94,0.06) 0%, transparent 68%)",
          animation: "blob-drift-2 20s ease-in-out infinite reverse",
          willChange: "transform",
        }}
      />
    </div>
  )
}
