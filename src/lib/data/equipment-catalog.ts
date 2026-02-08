export interface CatalogEquipment {
  id: string
  name: string
  brand: string
  model: string
  type: "grinder" | "brewer" | "espresso_machine" | "kettle" | "scale" | "accessory"
  subtype?: "super_automatic" | "semi_automatic" | "manual" | "electric"
  description: string
  features?: string[]
  price_range?: string
  image_url: string
}

export const equipmentCatalog: CatalogEquipment[] = [
  // === INCAPTO CAFETERAS ===
  {
    id: "incapto-juno",
    name: "INCAPTO Juno",
    brand: "INCAPTO",
    model: "Juno",
    type: "espresso_machine",
    subtype: "semi_automatic",
    description: "Ideal para vivir tu primera experiencia barista. Cafetera semiautomatica de entrada.",
    features: ["Primera experiencia barista", "Facil de usar", "Compacta"],
    price_range: "€99 - €179",
    image_url: "https://storage.googleapis.com/incapto-production-web-storage/wp-content/uploads/2025/06/f5a93b1f-incapto-juno-1.png",
  },
  {
    id: "incapto-aura-negra",
    name: "INCAPTO Aura Negra",
    brand: "INCAPTO",
    model: "Aura Negra",
    type: "espresso_machine",
    subtype: "super_automatic",
    description: "Cafe recien molido en un solo clic. Superautomatica con molinillo integrado.",
    features: ["Molinillo integrado", "Un solo clic", "Pantalla tactil"],
    price_range: "€199 - €389",
    image_url: "https://storage.googleapis.com/incapto-production-web-storage/wp-content/uploads/2024/02/6af61342-incapto-aura-black.png",
  },
  {
    id: "incapto-aura-blanca",
    name: "INCAPTO Aura Blanca",
    brand: "INCAPTO",
    model: "Aura Blanca",
    type: "espresso_machine",
    subtype: "super_automatic",
    description: "Cafe recien molido en un solo clic. Version blanca elegante.",
    features: ["Molinillo integrado", "Un solo clic", "Diseno blanco"],
    price_range: "€199 - €399",
    image_url: "https://storage.googleapis.com/incapto-production-web-storage/wp-content/uploads/2024/02/fb747f54-incapto-aura-white.png",
  },
  {
    id: "incapto-aura-milk",
    name: "INCAPTO Aura Milk",
    brand: "INCAPTO",
    model: "Aura Milk",
    type: "espresso_machine",
    subtype: "super_automatic",
    description: "Ideal para amantes del cafe con leche. Incluye sistema de espumado automatico.",
    features: ["Espumador automatico", "Cafe con leche", "Un toque"],
    price_range: "€249 - €399",
    image_url: "https://storage.googleapis.com/incapto-production-web-storage/wp-content/uploads/2024/10/90df6a92-cafetera-incapto-aura-milk-en-cocina.png",
  },
  {
    id: "incapto-duo",
    name: "INCAPTO Duo",
    brand: "INCAPTO",
    model: "Duo",
    type: "espresso_machine",
    subtype: "super_automatic",
    description: "Para tomar mas de un tipo de cafe con una sola cafetera. Dos tolvas de cafe.",
    features: ["Dos tolvas", "Multiples perfiles", "Versatil"],
    price_range: "€289 - €449",
    image_url: "https://storage.googleapis.com/incapto-production-web-storage/wp-content/uploads/2025/10/4b82fd2f-es-preventa-incapto-duo.png",
  },
  {
    id: "incapto-sabi-black",
    name: "INCAPTO Sabi Black",
    brand: "INCAPTO",
    model: "Sabi Black",
    type: "espresso_machine",
    subtype: "semi_automatic",
    description: "Ritual barista sin complicaciones. Cafetera semiautomatica premium.",
    features: ["Experiencia barista", "Control manual", "Diseno premium"],
    price_range: "€449 - €699",
    image_url: "https://storage.googleapis.com/incapto-production-web-storage/wp-content/uploads/2025/10/11b485c1-incapto-sabi-black.png",
  },
  {
    id: "incapto-sabi-metal",
    name: "INCAPTO Sabi Metal",
    brand: "INCAPTO",
    model: "Sabi Metal",
    type: "espresso_machine",
    subtype: "semi_automatic",
    description: "Ritual barista sin complicaciones. Version metalizada premium.",
    features: ["Experiencia barista", "Control manual", "Acabado metalico"],
    price_range: "€449 - €699",
    image_url: "https://storage.googleapis.com/incapto-production-web-storage/wp-content/uploads/2025/10/0e33a169-incapto-sabi-metal.png",
  },

  // === INCAPTO MOLINILLOS ===
  {
    id: "incapto-onyx",
    name: "INCAPTO Onyx",
    brand: "INCAPTO",
    model: "Onyx",
    type: "grinder",
    subtype: "electric",
    description: "Molinillo electrico para consumir cafe en grano sin cafetera superautomatica.",
    features: ["Muelas conicas", "Ajuste de molienda", "Compacto"],
    price_range: "€119 - €189",
    image_url: "https://storage.googleapis.com/incapto-production-web-storage/wp-content/uploads/2024/11/cc62480e-molinillo-de-cafe-electrico.png",
  },

  // === SAGE CAFETERAS ===
  {
    id: "sage-barista-express",
    name: "Sage Barista Express",
    brand: "Sage",
    model: "Barista Express",
    type: "espresso_machine",
    subtype: "semi_automatic",
    description: "Resultado profesional de manera facil. Molinillo integrado con dosificacion.",
    features: ["Molinillo integrado", "Control de temperatura", "Vaporizador"],
    price_range: "€579 - €729",
    image_url: "https://storage.googleapis.com/incapto-production-web-storage/wp-content/uploads/2025/03/8bebf253-sage-barista-express.png",
  },
  {
    id: "sage-barista-pro",
    name: "Sage Barista Pro",
    brand: "Sage",
    model: "Barista Pro",
    type: "espresso_machine",
    subtype: "semi_automatic",
    description: "Resultado profesional con funcionamiento facil. Pantalla LCD y calentamiento rapido.",
    features: ["Pantalla LCD", "ThermoJet 3 seg", "Molinillo integrado"],
    price_range: "€729 - €829",
    image_url: "https://storage.googleapis.com/incapto-production-web-storage/wp-content/uploads/2023/03/sage-1.png",
  },
  {
    id: "sage-barista-pro-trufa",
    name: "Sage Barista Pro Trufa Negra",
    brand: "Sage",
    model: "Barista Pro Trufa Negra",
    type: "espresso_machine",
    subtype: "semi_automatic",
    description: "Version en color trufa negra del Barista Pro. Elegancia y rendimiento.",
    features: ["Pantalla LCD", "ThermoJet 3 seg", "Acabado trufa negra"],
    price_range: "€729 - €829",
    image_url: "https://storage.googleapis.com/incapto-production-web-storage/wp-content/uploads/2024/11/a3485819-cafetera-sage-barista-pro-negra.png",
  },
  {
    id: "sage-barista-express-impress",
    name: "Sage Barista Express Impress",
    brand: "Sage",
    model: "Barista Express Impress",
    type: "espresso_machine",
    subtype: "semi_automatic",
    description: "Experiencia barista sin complicaciones. Sistema Impress de tamper asistido.",
    features: ["Tamper asistido", "Molinillo integrado", "Facil limpieza"],
    price_range: "€629 - €729",
    image_url: "https://storage.googleapis.com/incapto-production-web-storage/wp-content/uploads/2024/03/24dda90b-sage-barista-express-impress.png",
  },
]

export const equipmentBrands = [
  ...new Set(equipmentCatalog.map((e) => e.brand)),
].sort()

export const equipmentTypes = [
  { value: "espresso_machine", label: "Cafetera Espresso" },
  { value: "grinder", label: "Molinillo" },
  { value: "kettle", label: "Hervidor" },
  { value: "scale", label: "Bascula" },
  { value: "brewer", label: "Cafetera de Filtro" },
  { value: "accessory", label: "Accesorio" },
] as const
