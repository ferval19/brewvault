import { cn } from "@/lib/utils"

interface IllustrationProps {
  className?: string
}

// Coffee Beans Illustration
export function CoffeeBeansIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-coffee-600/30", className)}
    >
      {/* Main bean */}
      <ellipse
        cx="60"
        cy="55"
        rx="28"
        ry="38"
        fill="currentColor"
        transform="rotate(-15 60 55)"
      />
      <path
        d="M45 30 C55 45, 55 65, 45 80"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        opacity="0.6"
        transform="rotate(-15 60 55)"
      />
      {/* Second bean */}
      <ellipse
        cx="85"
        cy="75"
        rx="20"
        ry="28"
        fill="currentColor"
        opacity="0.7"
        transform="rotate(25 85 75)"
      />
      <path
        d="M75 55 C82 65, 82 80, 75 92"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.5"
        transform="rotate(25 85 75)"
      />
      {/* Third bean */}
      <ellipse
        cx="35"
        cy="80"
        rx="16"
        ry="22"
        fill="currentColor"
        opacity="0.5"
        transform="rotate(-30 35 80)"
      />
    </svg>
  )
}

// V60 / Pour Over Illustration
export function V60Illustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-coffee-600/30", className)}
    >
      {/* Dripper cone */}
      <path
        d="M30 25 L90 25 L70 95 L50 95 Z"
        fill="currentColor"
        opacity="0.8"
      />
      {/* Ribs inside */}
      <path d="M40 35 L52 85" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <path d="M50 30 L55 85" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <path d="M60 28 L60 88" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <path d="M70 30 L65 85" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <path d="M80 35 L68 85" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      {/* Handle */}
      <path
        d="M90 35 Q105 45, 95 60"
        stroke="currentColor"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      {/* Server below */}
      <path
        d="M42 100 L42 110 Q42 115, 48 115 L72 115 Q78 115, 78 110 L78 100"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        opacity="0.5"
      />
    </svg>
  )
}

// Chemex Illustration
export function ChemexIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-amber-500/40", className)}
    >
      {/* Upper cone */}
      <path
        d="M35 15 L85 15 L68 50 L52 50 Z"
        fill="currentColor"
        opacity="0.7"
      />
      {/* Neck/waist */}
      <rect x="52" y="50" width="16" height="15" fill="currentColor" opacity="0.9" />
      {/* Wood collar */}
      <rect x="48" y="48" width="24" height="8" rx="2" fill="currentColor" opacity="0.6" />
      {/* Lower carafe */}
      <path
        d="M52 65 L38 105 Q36 112, 45 112 L75 112 Q84 112, 82 105 L68 65 Z"
        fill="currentColor"
        opacity="0.8"
      />
      {/* Coffee inside */}
      <path
        d="M55 75 L45 100 Q44 105, 50 105 L70 105 Q76 105, 75 100 L65 75 Z"
        fill="currentColor"
        opacity="0.4"
      />
    </svg>
  )
}

// AeroPress Illustration
export function AeroPressIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-gray-600/40", className)}
    >
      {/* Plunger handle */}
      <rect x="45" y="10" width="30" height="8" rx="2" fill="currentColor" />
      {/* Plunger rod */}
      <rect x="55" y="18" width="10" height="30" fill="currentColor" opacity="0.7" />
      {/* Plunger seal */}
      <rect x="42" y="48" width="36" height="8" rx="2" fill="currentColor" opacity="0.9" />
      {/* Chamber */}
      <rect x="40" y="56" width="40" height="45" rx="3" fill="currentColor" opacity="0.6" />
      {/* Filter cap */}
      <path
        d="M38 101 L82 101 L78 112 L42 112 Z"
        fill="currentColor"
        opacity="0.8"
      />
      {/* Numbers/markings */}
      <line x1="78" y1="65" x2="82" y2="65" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <line x1="78" y1="75" x2="82" y2="75" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <line x1="78" y1="85" x2="82" y2="85" stroke="currentColor" strokeWidth="2" opacity="0.4" />
    </svg>
  )
}

// French Press Illustration
export function FrenchPressIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-amber-700/40", className)}
    >
      {/* Plunger knob */}
      <circle cx="60" cy="15" r="8" fill="currentColor" />
      {/* Plunger rod */}
      <rect x="57" y="23" width="6" height="25" fill="currentColor" opacity="0.7" />
      {/* Lid */}
      <rect x="35" y="45" width="50" height="8" rx="2" fill="currentColor" opacity="0.8" />
      {/* Glass body */}
      <rect x="38" y="53" width="44" height="50" rx="3" fill="currentColor" opacity="0.5" />
      {/* Metal frame */}
      <rect x="35" y="53" width="3" height="55" fill="currentColor" opacity="0.8" />
      <rect x="82" y="53" width="3" height="55" fill="currentColor" opacity="0.8" />
      {/* Base */}
      <rect x="33" y="103" width="54" height="8" rx="2" fill="currentColor" opacity="0.9" />
      {/* Handle */}
      <path
        d="M85 55 Q100 65, 100 80 Q100 95, 85 103"
        stroke="currentColor"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      {/* Coffee inside */}
      <rect x="40" y="75" width="40" height="26" fill="currentColor" opacity="0.3" />
    </svg>
  )
}

// Moka Pot Illustration
export function MokaPotIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-red-600/40", className)}
    >
      {/* Top knob */}
      <circle cx="60" cy="18" r="6" fill="currentColor" />
      {/* Lid */}
      <path
        d="M45 22 L75 22 L70 30 L50 30 Z"
        fill="currentColor"
        opacity="0.8"
      />
      {/* Upper chamber */}
      <path
        d="M48 30 L72 30 L78 65 L42 65 Z"
        fill="currentColor"
        opacity="0.7"
      />
      {/* Spout */}
      <path
        d="M72 35 Q82 40, 80 50 L78 50"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      {/* Middle band */}
      <rect x="40" y="62" width="40" height="8" fill="currentColor" opacity="0.9" />
      {/* Lower chamber (octagonal) */}
      <path
        d="M42 70 L38 75 L38 100 L42 108 L78 108 L82 100 L82 75 L78 70 Z"
        fill="currentColor"
        opacity="0.6"
      />
      {/* Handle */}
      <path
        d="M38 50 Q25 60, 28 80 Q30 95, 38 100"
        stroke="currentColor"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

// Espresso Machine Illustration
export function EspressoMachineIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-stone-700/40", className)}
    >
      {/* Main body */}
      <rect x="20" y="25" width="80" height="60" rx="5" fill="currentColor" opacity="0.7" />
      {/* Top panel */}
      <rect x="25" y="30" width="70" height="15" rx="2" fill="currentColor" opacity="0.5" />
      {/* Pressure gauge */}
      <circle cx="60" cy="37" r="6" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8" />
      {/* Group head */}
      <rect x="45" y="85" width="30" height="12" rx="2" fill="currentColor" opacity="0.9" />
      {/* Portafilter */}
      <path
        d="M35 92 L45 92 L45 97 L75 97 L75 92 L85 92 L85 100 Q85 105, 80 105 L40 105 Q35 105, 35 100 Z"
        fill="currentColor"
        opacity="0.8"
      />
      {/* Handle */}
      <rect x="80" y="93" width="20" height="5" rx="2" fill="currentColor" opacity="0.7" />
      {/* Drip tray */}
      <rect x="30" y="108" width="60" height="6" rx="1" fill="currentColor" opacity="0.6" />
      {/* Buttons */}
      <circle cx="35" cy="60" r="4" fill="currentColor" opacity="0.5" />
      <circle cx="50" cy="60" r="4" fill="currentColor" opacity="0.5" />
    </svg>
  )
}

// Cold Brew Illustration
export function ColdBrewIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-blue-500/40", className)}
    >
      {/* Jar body */}
      <path
        d="M35 30 L35 100 Q35 110, 45 110 L75 110 Q85 110, 85 100 L85 30 Z"
        fill="currentColor"
        opacity="0.5"
      />
      {/* Jar rim */}
      <rect x="32" y="22" width="56" height="10" rx="2" fill="currentColor" opacity="0.8" />
      {/* Lid */}
      <rect x="38" y="12" width="44" height="12" rx="3" fill="currentColor" opacity="0.7" />
      {/* Coffee inside */}
      <path
        d="M37 50 L37 98 Q37 106, 46 106 L74 106 Q83 106, 83 98 L83 50 Z"
        fill="currentColor"
        opacity="0.4"
      />
      {/* Ice cubes */}
      <rect x="45" y="55" width="12" height="10" rx="2" fill="currentColor" opacity="0.3" />
      <rect x="62" y="60" width="10" height="10" rx="2" fill="currentColor" opacity="0.3" />
      <rect x="50" y="75" width="11" height="10" rx="2" fill="currentColor" opacity="0.3" />
      {/* Snowflakes */}
      <path d="M20 40 L20 50 M15 45 L25 45" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      <path d="M95 60 L95 70 M90 65 L100 65" stroke="currentColor" strokeWidth="2" opacity="0.6" />
    </svg>
  )
}

// Roaster Illustration
export function RoasterIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-stone-600/40", className)}
    >
      {/* Building/factory */}
      <rect x="25" y="40" width="70" height="55" rx="3" fill="currentColor" opacity="0.6" />
      {/* Roof */}
      <path
        d="M20 42 L60 15 L100 42 Z"
        fill="currentColor"
        opacity="0.8"
      />
      {/* Chimney */}
      <rect x="75" y="10" width="12" height="25" fill="currentColor" opacity="0.7" />
      {/* Smoke */}
      <circle cx="81" cy="5" r="4" fill="currentColor" opacity="0.3" />
      <circle cx="86" cy="0" r="3" fill="currentColor" opacity="0.2" />
      {/* Door */}
      <rect x="50" y="65" width="20" height="30" rx="2" fill="currentColor" opacity="0.4" />
      {/* Windows */}
      <rect x="32" y="50" width="12" height="12" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="76" y="50" width="12" height="12" rx="1" fill="currentColor" opacity="0.3" />
      {/* Coffee bean logo */}
      <ellipse cx="60" cy="52" rx="6" ry="8" fill="currentColor" opacity="0.5" />
      {/* Base line */}
      <rect x="15" y="95" width="90" height="5" rx="1" fill="currentColor" opacity="0.4" />
    </svg>
  )
}

// Grinder Illustration
export function GrinderIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-gray-600/40", className)}
    >
      {/* Hopper */}
      <path
        d="M40 15 L80 15 L70 40 L50 40 Z"
        fill="currentColor"
        opacity="0.6"
      />
      {/* Main body */}
      <rect x="35" y="40" width="50" height="45" rx="3" fill="currentColor" opacity="0.7" />
      {/* Adjustment dial */}
      <circle cx="60" cy="55" r="12" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.5" />
      <circle cx="60" cy="55" r="4" fill="currentColor" opacity="0.5" />
      {/* Portafilter holder */}
      <rect x="42" y="85" width="36" height="8" rx="2" fill="currentColor" opacity="0.8" />
      {/* Portafilter */}
      <path
        d="M38 93 L82 93 L78 102 L42 102 Z"
        fill="currentColor"
        opacity="0.6"
      />
      {/* Handle */}
      <rect x="78" y="95" width="18" height="4" rx="2" fill="currentColor" opacity="0.5" />
      {/* Base */}
      <rect x="30" y="102" width="60" height="10" rx="2" fill="currentColor" opacity="0.8" />
    </svg>
  )
}

// Kettle Illustration
export function KettleIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-blue-500/40", className)}
    >
      {/* Body */}
      <path
        d="M30 45 L30 85 Q30 100, 45 100 L75 100 Q90 100, 90 85 L90 45 Q90 35, 80 35 L40 35 Q30 35, 30 45 Z"
        fill="currentColor"
        opacity="0.6"
      />
      {/* Gooseneck spout */}
      <path
        d="M30 50 Q15 45, 18 30 Q20 20, 28 18"
        stroke="currentColor"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />
      {/* Handle */}
      <path
        d="M90 45 Q105 50, 105 67 Q105 85, 90 90"
        stroke="currentColor"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      {/* Lid */}
      <ellipse cx="60" cy="35" rx="25" ry="5" fill="currentColor" opacity="0.7" />
      {/* Lid knob */}
      <circle cx="60" cy="28" r="5" fill="currentColor" opacity="0.8" />
      {/* Base */}
      <ellipse cx="60" cy="105" rx="32" ry="6" fill="currentColor" opacity="0.5" />
      {/* Steam */}
      <path d="M25 12 Q28 8, 25 5" stroke="currentColor" strokeWidth="2" opacity="0.4" fill="none" />
      <path d="M32 14 Q35 10, 32 6" stroke="currentColor" strokeWidth="2" opacity="0.4" fill="none" />
    </svg>
  )
}

// Scale Illustration
export function ScaleIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-emerald-600/40", className)}
    >
      {/* Platform */}
      <rect x="20" y="35" width="80" height="8" rx="2" fill="currentColor" opacity="0.6" />
      {/* Main body */}
      <rect x="25" y="43" width="70" height="50" rx="4" fill="currentColor" opacity="0.7" />
      {/* Display */}
      <rect x="35" y="52" width="50" height="20" rx="2" fill="currentColor" opacity="0.4" />
      {/* Display text */}
      <text x="60" y="67" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.8" fontFamily="monospace">
        18.0g
      </text>
      {/* Buttons */}
      <circle cx="45" cy="82" r="5" fill="currentColor" opacity="0.5" />
      <circle cx="60" cy="82" r="5" fill="currentColor" opacity="0.5" />
      <circle cx="75" cy="82" r="5" fill="currentColor" opacity="0.5" />
      {/* Feet */}
      <circle cx="32" cy="96" r="4" fill="currentColor" opacity="0.6" />
      <circle cx="88" cy="96" r="4" fill="currentColor" opacity="0.6" />
    </svg>
  )
}

// Generic Accessory Illustration
export function AccessoryIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-purple-500/40", className)}
    >
      {/* Tool/wrench shape */}
      <path
        d="M35 30 Q25 40, 30 50 L45 65 L35 75 Q25 85, 35 95 Q45 105, 55 95 L65 85 L80 100 Q90 110, 100 100 Q110 90, 100 80 L85 65 L95 55 Q105 45, 95 35 Q85 25, 75 35 L65 45 L50 30 Q40 20, 35 30 Z"
        fill="currentColor"
        opacity="0.5"
      />
      {/* Center gear */}
      <circle cx="60" cy="60" r="15" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.7" />
      <circle cx="60" cy="60" r="6" fill="currentColor" opacity="0.6" />
      {/* Gear teeth */}
      <rect x="58" y="42" width="4" height="8" fill="currentColor" opacity="0.6" />
      <rect x="58" y="70" width="4" height="8" fill="currentColor" opacity="0.6" />
      <rect x="42" y="58" width="8" height="4" fill="currentColor" opacity="0.6" />
      <rect x="70" y="58" width="8" height="4" fill="currentColor" opacity="0.6" />
    </svg>
  )
}

// Siphon Illustration
export function SiphonIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-purple-600/40", className)}
    >
      {/* Upper chamber */}
      <ellipse cx="60" cy="25" rx="22" ry="15" fill="currentColor" opacity="0.5" />
      <path
        d="M38 25 L38 45 Q38 50, 45 50 L75 50 Q82 50, 82 45 L82 25"
        fill="currentColor"
        opacity="0.6"
      />
      {/* Tube */}
      <rect x="56" y="48" width="8" height="15" fill="currentColor" opacity="0.7" />
      {/* Lower chamber */}
      <circle cx="60" cy="80" r="25" fill="currentColor" opacity="0.5" />
      {/* Stand */}
      <path
        d="M30 105 L45 75"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M90 105 L75 75"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <rect x="25" y="105" width="70" height="5" rx="2" fill="currentColor" opacity="0.7" />
      {/* Burner */}
      <ellipse cx="60" cy="110" rx="12" ry="4" fill="currentColor" opacity="0.6" />
      {/* Flame */}
      <path
        d="M55 105 Q60 95, 65 105"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.4"
      />
    </svg>
  )
}

// Kalita Wave Illustration
export function KalitaIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-coffee-600/30", className)}
    >
      {/* Flat bottom dripper */}
      <path
        d="M30 25 L90 25 L80 75 L40 75 Z"
        fill="currentColor"
        opacity="0.7"
      />
      {/* Wave pattern */}
      <path
        d="M35 35 Q40 40, 45 35 Q50 30, 55 35 Q60 40, 65 35 Q70 30, 75 35 Q80 40, 85 35"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M38 50 Q43 55, 48 50 Q53 45, 58 50 Q63 55, 68 50 Q73 45, 78 50"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.4"
      />
      {/* Three holes at bottom */}
      <circle cx="50" cy="72" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="60" cy="72" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="70" cy="72" r="3" fill="currentColor" opacity="0.5" />
      {/* Handle */}
      <path
        d="M90 35 Q105 45, 95 60"
        stroke="currentColor"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      {/* Server */}
      <path
        d="M38 85 L38 105 Q38 110, 45 110 L75 110 Q82 110, 82 105 L82 85"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        opacity="0.5"
      />
    </svg>
  )
}

// Clever Dripper Illustration
export function CleverIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-teal-600/40", className)}
    >
      {/* Main body - cone with flat bottom */}
      <path
        d="M30 20 L90 20 L85 85 L35 85 Z"
        fill="currentColor"
        opacity="0.7"
      />
      {/* Valve at bottom */}
      <rect x="50" y="85" width="20" height="10" rx="2" fill="currentColor" opacity="0.9" />
      <path
        d="M55 95 L55 105 L65 105 L65 95"
        fill="currentColor"
        opacity="0.6"
      />
      {/* Handle */}
      <path
        d="M90 30 Q108 45, 100 65"
        stroke="currentColor"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      {/* Lid */}
      <ellipse cx="60" cy="18" rx="32" ry="5" fill="currentColor" opacity="0.6" />
      {/* Coffee level */}
      <path
        d="M40 50 L80 50 L78 75 L42 75 Z"
        fill="currentColor"
        opacity="0.3"
      />
      {/* Immersion indicator - drops */}
      <circle cx="50" cy="60" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="60" cy="55" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="70" cy="62" r="2" fill="currentColor" opacity="0.4" />
    </svg>
  )
}

// Turkish Coffee Illustration
export function TurkishIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-orange-700/40", className)}
    >
      {/* Cezve/Ibrik body */}
      <path
        d="M40 35 Q35 45, 35 70 Q35 95, 50 100 L70 100 Q85 95, 85 70 Q85 45, 80 35 Z"
        fill="currentColor"
        opacity="0.6"
      />
      {/* Narrow neck */}
      <path
        d="M45 35 L45 25 Q45 20, 50 18 L70 18 Q75 20, 75 25 L75 35"
        fill="currentColor"
        opacity="0.7"
      />
      {/* Spout */}
      <path
        d="M45 22 Q35 18, 32 25"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />
      {/* Long handle */}
      <rect x="80" y="38" width="35" height="5" rx="2" fill="currentColor" opacity="0.8" />
      <rect x="112" y="35" width="5" height="12" rx="2" fill="currentColor" opacity="0.7" />
      {/* Coffee foam */}
      <ellipse cx="60" cy="30" rx="12" ry="4" fill="currentColor" opacity="0.4" />
      {/* Flame beneath */}
      <path
        d="M50 108 Q55 100, 60 108 Q65 100, 70 108"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />
    </svg>
  )
}

// Brewer (generic) Illustration
export function BrewerIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-amber-500/40", className)}
    >
      {/* Coffee maker body */}
      <rect x="30" y="25" width="60" height="70" rx="5" fill="currentColor" opacity="0.6" />
      {/* Water reservoir */}
      <rect x="35" y="30" width="50" height="25" rx="3" fill="currentColor" opacity="0.4" />
      {/* Control panel */}
      <rect x="35" y="60" width="50" height="15" rx="2" fill="currentColor" opacity="0.5" />
      {/* Button */}
      <circle cx="60" cy="67" r="4" fill="currentColor" opacity="0.7" />
      {/* Carafe */}
      <path
        d="M40 95 L40 110 Q40 115, 48 115 L72 115 Q80 115, 80 110 L80 95"
        fill="currentColor"
        opacity="0.5"
      />
      {/* Carafe handle */}
      <path
        d="M80 98 Q92 100, 92 107 Q92 112, 80 114"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        opacity="0.6"
      />
      {/* Hot plate */}
      <rect x="38" y="92" width="44" height="4" rx="1" fill="currentColor" opacity="0.7" />
    </svg>
  )
}

// Get illustration component by brew method
export function getBrewMethodIllustration(method: string): React.ComponentType<IllustrationProps> {
  const illustrations: Record<string, React.ComponentType<IllustrationProps>> = {
    v60: V60Illustration,
    chemex: ChemexIllustration,
    aeropress: AeroPressIllustration,
    french_press: FrenchPressIllustration,
    moka: MokaPotIllustration,
    espresso: EspressoMachineIllustration,
    cold_brew: ColdBrewIllustration,
    clever: CleverIllustration,
    kalita: KalitaIllustration,
    siphon: SiphonIllustration,
    turkish: TurkishIllustration,
  }
  return illustrations[method] || V60Illustration
}

// Get illustration component by equipment type
export function getEquipmentIllustration(type: string): React.ComponentType<IllustrationProps> {
  const illustrations: Record<string, React.ComponentType<IllustrationProps>> = {
    grinder: GrinderIllustration,
    brewer: BrewerIllustration,
    espresso_machine: EspressoMachineIllustration,
    kettle: KettleIllustration,
    scale: ScaleIllustration,
    accessory: AccessoryIllustration,
  }
  return illustrations[type] || AccessoryIllustration
}
