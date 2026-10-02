import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, KeyRound, ShieldCheck } from 'lucide-react';
import { hasAdminToken, saveAdminToken, validateAdminToken } from './adminApi';

type AdminLoginProps = {
  showInternalRoutes: boolean;
};

const TOKEN_ERROR_MESSAGE =
  'No fue posible validar el token. Verifica que el backend esté activo y que el token sea correcto.';

function resolveFromPath(state: unknown): string {
  if (state && typeof state === 'object' && 'from' in state) {
    const value = state.from;
    if (typeof value === 'string' && value.startsWith('/admin/')) {
      return value;
    }
  }
  return '/admin/dashboard';
}

const AdminLogin: React.FC<AdminLoginProps> = ({ showInternalRoutes }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const targetPath = useMemo(() => resolveFromPath(location.state), [location.state]);

  useEffect(() => {
    if (hasAdminToken()) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  if (!showInternalRoutes) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanToken = token.trim();

    if (!cleanToken) {
      setError('Ingresa un token de acceso para continuar.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await validateAdminToken(cleanToken);
      saveAdminToken(cleanToken);
      navigate(targetPath, { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : TOKEN_ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-shell flex min-h-screen items-center px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto w-full max-w-xl">
        <div className="admin-surface relative overflow-hidden p-6 sm:p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-400/80 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 bg-red-500/20 blur-3xl" />

          <div className="mb-6 flex items-center gap-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/45 bg-red-950/45 text-red-100 shadow-akai-glow">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="admin-kicker">Kyoru Studio</p>
              <p className="text-sm font-semibold text-zinc-100">Acceso corporativo</p>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white sm:text-[1.85rem]">Panel interno</h1>
            <p className="text-sm font-medium text-red-200">Acceso administrativo de Kyoru Studio</p>
            <p className="max-w-lg text-sm leading-relaxed text-zinc-300">
              Ingresa el token interno para gestionar proyectos, servicios, productos y solicitudes de contacto.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="admin-token" className="admin-label">
                Token de acceso
              </label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-300/80" />
                <input
                  id="admin-token"
                  type="password"
                  autoComplete="off"
                  value={token}
                  onChange={(event) => setToken(event.target.value)}
                  placeholder="••••••••••••••••"
                  className="admin-input pl-10"
                />
              </div>
            </div>

            {error ? (
              <p role="alert" className="rounded-xl border border-red-700/65 bg-red-950/40 px-3.5 py-2.5 text-sm text-red-100">
                {error}
              </p>
            ) : null}

            <button type="submit" disabled={loading} className="admin-btn-primary w-full">
              {loading ? 'Validando token...' : 'Entrar al panel'}
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <Link to="/" className="admin-btn-secondary gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al sitio
            </Link>
            <button
              type="button"
              onClick={() => {
                setToken('');
                setError('');
              }}
              className="admin-btn-secondary"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
