# Kyoru Studio Backend

API backend en Node.js + Express + Prisma para gestionar contenido de Kyoru Studio:

- proyectos
- servicios
- productos
- contactos

## URLs actuales

- Frontend publico (Cloudflare Workers Static Assets): `https://kyoru-studio.juann200213.workers.dev`
- Backend publico (servicio Render `kyoru-studio-backend`; hostname tecnico actual): `https://yorurei-studio-backend1.onrender.com`

Nota: el dominio propio de Kyoru Studio sigue pendiente.

## Stack local

- Node.js 18+
- Docker Desktop (PostgreSQL local)
- Prisma ORM

## Variables de entorno

Usa `backend/.env.example` como plantilla:

```powershell
cd backend
Copy-Item .env.example .env
```

Obligatoria para arrancar el backend:

- `DATABASE_URL`

Requeridas por funcionalidad:

- `DIRECT_URL` (build, validación y migraciones de Prisma CLI con el schema actual)
- `FRONTEND_ORIGIN`
- `ADMIN_API_TOKEN` (rutas administrativas)
- `SUPABASE_URL` (uploads)
- `SUPABASE_SERVICE_ROLE_KEY` (uploads)

Variables de configuración:

- `SUPABASE_STORAGE_BUCKET` (opcional; tiene un valor por defecto)
- `PORT` (opcional; usa `3001` por defecto)
- `NODE_ENV` (opcional; controla el nivel de log de Prisma)

Nota CORS en producción:

- `FRONTEND_ORIGIN` acepta múltiples orígenes separados por coma.
- Ejemplo: `FRONTEND_ORIGIN=https://kyoru-studio.juann200213.workers.dev,http://localhost:5173,http://localhost:5174`

### Supabase + Prisma

- `DATABASE_URL`: conexión con pooler transaccional, usada por Prisma Client en el runtime de la API.
- `DIRECT_URL`: URL usada por Prisma CLI para migraciones/comandos de schema. Debe ser la conexión directa o una conexión de sesión compatible con migraciones.
- En Render/Railway debes configurar **ambas** variables.
- Copia las dos cadenas exactas desde el panel **Connect** del proyecto Supabase; no reutilices el host, región o usuario de un ejemplo.
- Nunca subas contraseñas reales al repositorio.

### Supabase Storage (imagenes)

Variables nuevas del backend:

- `SUPABASE_URL`: URL del proyecto Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: clave de servidor para subir archivos.
- `SUPABASE_STORAGE_BUCKET`: bucket destino (recomendado: `yorurei-media`).

Importante:

- `SUPABASE_SERVICE_ROLE_KEY` solo debe existir en backend (Render/local server).
- Nunca expongas esta key en React/frontend.

Bucket requerido (paso manual en Supabase):

- Crear bucket `yorurei-media`.
- Configurarlo como publico para servir imagenes en el sitio web.
- Si en el futuro se usa bucket privado, se deben servir signed URLs desde backend.

## Flujo local recomendado (PowerShell)

1. Instalar dependencias:

```powershell
cd backend
npm install
```

2. Levantar PostgreSQL en Docker:

```powershell
npm run db:up
```

3. Generar Prisma Client:

```powershell
npx prisma generate
```

4. Crear/aplicar migraciones de desarrollo:

```powershell
npx prisma migrate dev --name init
```

5. Cargar seed:

```powershell
npm run prisma:seed
```

6. Levantar backend:

```powershell
npm run dev
```

7. Probar endpoints públicos:

- `http://localhost:3001/api/health` (compatibilidad; solo liveness)
- `http://localhost:3001/api/health/live` (proceso HTTP)
- `http://localhost:3001/api/health/ready` (Prisma + PostgreSQL)
- `http://localhost:3001/api/services`
- `http://localhost:3001/api/projects`
- `http://localhost:3001/api/products`

## Scripts útiles

- `npm run dev`
- `npm run start`
- `npm run db:up`
- `npm run db:down`
- `npm run db:logs`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:deploy`
- `npm run prisma:seed`
- `npm run prisma:studio`
- `npm run db:reset`

## Endpoints públicos

- `GET /api/health`
- `GET /api/health/live`
- `GET /api/health/ready`
- `GET /api/projects`
- `GET /api/projects/:slug`
- `GET /api/services`
- `GET /api/services/:slug`
- `GET /api/products`
- `GET /api/products/:slug`
- `POST /api/contacts`

## Endpoints admin (x-admin-token)

- `GET /api/admin/projects`
- `POST /api/admin/projects`
- `PUT /api/admin/projects/:id`
- `DELETE /api/admin/projects/:id`
- `GET /api/admin/services`
- `POST /api/admin/services`
- `PUT /api/admin/services/:id`
- `DELETE /api/admin/services/:id`
- `GET /api/admin/products`
- `POST /api/admin/products`
- `PUT /api/admin/products/:id`
- `DELETE /api/admin/products/:id`
- `GET /api/admin/contacts`
- `PUT /api/admin/contacts/:id/status`
- `POST /api/admin/uploads/image`

Header requerido:

```http
x-admin-token: <ADMIN_API_TOKEN>
```

## Deploy backend (Render / Railway)

Configuración sugerida:

- Build command: `npm install && npx prisma generate`
- Start command: `npm run start`
- Post-deploy / migrate command: `npx prisma migrate deploy`

Variables de entorno requeridas:

- `DATABASE_URL`
- `DIRECT_URL`
- `FRONTEND_ORIGIN`
- `ADMIN_API_TOKEN`
- `PORT` (si la plataforma lo requiere)

Pasos sugeridos:

1. Crear la base de datos cloud (Supabase / Neon / Render Postgres).
2. Copiar `DATABASE_URL` (pooling) y `DIRECT_URL` (directa).
3. Crear el servicio backend con root directory `backend`.
4. Configurar variables de entorno del servicio.
5. Ejecutar migraciones con `npx prisma migrate deploy`.
6. Ejecutar seed si aplica (`npm run prisma:seed`).
7. Probar `GET /api/health/live` y `GET /api/health/ready`.
8. Actualizar el frontend en Cloudflare Workers Static Assets con `VITE_API_BASE_URL=https://yorurei-studio-backend1.onrender.com`.

`GET /api/health` se conserva como alias compatible de liveness y no comprueba PostgreSQL. Configura el health check operativo contra `GET /api/health/ready` cuando el servicio solo deba recibir tráfico con la base de datos disponible.

## SQL legacy

Prisma es la fuente principal de esquema/migraciones.

Los SQL previos se conservan como referencia en:

- `backend/sql-legacy/YorureiStudioDB.sql`
- `backend/sql-legacy/seed.sql`
