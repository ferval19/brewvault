export interface TourStep {
  id: string
  type: "modal" | "tooltip"
  targetId?: string
  title: string
  description: string
  position?: "top" | "bottom" | "left" | "right"
}

export const tourSteps: TourStep[] = [
  {
    id: "welcome",
    type: "modal",
    title: "Bienvenido a BrewVault",
    description:
      "Tu diario personal de cafe. Registra tus preparaciones, gestiona tu coleccion de cafes y mejora tu rutina cafetera.",
  },
  {
    id: "quick-actions",
    type: "tooltip",
    targetId: "quick-actions",
    title: "Acciones rapidas",
    description:
      "Accesos directos para registrar una nueva preparacion o anadir un cafe a tu coleccion.",
    position: "bottom",
  },
  {
    id: "stats-grid",
    type: "tooltip",
    targetId: "stats-grid",
    title: "Tu coleccion en numeros",
    description:
      "Aqui ves un resumen de tu coleccion: cafes activos, preparaciones, equipos y catas.",
    position: "bottom",
  },
  {
    id: "charts",
    type: "tooltip",
    targetId: "charts",
    title: "Graficas y tendencias",
    description:
      "Visualiza tu actividad diaria, ratings promedio y consumo de cafe a lo largo del tiempo.",
    position: "top",
  },
  {
    id: "sidebar-nav",
    type: "tooltip",
    targetId: "sidebar-nav",
    title: "Navegacion",
    description:
      "Navega entre las secciones: Preparaciones, Cafes, Equipo, Catas y Ajustes.",
    position: "right",
  },
  {
    id: "fab-button",
    type: "tooltip",
    targetId: "fab-button",
    title: "Crear rapido",
    description:
      "Usa este boton para crear rapidamente una nueva preparacion o cafe.",
    position: "top",
  },
  {
    id: "completed",
    type: "modal",
    title: "Todo listo!",
    description:
      "Ya conoces lo basico de BrewVault. Puedes repetir este tour en cualquier momento desde Ajustes.",
  },
]
