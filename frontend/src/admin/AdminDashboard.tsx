import React, { useEffect, useMemo, useState } from 'react';
import { getAdminContacts, getAdminProducts, getAdminProjects, getAdminServices } from './adminApi';
import { ProductItem, ProjectItem, ServiceItem } from '../services/api';

type Stats = {
  totalProjects: number;
  totalServices: number;
  activeServices: number;
  totalProducts: number;
  totalContacts: number;
  newContacts: number;
  publishedProjects: number;
  publishedProducts: number;
};

function buildStats(projects: ProjectItem[], services: ServiceItem[], products: ProductItem[], contacts: { status: string }[]): Stats {
  return {
    totalProjects: projects.length,
    totalServices: services.length,
    activeServices: services.filter((item) => item.is_active).length,
    totalProducts: products.length,
    totalContacts: contacts.length,
    newContacts: contacts.filter((item) => item.status === 'new').length,
    publishedProjects: projects.filter((item) => item.status === 'published').length,
    publishedProducts: products.filter((item) => item.status === 'published').length,
  };
}

const DashboardCard: React.FC<{ title: string; value: number; subtitle: string }> = ({ title, value, subtitle }) => (
  <article className="akai-card p-4">
    <p className="admin-kicker">{title}</p>
    <p className="mt-3 text-3xl font-bold text-white">{value}</p>
    <p className="mt-2 text-xs text-zinc-400">{subtitle}</p>
  </article>
);

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const cards = useMemo(
    () =>
      stats
        ? [
            { title: 'Proyectos', value: stats.totalProjects, subtitle: `${stats.publishedProjects} publicados` },
            {
              title: 'Servicios',
              value: stats.totalServices,
              subtitle: `${stats.activeServices} activos · registros administrativos`,
            },
            { title: 'Productos', value: stats.totalProducts, subtitle: `${stats.publishedProducts} publicados` },
            { title: 'Contactos', value: stats.totalContacts, subtitle: `${stats.newContacts} nuevos` },
          ]
        : [],
    [stats],
  );

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const [projects, services, products, contacts] = await Promise.all([
          getAdminProjects(),
          getAdminServices(),
          getAdminProducts(),
          getAdminContacts(),
        ]);

        if (mounted) {
          setStats(buildStats(projects, services, products, contacts));
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar las métricas del panel.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, [reloadKey]);

  return (
    <section className="space-y-4">
      <header className="admin-surface p-4 sm:p-5">
        <p className="admin-kicker">Panel interno</p>
        <h1 className="mt-1 text-2xl font-bold text-white">Dashboard admin</h1>
        <p className="mt-1 text-sm text-zinc-300">Resumen operativo para la gestión de contenido de Kyoru Studio.</p>
      </header>

      {error ? (
        <div role="alert" className="rounded-xl border border-red-700/60 bg-red-950/35 px-4 py-3 text-sm text-red-100">
          <p>{error}</p>
          <button type="button" onClick={() => setReloadKey((value) => value + 1)} className="admin-btn-secondary mt-3 px-3 py-2 text-xs">
            Reintentar
          </button>
        </div>
      ) : null}

      {loading ? (
        <div role="status" aria-live="polite" className="admin-surface p-5 text-sm text-zinc-300">
          Cargando métricas del panel...
        </div>
      ) : null}

      {!loading && !error && stats ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((item) => (
            <DashboardCard key={item.title} title={item.title} value={item.value} subtitle={item.subtitle} />
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default AdminDashboard;
