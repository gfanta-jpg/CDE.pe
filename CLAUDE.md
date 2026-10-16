# CLAUDE.md

Guía para Claude Code en este repositorio. Es una versión condensada de `AGENTS.md`, que sigue siendo la referencia completa (estado por fase, detalle de cada endpoint, historial de tareas). Ante cualquier duda o conflicto de detalle, **lee la sección correspondiente de `AGENTS.md`** y luego las specs OpenSpec.

## Qué es

Plataforma e-commerce de productos tecnológicos desarrollada con Spec-Driven Development (OpenSpec). Monorepo pnpm + Turborepo con tres aplicaciones desplegables de forma independiente:

```text
apps/storefront  Next.js 16 (App Router), puerto 3000 — tienda, wishlist, carrito, checkout, cuenta
apps/backoffice  Next.js 16 (App Router), puerto 3002 — usuarios, catálogo, inventario, órdenes, facturas, perfil empresarial, dashboard
apps/api         NestJS 12 + Fastify, puerto 3001, prefijo /api/v1 — monolito modular, única capa con acceso a PostgreSQL

packages/api-client     cliente TS generado desde apps/api/openapi/openapi.json (openapi-typescript + openapi-fetch)
packages/api-schemas    esquemas Zod de fronteras HTTP
packages/ui             primitivas accesibles compartidas + runtime de temas (no una apariencia común)
packages/config-*       TypeScript, ESLint, Tailwind y testing compartidos
```

Stack: TypeScript 6, React 19.2.8, Tailwind, TanStack Query 5, Zustand 5, Zod 4, React Hook Form, Drizzle ORM 0.45 + `pg`, Argon2id, Vitest, Playwright + axe-core. Node 22.21.1, pnpm 10.33.4 (Corepack).

**Next.js 16 tiene cambios incompatibles con lo que conoces**: antes de escribir código en `apps/storefront` o `apps/backoffice`, consulta `node_modules/next/dist/docs/` (ver `apps/*/AGENTS.md`).

## Estado actual (verificar siempre antes de trabajar)

- Cambio OpenSpec activo: `build-technology-ecommerce-platform` (sin archivar). 174 tareas; 172 completas. Pendientes: **25.3 y 25.4** (despliegue en Vercel y verificación en URLs finales).
- Base de datos activa: **Supabase PostgreSQL 17** vía conexión directa desde NestJS. El PostgreSQL Docker 18.6 es origen histórico, no rollback.
- Imágenes de catálogo: adaptador Cloudinary implementado; proveedor por defecto `local`.
- No asumas que este estado sigue intacto: revisa `git status`, `tasks.md` y el código antes de editar.

## Fuentes de verdad (en orden)

1. Instrucciones actuales del usuario.
2. `openspec/changes/build-technology-ecommerce-platform/specs/*/spec.md` — comportamiento y escenarios de aceptación (7 capacidades).
3. `.../design.md` — arquitectura y decisiones técnicas.
4. `.../tasks.md` — orden y verificación del trabajo.
5. `.../proposal.md` — motivación y alcance.
6. `AGENTS.md` (detalle operativo) y `README.md` (resumen para personas; no sustituye las specs).
7. `docs/*.md` — guías operativas por área y evidencias `VALIDATION-*.md`.

Si una petición cambia requisitos, arquitectura o alcance, no modifiques solo el código: actualiza primero los artefactos OpenSpec (cuando el usuario lo autorice).

## Comandos

Desde la raíz:

```bash
pnpm install --frozen-lockfile
pnpm dev                      # las tres apps con Turborepo
pnpm lint | pnpm typecheck | pnpm test | pnpm build
pnpm ci:full                  # lint+typecheck+test+build + contract:check
pnpm openapi:generate         # regenera openapi.json y el cliente TS
pnpm openapi:check            # verifica que el cliente generado coincide
pnpm contract:check           # pruebas de contrato OpenAPI ↔ API ↔ cliente
pnpm test:e2e:frontends       # Playwright frontends (añadir --workers=2)
pnpm test:e2e:themes          # regresión visual de las 4 combinaciones de tema
pnpm test:e2e:design-tokens
pnpm test:e2e:accessibility
```

Por paquete (`pnpm --filter @technology-ecommerce/<api|storefront|backoffice|ui|api-client|api-schemas> <script>`):

```bash
pnpm --filter @technology-ecommerce/api test                 # vitest
pnpm --filter @technology-ecommerce/api exec vitest run src/billing-invoicing/invoice.aggregate.spec.ts   # un archivo
pnpm --filter @technology-ecommerce/api test:e2e             # integración con PostgreSQL real
pnpm --filter @technology-ecommerce/api db:generate          # nueva migración Drizzle
pnpm --filter @technology-ecommerce/api db:migrate
pnpm --filter @technology-ecommerce/api db:check
```

Openspec: `openspec validate build-technology-ecommerce-platform --strict` antes de dar por completa una implementación.

Arranque local completo: `docs/local-development.md`. Swagger UI en `http://localhost:3001/api/v1/docs`.

## Acciones que requieren autorización explícita del usuario

No las ejecutes por iniciativa propia, aunque una tarea parezca pedirlas:

- `db:seed` (la base activa tiene 23 productos; el seed la reduciría a su set demo) y cualquier copia o migración de datos entre bases.
- Migraciones contra Supabase, desplegar en Vercel, activar cron remoto, tocar secretos o editar `.env`.
- Activar Cloudinary, smoke tests reales contra Cloudinary (`test:e2e:cloudinary`, `test:cloudinary:live`) o `images:reconcile` (puede borrar assets).
- `git commit`, `git push`, archivar el cambio OpenSpec, o marcar tareas como completadas sin verificarlas.
- Regenerar snapshots PNG de regresión visual (las referencias son Chromium/macOS; en Windows crea referencias propias revisadas, nunca sobrescribas para ocultar regresiones).

Las pruebas de integración usan PostgreSQL local o bases temporales explícitas; **nunca** apuntes pruebas a la Supabase activa. No imprimas URIs de conexión, hashes ni dumps.

## Límites arquitectónicos

```text
storefront / backoffice --> api-client, api-schemas, ui        (solo REST)
storefront / backoffice -x-> ORM, PostgreSQL, entidades internas del backend
api --> dominio, persistencia, infraestructura
```

- Solo `apps/api` accede a PostgreSQL. Frontend y backend comparten contratos públicos, no entidades.
- Nada de Server Actions ni Route Handlers de Next.js para lógica de negocio o datos; no crear un backend paralelo en Next. Los Server Components pueden hacer lecturas REST para SSR/SEO.
- Controladores del API no acceden a repositorios de otros módulos; la coordinación entre módulos va por operaciones públicas (checkout, dashboard).
- Monolito modular: sin microservicios salvo cambio OpenSpec explícito.
- Supabase se usa solo como PostgreSQL privado: sin Supabase Auth/Storage/SDK frontend ni segundo historial de migraciones. Drizzle es la autoridad del esquema (`apps/api/src/database/schema`, migraciones en `apps/api/src/database/migrations`). Las sesiones de pooler deben ser Session (no Transaction/6543: hay advisory locks); en Vercel siempre Session pooler (Direct es solo IPv6). TLS verificado con `DATABASE_TLS_VERIFY_SERVER=true` + `DATABASE_TLS_CA` (PEM de la CA de Supabase), confiada solo en los pools de PostgreSQL; no uses `NODE_EXTRA_CA_CERTS`.
- Módulos del API (`apps/api/src/`): `identity-access`, `product-catalog`, `shopping-cart-checkout`, `order-management`, `inventory-control`, `billing-invoicing`, `document-export`, `audit-observability`, `dashboard`, `internal-jobs`, `health`.

## Roles

- `CUSTOMER`: navega, wishlist, carrito, compra; ve solo sus órdenes, facturas y PDFs. Un recurso ajeno responde `404`.
- `ADMIN`: todo lo administrativo (usuarios, catálogo, categorías, etiquetas, perfil empresarial, inventario, órdenes, facturas, destacados).
- `BILLING`: órdenes (completar/cancelar elegibles), facturas manuales o desde orden, consulta del perfil empresarial. Sin usuarios, catálogo, edición del perfil ni ajustes directos de inventario.

El registro público siempre crea `CUSTOMER`. Solo `ADMIN` cambia roles. No se puede desactivar al último admin. La UI puede ocultar acciones, pero **el API siempre reautoriza**.

## Invariantes de negocio críticas

La lista completa (34) está en `AGENTS.md` › *Business invariants*. Las que más se rompen al editar:

- Dinero: decimales de precisión fija, moneda global `USD`; nunca `float`.
- Fechas con zona horaria. Snapshots históricos en líneas de orden/factura y snapshot empresarial en órdenes, facturas y PDFs; los PDFs nunca leen datos maestros vigentes.
- Inventario: stock nunca negativo, ni con concurrencia. Toda variación crea un movimiento auditable. No hay `stock` editable en `PATCH /products`; los cambios pasan por `/inventory/:productId/adjustments`.
- Carrito y wishlist no reservan stock. Checkout aprobado crea orden y descuenta inventario exactamente una vez (`Idempotency-Key` obligatorio). Pago rechazado no toca nada.
- Cancelar orden elegible restituye inventario una vez (movimiento compensatorio); `409 ORDER_ACTIVE_INVOICE` si hay factura activa.
- Facturar, pagar, anular, exportar o crear factura manual **nunca** modifica inventario. Una orden no puede tener dos facturas activas; factura + orden `INVOICED` se confirman atómicamente.
- Borrado lógico para productos, usuarios, categorías y etiquetas con historial. Slugs únicos y estables (no se regeneran al renombrar).
- Toda colección grande se busca, filtra, ordena y pagina en el backend: respuesta `{ items, page, pageSize, totalItems, totalPages }`. Nunca paginar en memoria.
- Transacciones cortas; no mantener transacciones ni bloqueos durante llamadas de red o interacción del usuario. SQL explícito cuando el bloqueo lo requiera.

Máquinas de estado:

```text
Order:   PROCESSING --> INVOICED --> COMPLETED ; PROCESSING|INVOICED --> CANCELLED (si válida)
Payment: PENDING --> APPROVED | REJECTED
Invoice: DRAFT --> PENDING_PAYMENT --> PAID ; DRAFT|PENDING_PAYMENT|PAID --> VOID
```

## Contrato REST / OpenAPI

- Contrato en `apps/api/openapi/openapi.json` (47 paths), servido en `/api/v1/openapi.json`.
- Antes de crear o cambiar una ruta, comprueba si ya existe en OpenAPI y en las specs; no crees contratos paralelos (p. ej. el detalle público es `/products/slug/:slug`).
- Al cambiar el contrato: actualiza el API → `pnpm openapi:generate` → `pnpm openapi:check` → esquemas Zod en `api-schemas` → pruebas → docs.
- Errores uniformes: código estable, mensaje seguro, detalles de campo y correlation ID.
- Auth: access token Bearer solo en memoria; refresh en cookie `HttpOnly` con CSRF. Nunca guardes tokens ni respuestas privadas en `localStorage`.

## Convenciones frontend

Antes de tocar React/Next, lee `.agents/skills/react-rules/SKILL.md`; para cambios visuales, también `.agents/skills/frontend-design/SKILL.md`.

- TanStack Query para estado remoto (claves de caché que incluyan identidad/rol en datos privados). Zustand (`create()`) solo para estado visual de cliente (tema, apertura de paneles), nunca para duplicar datos del API.
- Formularios: React Hook Form + `zodResolver`. Zod para toda respuesta HTTP no confiable.
- `useEffect` solo para sincronizar con sistemas externos; el feedback de mutaciones se dispara desde handlers o callbacks de TanStack Query.
- Búsqueda, filtros, orden y página viven en la URL; cambiar un criterio reinicia `page=1`.
- Toda eliminación lógica, desactivación o retirada de línea de carrito requiere modal accesible de confirmación. Mensajes flash en región `aria-live`.
- Autocomplete remoto: `purpose=autocomplete`, mínimo 3 caracteres, `pageSize` ≤ 20, debounce, cancelación de solicitudes obsoletas; el API revalida los IDs.
- Componentes pequeños y puros, estado inmutable.

## Sistemas visuales y temas

- Storefront y backoffice deben ser visualmente distintos; comparten primitivas accesibles, no apariencia. No muevas estilos de una app a `packages/ui` si afectan a la otra.
- Cuatro combinaciones obligatorias: storefront claro/oscuro, backoffice claro/oscuro. Contraste WCAG AA, foco visible, significado no dependiente solo del color.
- Tokens: `apps/storefront/src/styles/design-tokens.css` y `apps/backoffice/src/styles/design-tokens.css`. Runtime: `packages/ui/src/theme-bootstrap.ts` (aplica `data-theme` antes del body) y `theme-provider.tsx`.
- Preferencia en `localStorage` con claves `technology-ecommerce:storefront:theme` / `technology-ecommerce:backoffice:theme`, valores `light|dark`; primera visita respeta `prefers-color-scheme`. Nunca se guarda en PostgreSQL.
- Storefront (fase 26): blanco/lavanda (`#ffffff`/`#faf9fe`, acento `#6554ae`) y carbón/violeta (`#0d0d12`/`#1c1726`, acento `#bca7ef`); fuentes locales Source Sans 3 y Space Grotesk. Hero con tres fotos locales y movimiento; respeta `prefers-reduced-motion`. `ProductGallery` del detalle **no** tiene autoplay.
- Backoffice: slate/navy/azul empresarial, tablas compactas, tarjetas KPI. No rediseñar sin petición explícita.
- Tras cambios visuales: `pnpm test:e2e:themes`, `pnpm test:e2e:design-tokens`, `pnpm test:e2e:frontends --workers=2`. Detalle en `docs/theme-regression-testing.md` y `docs/design-system.html`.

## Catálogo y landing

- `GET /api/v1/catalog/landing` compone en una sola respuesta: hasta 3 destacados (`featuredAt`), hasta 9 recientes sin repetir destacados, y hasta 3 categorías importantes (`landingOrder` 1–3) con hasta 3 productos cada una. La UI no reconstruye esto desde el catálogo completo.
- Tarjetas usan `coverImage`; el detalle usa `images` ordenadas. Máximo 4 imágenes por producto (`409 PRODUCT_IMAGE_LIMIT_REACHED`), exactamente una portada en productos activos.
- Imágenes fuera de PostgreSQL (solo clave, URL, metadatos). Hosts remotos de Next limitados a `res.cloudinary.com` bajo `codex-storefront`; no habilitar `dangerouslyAllowLocalIP` en producción.

## Verificación

Verifica en proporción al cambio: lint + typecheck siempre; unitarias para permisos, cálculos y estados; integración con PostgreSQL para transacciones y restricciones; contrato si cambia OpenAPI; componentes/e2e si cambia UI. Las pruebas automatizadas no equivalen a auditoría manual de accesibilidad ni a certificación de producción: no lo afirmes.

Al implementar tareas OpenSpec: sigue `tasks.md` en orden de dependencias, marca una tarea solo tras verificarla, no marques bloques por inferencia y no archives con tareas pendientes.

## Skills del proyecto

Los skills viven en `.agents/skills/` (fuente única, formato compartido con Codex). `.claude/skills/<nombre>` son enlaces a esas carpetas para que Claude Code los descubra; edita siempre el original en `.agents/skills/`. En Windows sin modo desarrollador los enlaces son junctions locales excluidas en `.git/info/exclude`; en un clon nuevo recréalas. Los skills OpenSpec requieren el CLI `openspec` y mencionan `$skill (Codex)`: en Claude Code se invocan como `/nombre`.

| Skill | Cuándo |
|---|---|
| `openspec-explore` | Analizar o aclarar sin implementar (no escribir código). |
| `openspec-propose` | Crear un cambio nuevo con todos sus artefactos (solo planificación). |
| `openspec-update-change` | Cambian decisiones, alcance o requisitos del cambio existente (sin editar código). |
| `openspec-apply-change` | Implementar o continuar tareas de `build-technology-ecommerce-platform`. |
| `openspec-sync-specs` | Llevar deltas aprobados a las specs principales, sin archivar. |
| `openspec-archive-change` | Solo tras completar y verificar todo. |
| `react-rules` | Cualquier cambio en componentes, hooks, estado, formularios o UI React/Next. |
| `frontend-design` | Cambios visuales: layout, CSS/Tailwind, temas, tokens, tipografía, motion, responsive. |
| `supabase` | Cualquier tarea de Supabase (sin cambiar la arquitectura REST/Drizzle). |
| `supabase-postgres-best-practices` | Antes de escribir SQL, esquema, migraciones, RLS o diagnosticar PostgreSQL. |

No combines explore/propose con implementación en el mismo turno. Si durante apply el usuario pide algo que contradice los artefactos, detente y propone actualizar la planificación primero.

## Reglas de trabajo

- Revisa `git status` antes de editar y preserva cambios existentes del usuario.
- Usa las herramientas Edit/Write (equivalente al `apply_patch` de AGENTS.md) y Grep/Glob para búsquedas.
- No modifiques archivos ajenos a la tarea ni introduzcas funcionalidad fuera de alcance.
- Secretos fuera del repo, logs, fixtures y respuestas. Variables de Cloudinary y BD son privadas del API (nunca `NEXT_PUBLIC_*`).
- Si cambia un contrato REST: OpenAPI, cliente generado, esquemas, pruebas y docs. Si cambia comportamiento o decisión: specs y diseño vía OpenSpec. Mantén `README.md` y `AGENTS.md` alineados ante cambios sustanciales.
- Entorno Windows: usa rutas con `/` en Bash; los symlinks de git pueden materializarse como archivos de texto (p. ej. `.claude/skills/frontend-design`).

## Documentación operativa clave

- Local: `docs/local-development.md`
- Supabase: `docs/supabase-course-migration.md`
- Vercel: `docs/vercel-course-deployment.md`, `docs/VALIDATION-25.3.md`
- Cloudinary: `docs/catalog-cloudinary-storage.md`, `docs/catalog-image-recovery.md`
- Seed: `docs/development-catalog-seed.md`, `docs/development-user-seed.md`
- Temas: `docs/theme-runtime.md`, `docs/theme-regression-testing.md`, `docs/design-tokens.md`
- Dashboard: `docs/dashboard-summary.md`, `docs/backoffice-dashboard.md`
- Landing/editorial: `docs/landing-editorial.md`, `docs/catalog-landing-api.md`
