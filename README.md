# BrewVault

Tu boveda digital para cafe de especialidad. Una aplicacion web completa para gestionar tu coleccion de cafes, registrar preparaciones, controlar equipamiento y mejorar tu experiencia cafetera.

![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)

## Caracteristicas Principales

### Gestion de Cafes
- Inventario completo de granos con origen, variedad, proceso y nivel de tueste
- Seguimiento de stock con alertas de bajo inventario
- Notas de sabor, puntuacion SCA y valoracion personal
- Soporte para codigos de barras y certificaciones
- Catalogo precargado con +50 cafes de tostadores espanoles

### Registro de Preparaciones
- **12 metodos de preparacion**: V60, Chemex, AeroPress, French Press, Moka, Espresso, Cold Brew, Clever Dripper, Kalita Wave, Siphon, Turkish y mas
- Parametros detallados: dosis, agua, temperatura, tiempo, tamano de molienda
- Tracking de blooming y vertidos multiples
- Subida de fotos de cada preparacion
- Valoracion y notas personales
- **Recetas favoritas**: guarda tus configuraciones preferidas
- **Pre-carga automatica**: los valores de tu ultima preparacion se cargan automaticamente

### Equipamiento
- Gestion de molinillos, cafeteras, hervidores, basculas
- Programacion de mantenimiento con alertas automaticas
- **Quick Brew**: acceso rapido via QR code del equipo
- Historial de uso por equipo

### Notas de Cata (SCA Protocol)
- Sistema de puntuacion profesional de 10 categorias
- Fragancia, sabor, retrogusto, acidez, cuerpo, balance
- Dulzura, uniformidad, taza limpia, impresion general
- Calculo automatico de puntuacion total (max 100)
- Descriptores de sabor personalizados

### Analytics y Dashboard
- Estadisticas en tiempo real de tu coleccion
- Graficas de consumo semanal
- Distribucion de valoraciones
- Metodos de preparacion mas usados
- Actividad reciente

### Sistema de Alertas
- Stock bajo de cafes
- Mantenimiento de equipos pendiente
- Prioridades configurables
- Notificaciones in-app

### Recetas de Agua
- Perfiles de composicion de agua
- Parametros: GH, KH, calcio, magnesio, TDS, pH
- Reutilizables en preparaciones

## Tech Stack

| Categoria | Tecnologia |
|-----------|------------|
| Framework | Next.js 15+ (App Router) |
| Lenguaje | TypeScript (strict mode) |
| Base de datos | Supabase (PostgreSQL) |
| Autenticacion | Supabase Auth (Email, OAuth) |
| Estilos | Tailwind CSS 4 |
| Componentes | shadcn/ui |
| Formularios | React Hook Form + Zod |
| Graficas | Recharts |
| Iconos | Lucide React |
| Temas | next-themes |

## Estructura del Proyecto

```
src/
├── app/
│   ├── (auth)/                 # Rutas de autenticacion
│   │   ├── login/              # Inicio de sesion
│   │   ├── signup/             # Registro
│   │   ├── forgot-password/    # Recuperar contrasena
│   │   └── callback/           # OAuth callback
│   ├── (dashboard)/            # Rutas protegidas
│   │   ├── dashboard/          # Panel principal
│   │   ├── beans/              # Gestion de cafes
│   │   ├── brews/              # Preparaciones
│   │   ├── equipment/          # Equipamiento
│   │   ├── roasters/           # Tostadores
│   │   ├── cupping/            # Notas de cata
│   │   ├── water/              # Recetas de agua
│   │   ├── alerts/             # Alertas
│   │   └── settings/           # Configuracion
│   ├── quick-brew/             # Acceso rapido por equipo
│   └── api/cron/               # Tareas programadas
├── components/
│   ├── ui/                     # Componentes shadcn/ui
│   ├── forms/                  # Formularios
│   ├── layout/                 # Navegacion y layout
│   ├── alerts/                 # Componentes de alertas
│   ├── cards/                  # Tarjetas de datos
│   └── charts/                 # Visualizaciones
├── lib/
│   ├── supabase/               # Clientes de Supabase
│   ├── validations/            # Schemas de Zod
│   ├── data/                   # Catalogos estaticos
│   └── utils.ts                # Utilidades
└── types/                      # Tipos TypeScript
```

## Base de Datos

### Tablas Principales

| Tabla | Descripcion |
|-------|-------------|
| `profiles` | Perfiles de usuario y preferencias |
| `beans` | Cafes con origen, proceso, stock, valoracion |
| `roasters` | Tostadores de cafe |
| `equipment` | Equipamiento con mantenimiento programado |
| `brews` | Preparaciones con todos los parametros |
| `cupping_notes` | Notas de cata SCA |
| `water_recipes` | Perfiles de agua |
| `alerts` | Sistema de notificaciones |
| `favorite_brews` | Recetas guardadas |

### Seguridad (RLS)
Todas las tablas tienen Row Level Security habilitado. Cada usuario solo puede acceder a sus propios datos.

## Instalacion

### Requisitos
- Node.js 18+
- npm o pnpm
- Cuenta en Supabase

### Configuracion

1. **Clonar el repositorio**
```bash
git clone https://github.com/ferval19/brewvault.git
cd brewvault
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
CRON_SECRET=tu_cron_secret
```

4. **Configurar Supabase**
- Crear proyecto en [supabase.com](https://supabase.com)
- Ejecutar migraciones SQL (ver `/supabase/migrations`)
- Configurar Authentication providers (Email, Google)
- Crear bucket de Storage `coffee-photos`

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicacion estara disponible en `http://localhost:3000`

## Scripts Disponibles

```bash
npm run dev        # Desarrollo
npm run build      # Build de produccion
npm run start      # Servidor de produccion
npm run lint       # Linter
npx tsc --noEmit   # Type checking
```

## Despliegue

### Vercel (Recomendado)

1. Conectar repositorio en [vercel.com](https://vercel.com)
2. Configurar variables de entorno
3. Deploy automatico en cada push

### Variables de Entorno en Produccion

| Variable | Descripcion |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anonima de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (solo servidor) |
| `CRON_SECRET` | Secret para verificar cron jobs |

### Configuracion de Supabase

En el dashboard de Supabase, configurar:

**Authentication > URL Configuration:**
- Site URL: `https://tu-dominio.vercel.app`
- Redirect URLs:
  - `https://tu-dominio.vercel.app/callback`
  - `http://localhost:3000/callback` (desarrollo)

**Storage:**
- Crear bucket `coffee-photos` con politicas publicas de lectura

## Metodos de Preparacion Soportados

| Metodo | Descripcion |
|--------|-------------|
| V60 | Goteo manual Hario |
| Chemex | Cafetera de vidrio |
| AeroPress | Inmersion/presion |
| French Press | Prensa francesa |
| Moka | Cafetera italiana |
| Espresso | Maquina espresso |
| Cold Brew | Extraccion en frio |
| Clever Dripper | Inmersion + goteo |
| Kalita Wave | Goteo plano |
| Siphon | Cafetera de vacio |
| Turkish | Cafe turco |
| Other | Otros metodos |

## Tamanos de Molienda

| Nivel | Uso Recomendado |
|-------|-----------------|
| Extra Fino | Cafe turco |
| Fino | Espresso |
| Medio-Fino | Moka, AeroPress |
| Medio | V60, goteo |
| Medio-Grueso | Chemex |
| Grueso | French Press |
| Extra Grueso | Cold Brew |

## Catalogos Precargados

### Tostadores Espanoles
- Incapto, Ineffable, Wake Up, Nomad
- Nubra, Syra, Toma, Kima, DFRNT

### Cafes de Especialidad
- Panama Gesha, Jamaica Blue Mountain
- Hawaii Kona, Yemen Mokha
- +40 variedades de origen unico

### Marcas Comerciales
- Lavazza, Illy, Segafredo
- Pellini, Delta, Bonka

## Funcionalidades Adicionales

### Quick Brew (QR)
Genera un codigo QR para cada equipo que enlaza a `/quick-brew/[equipmentId]`. Escanea con tu movil para registrar preparaciones rapidamente.

### Favoritos
Guarda tus recetas mas usadas como plantillas. Un click para crear una nueva preparacion con todos los parametros precargados.

### Alertas Automaticas
- **Stock bajo**: cuando un cafe baja del umbral configurado
- **Mantenimiento**: recordatorios segun intervalo definido
- Tarea cron diaria a las 9:00 AM

### Tema Oscuro
Soporte completo para modo oscuro con deteccion automatica de preferencia del sistema.

### Seleccion Multiple
Selecciona varios cafes o preparaciones para eliminarlos en lote.

## API

### Cron Jobs

**GET /api/cron/maintenance**
- Verifica equipos con mantenimiento pendiente
- Crea alertas automaticas
- Requiere header `Authorization: Bearer CRON_SECRET`
- Ejecuta diariamente via Vercel Cron

## Contribuir

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## Licencia

MIT License - ver [LICENSE](LICENSE) para detalles.

---

Desarrollado con cafe por [@ferval19](https://github.com/ferval19)
