# Checklist de Despliegue - Kyoru Studio Backend

## URLs actuales

- Frontend publico (Cloudflare Workers Static Assets): `https://kyoru-studio.juann200213.workers.dev`
- Backend publico (servicio Render `kyoru-studio-backend`; hostname tecnico actual): `https://yorurei-studio-backend1.onrender.com`

Nota: el dominio propio de Kyoru Studio sigue pendiente.

## 1) Backend (Render / Railway)

- Root directory: `backend`
- Build command: `npm install && npx prisma generate`
- Start command: `npm run start`
- Migrate command: `npx prisma migrate deploy`
- Health check de liveness: `GET /api/health/live`
- Health check de readiness: `GET /api/health/ready`

Variables de entorno:

- `DATABASE_URL` (obligatoria para arrancar el backend)
- `DIRECT_URL` (obligatoria para build, validación y migraciones de Prisma CLI)
- `FRONTEND_ORIGIN` (necesaria para peticiones del frontend en producción)
- `ADMIN_API_TOKEN` (necesaria para rutas administrativas)
- `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` (necesarias para uploads)
- `SUPABASE_STORAGE_BUCKET` (opcional; valor por defecto: `yorurei-media`)
- `PORT` (si la plataforma lo solicita)
- `NODE_ENV` (recomendado: `production`)

Nota CORS:

- `FRONTEND_ORIGIN` puede incluir múltiples URLs separadas por coma.
- Ejemplo: `FRONTEND_ORIGIN=https://kyoru-studio.juann200213.workers.dev,http://localhost:5173,http://localhost:5174`

## 2) Base de datos cloud (Supabase / Neon / Render Postgres)

Para Supabase:

- `DATABASE_URL`: usar la URL del pooler transaccional (puerto `6543`) para el runtime.
- `DIRECT_URL`: usar para Prisma CLI la URL directa o, si la red no admite IPv6, la URL del pooler de sesión (puerto `5432`).
- Copiar ambas cadenas exactamente desde **Connect** en el proyecto Supabase. El host, la región y el usuario son específicos del proyecto.

Ejemplo (sin credenciales reales):

```env
DATABASE_URL=postgresql://POOLER_USER:PASSWORD@POOLER_HOST:6543/DATABASE?pgbouncer=true
DIRECT_URL=postgresql://MIGRATION_USER:PASSWORD@MIGRATION_HOST:5432/DATABASE
```

Los valores anteriores son marcadores de formato, no direcciones reutilizables.

Nunca subas contraseñas reales al repositorio.

## 3) Prisma en producción

1. `prisma generate` durante build.
2. `prisma migrate deploy` en deploy.
3. `prisma db seed` solo si necesitas datos iniciales.

## 4) Frontend (Cloudflare Workers Static Assets)

- Root directory: `frontend`
- Build command: `npm run build`
- Configuracion de Workers Static Assets en `frontend/wrangler.toml`:
  - `directory = "./dist"`
  - `not_found_handling = "single-page-application"`
  - No se requiere una regla de redireccion SPA adicional.

Variables de entorno:

- `VITE_API_BASE_URL=https://yorurei-studio-backend1.onrender.com`
- `VITE_SHOW_INTERNAL_ROUTES=false`

## 5) Verificaciones post-deploy

- `GET https://yorurei-studio-backend1.onrender.com/api/health/live` debe responder `200` si Express está activo.
- `GET https://yorurei-studio-backend1.onrender.com/api/health/ready` debe responder `200` solo si Prisma alcanza PostgreSQL; responde `503` en caso contrario.
- `GET https://yorurei-studio-backend1.onrender.com/api/health` permanece como alias legado de liveness y no valida la base de datos.
- `GET https://yorurei-studio-backend1.onrender.com/api/services`
- `GET https://yorurei-studio-backend1.onrender.com/api/projects`
- `GET https://yorurei-studio-backend1.onrender.com/api/products`
- Probar envío del formulario público (`POST /api/contacts`).
- Verificar CORS: `FRONTEND_ORIGIN` debe coincidir exactamente con la URL del frontend oficial en Cloudflare Workers.

## 6) Seguridad mínima

- `ADMIN_API_TOKEN` largo y aleatorio.
- `SUPABASE_SERVICE_ROLE_KEY` solo en backend (nunca en frontend).
- No usar `VITE_SHOW_INTERNAL_ROUTES=true` en producción.
- Planificar auth real para admin (usuarios/sesiones/JWT y roles).

## 7) Storage de imagenes (paso manual en Supabase)

1. Crear bucket `yorurei-media` en Supabase Storage.
2. Marcar el bucket como publico para exponer URLs de imagen.
3. Configurar en Render:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_STORAGE_BUCKET=yorurei-media`
4. Manual Deploy -> Deploy latest commit.


