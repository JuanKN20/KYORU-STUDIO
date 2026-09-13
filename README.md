# Kyoru Studio

Repositorio principal de Kyoru Studio con separacion profesional de frontend y backend.

## URLs actuales

- Frontend publico (Cloudflare Workers Static Assets): `https://kyoru-studio.juann200213.workers.dev`
- Backend publico (servicio Render `kyoru-studio-backend`; hostname tecnico actual): `https://yorurei-studio-backend1.onrender.com`

Nota: el dominio propio de Kyoru Studio sigue pendiente. Mientras tanto se usa la URL real de Cloudflare.

## Estructura

- `frontend/`: aplicacion web React + Vite + Tailwind desplegable con Cloudflare Workers Static Assets.
- `backend/`: API local con Node.js/Express y PostgreSQL para endpoints de soporte (por ejemplo `/api/usuarios`).

## Frontend

```powershell
cd frontend
npm install
npm run dev
npm run lint
npm run build
```

## Backend (local)

```powershell
cd backend
npm install
npm run dev
```

## Cloudflare Workers Static Assets

Si el proyecto ya estaba conectado con carpeta raiz del repositorio actual, actualiza el **Root directory** a `frontend`.
El comando de build sigue siendo `npm run build` y el output directory sigue siendo `dist`.

Checklist final Cloudflare Workers Static Assets:

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Variable: `VITE_API_BASE_URL=https://yorurei-studio-backend1.onrender.com`
- Variable: `VITE_SHOW_INTERNAL_ROUTES=false`
- Fallback SPA: `frontend/wrangler.toml` debe mantener `not_found_handling = "single-page-application"`.

## Render

Checklist final Render (servicio `kyoru-studio-backend`):

- Root directory: `backend`
- Build command: `npm install && npx prisma generate`
- Start command: `npm run start`
- Post deploy: `npx prisma migrate deploy`
- Variables: `DATABASE_URL`, `DIRECT_URL`, `FRONTEND_ORIGIN`, `ADMIN_API_TOKEN`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET`
- Health check: `GET https://yorurei-studio-backend1.onrender.com/api/health/ready` (`/api/health` queda como liveness legado)

## Estado Tecnico de Marca

- Repositorio oficial: `JuanKN20/KYORU-STUDIO` (`https://github.com/JuanKN20/KYORU-STUDIO`).
- El nombre de la carpeta local puede diferir temporalmente del repositorio oficial sin cambiar `origin`.
- El `name` de `frontend/wrangler.toml` es `kyoru-studio` y corresponde al frontend oficial.
- Nombres internos `akai-*` en configuraciones/CSS pueden limpiarse despues sin impacto visual inmediato.
