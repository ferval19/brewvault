export type FlavorDescriptor = {
  value: string
  label: string
}

export type FlavorSubcategory = {
  value: string
  label: string
  descriptors: FlavorDescriptor[]
}

export type FlavorCategory = {
  value: string
  label: string
  emoji: string
  color: string
  bgColor: string
  borderColor: string
  subcategories: FlavorSubcategory[]
}

export const flavorWheel: FlavorCategory[] = [
  {
    value: "floral",
    label: "Floral",
    emoji: "🌸",
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-500/10 hover:bg-pink-500/20",
    borderColor: "border-pink-500/30",
    subcategories: [
      {
        value: "black_tea",
        label: "Té negro",
        descriptors: [{ value: "te_negro", label: "Té negro" }],
      },
      {
        value: "floral_notes",
        label: "Flores",
        descriptors: [
          { value: "manzanilla", label: "Manzanilla" },
          { value: "rosa", label: "Rosa" },
          { value: "jazmin", label: "Jazmín" },
          { value: "lavanda", label: "Lavanda" },
        ],
      },
    ],
  },
  {
    value: "fruity",
    label: "Frutal",
    emoji: "🍒",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-500/10 hover:bg-red-500/20",
    borderColor: "border-red-500/30",
    subcategories: [
      {
        value: "berry",
        label: "Bayas",
        descriptors: [
          { value: "mora", label: "Mora" },
          { value: "frambuesa", label: "Frambuesa" },
          { value: "arandano", label: "Arándano" },
          { value: "fresa", label: "Fresa" },
        ],
      },
      {
        value: "dried_fruit",
        label: "Fruta seca",
        descriptors: [
          { value: "pasa", label: "Pasa" },
          { value: "ciruela_pasa", label: "Ciruela pasa" },
          { value: "datil", label: "Dátil" },
        ],
      },
      {
        value: "other_fruit",
        label: "Otras frutas",
        descriptors: [
          { value: "cereza", label: "Cereza" },
          { value: "granada", label: "Granada" },
          { value: "pina", label: "Piña" },
          { value: "uva", label: "Uva" },
          { value: "manzana", label: "Manzana" },
          { value: "melocoton", label: "Melocotón" },
          { value: "pera", label: "Pera" },
          { value: "mango", label: "Mango" },
          { value: "maracuya", label: "Maracuyá" },
        ],
      },
      {
        value: "citrus",
        label: "Cítricos",
        descriptors: [
          { value: "pomelo", label: "Pomelo" },
          { value: "naranja", label: "Naranja" },
          { value: "limon", label: "Limón" },
          { value: "lima", label: "Lima" },
          { value: "mandarina", label: "Mandarina" },
        ],
      },
    ],
  },
  {
    value: "sweet",
    label: "Dulce",
    emoji: "🍯",
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-500/10 hover:bg-yellow-500/20",
    borderColor: "border-yellow-500/30",
    subcategories: [
      {
        value: "brown_sugar",
        label: "Azúcar moreno",
        descriptors: [
          { value: "melaza", label: "Melaza" },
          { value: "jarabe_arce", label: "Jarabe de arce" },
          { value: "caramelo", label: "Caramelo" },
          { value: "miel", label: "Miel" },
          { value: "panela", label: "Panela" },
        ],
      },
      {
        value: "vanilla",
        label: "Vainilla",
        descriptors: [
          { value: "vainilla", label: "Vainilla" },
          { value: "crema", label: "Crema" },
        ],
      },
      {
        value: "candy",
        label: "Dulces",
        descriptors: [
          { value: "caramelo_blando", label: "Caramelo blando" },
          { value: "toffee", label: "Toffee" },
          { value: "buñuelo", label: "Buñuelo" },
        ],
      },
    ],
  },
  {
    value: "nutty_cocoa",
    label: "Frutos secos / Cacao",
    emoji: "🍫",
    color: "text-amber-700 dark:text-amber-500",
    bgColor: "bg-amber-700/10 hover:bg-amber-700/20",
    borderColor: "border-amber-700/30",
    subcategories: [
      {
        value: "nutty",
        label: "Frutos secos",
        descriptors: [
          { value: "cacahuete", label: "Cacahuete" },
          { value: "avellana", label: "Avellana" },
          { value: "almendra", label: "Almendra" },
          { value: "nuez", label: "Nuez" },
          { value: "coco", label: "Coco" },
        ],
      },
      {
        value: "cocoa",
        label: "Cacao",
        descriptors: [
          { value: "chocolate", label: "Chocolate" },
          { value: "chocolate_negro", label: "Chocolate negro" },
          { value: "cacao", label: "Cacao" },
          { value: "chocolate_con_leche", label: "Chocolate con leche" },
        ],
      },
    ],
  },
  {
    value: "spices",
    label: "Especias",
    emoji: "🌶️",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-500/10 hover:bg-orange-500/20",
    borderColor: "border-orange-500/30",
    subcategories: [
      {
        value: "brown_spice",
        label: "Especias cálidas",
        descriptors: [
          { value: "canela", label: "Canela" },
          { value: "nuez_moscada", label: "Nuez moscada" },
          { value: "clavo", label: "Clavo" },
          { value: "cardamomo", label: "Cardamomo" },
          { value: "anis", label: "Anís" },
        ],
      },
      {
        value: "pungent",
        label: "Picante",
        descriptors: [
          { value: "pimienta", label: "Pimienta" },
          { value: "jengibre", label: "Jengibre" },
        ],
      },
    ],
  },
  {
    value: "roasted",
    label: "Tostado",
    emoji: "☕",
    color: "text-stone-600 dark:text-stone-400",
    bgColor: "bg-stone-500/10 hover:bg-stone-500/20",
    borderColor: "border-stone-500/30",
    subcategories: [
      {
        value: "cereal",
        label: "Cereal",
        descriptors: [
          { value: "cereal", label: "Cereal" },
          { value: "malta", label: "Malta" },
          { value: "pan_tostado", label: "Pan tostado" },
          { value: "galleta", label: "Galleta" },
        ],
      },
      {
        value: "burnt",
        label: "Quemado",
        descriptors: [
          { value: "acre", label: "Acre" },
          { value: "ceniza", label: "Ceniza" },
          { value: "ahumado", label: "Ahumado" },
          { value: "tostado_oscuro", label: "Tostado oscuro" },
          { value: "carbon", label: "Carbón" },
        ],
      },
      {
        value: "tobacco",
        label: "Tabaco",
        descriptors: [
          { value: "tabaco", label: "Tabaco" },
          { value: "tabaco_pipa", label: "Tabaco de pipa" },
          { value: "cuero", label: "Cuero" },
        ],
      },
    ],
  },
  {
    value: "green_vegetative",
    label: "Verde / Vegetal",
    emoji: "🌿",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-500/10 hover:bg-green-500/20",
    borderColor: "border-green-500/30",
    subcategories: [
      {
        value: "herb",
        label: "Hierbas",
        descriptors: [
          { value: "hierba", label: "Hierba" },
          { value: "heno", label: "Heno" },
          { value: "te_verde", label: "Té verde" },
          { value: "menta", label: "Menta" },
          { value: "albahaca", label: "Albahaca" },
        ],
      },
      {
        value: "raw",
        label: "Crudo / Verde",
        descriptors: [
          { value: "verde", label: "Verde" },
          { value: "guisante", label: "Guisante" },
          { value: "pepino", label: "Pepino" },
          { value: "legumbre", label: "Legumbre" },
        ],
      },
    ],
  },
  {
    value: "sour_fermented",
    label: "Ácido / Fermentado",
    emoji: "🍋",
    color: "text-lime-600 dark:text-lime-400",
    bgColor: "bg-lime-500/10 hover:bg-lime-500/20",
    borderColor: "border-lime-500/30",
    subcategories: [
      {
        value: "sour",
        label: "Ácido",
        descriptors: [
          { value: "acido_citrico", label: "Ácido cítrico" },
          { value: "acido_malico", label: "Ácido málico" },
          { value: "acido_acetico", label: "Ácido acético" },
          { value: "vinagre", label: "Vinagre" },
        ],
      },
      {
        value: "fermented",
        label: "Fermentado",
        descriptors: [
          { value: "fermentado", label: "Fermentado" },
          { value: "vinagroso", label: "Vinagroso" },
          { value: "whisky", label: "Whisky" },
          { value: "vino", label: "Vino" },
          { value: "kombucha", label: "Kombucha" },
        ],
      },
    ],
  },
]

export function getAllDescriptorLabels(): Record<string, string> {
  const map: Record<string, string> = {}
  flavorWheel.forEach((cat) =>
    cat.subcategories.forEach((sub) =>
      sub.descriptors.forEach((d) => {
        map[d.value] = d.label
      })
    )
  )
  return map
}
