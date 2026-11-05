import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Gamepad2, Layers3, Palette, SlidersHorizontal, Sparkles } from 'lucide-react';
import { getPublicProducts, getPublicProjects, ProductItem, ProjectItem } from '../services/api';

type GameHighlight = {
  id: string;
  title: string;
  description: string;
  meta: string;
  status: string;
  source: 'project' | 'product';
  tags: string[];
  demoUrl?: string | null;
  repositoryUrl?: string | null;
};

type CatalogLoadState = 'loading' | 'ready' | 'error';

const capabilities = [
  {
    title: 'Prototipado jugable',
    description: 'Construimos prototipos funcionales para validar ideas, ritmo, objetivos y experiencia de usuario.',
    icon: SlidersHorizontal,
  },
  {
    title: 'Mecánicas y gameplay',
    description: 'Diseñamos sistemas de juego con equilibrio entre diversión, desafío, progresión y retención.',
    icon: Gamepad2,
  },
  {
    title: 'Narrativa y mundos',
    description: 'Desarrollamos universos, tono narrativo y dirección artística para experiencias con identidad.',
    icon: Layers3,
  },
  {
    title: 'Arte visual e interfaces',
    description: 'Integramos estilo gráfico, HUD y UI para reforzar inmersión y claridad durante la jugabilidad.',
    icon: Palette,
  },
  {
    title: 'Experiencias interactivas',
    description: 'Aplicamos lógica interactiva para productos lúdicos, demostraciones y activaciones digitales.',
    icon: Sparkles,
  },
  {
    title: 'Innovación técnica',
    description: 'Exploramos automatización, IA y nuevas tecnologías para potenciar productos interactivos.',
    icon: Cpu,
  },
];

const projectTypes = [
  {
    title: 'Conceptos y vertical slices',
    description: 'Validación temprana de ideas, tono visual y pilares de jugabilidad.',
  },
  {
    title: 'Prototipos para pitch',
    description: 'Versiones funcionales para presentar proyectos a aliados, clientes o inversionistas.',
  },
  {
    title: 'Experiencias para marca',
    description: 'Juegos y dinámicas interactivas para campañas, activaciones y comunicación digital.',
  },
];

const processSteps = [
  'Definición del concepto, objetivos y alcance del proyecto.',
  'Diseño de mecánicas, flujo de juego y dirección visual.',
  'Desarrollo del prototipo y validación iterativa.',
  'Ajustes finales y planificación de siguientes fases.',
];

function includesGameTerm(value: string | null | undefined): boolean {
  const content = String(value || '').toLowerCase();
  return (
    content.includes('juego') ||
    content.includes('videojuego') ||
    content.includes('game') ||
    content.includes('jugable') ||
    content.includes('interactivo') ||
    content.includes('narrativa')
  );
}

function isValidExternalUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function canShowRepository(value: string | null | undefined): boolean {
  if (!isValidExternalUrl(value)) return false;
  return String(value).toLowerCase().includes('github.com/');
}

function getPublicStatusLabel(status: ProjectItem['status']): string {
  return status === 'coming_soon' ? 'En desarrollo' : 'Publicado';
}

function mapGameProject(project: ProjectItem): GameHighlight {
  return {
    id: `project-${project.id}`,
    title: project.title,
    description: project.short_description,
    meta: project.category || 'Proyecto',
    status: getPublicStatusLabel(project.status),
    source: 'project',
    tags: Array.isArray(project.technologies) ? project.technologies.filter(Boolean).slice(0, 4) : [],
    demoUrl: project.demo_url,
    repositoryUrl: project.repository_url,
  };
}

function mapGameProduct(product: ProductItem): GameHighlight {
  return {
    id: `product-${product.id}`,
    title: product.title,
    description: product.short_description,
    meta: `Producto ${product.type}`,
    status: getPublicStatusLabel(product.status),
    source: 'product',
    tags: Array.isArray(product.tags) ? product.tags.filter(Boolean).slice(0, 4) : [],
  };
}

const Juegos: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [catalogState, setCatalogState] = useState<CatalogLoadState>('loading');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [apiProjects, apiProducts] = await Promise.all([getPublicProjects(), getPublicProducts()]);
        if (!mounted) return;

        setProjects(apiProjects);
        setProducts(apiProducts);
        setCatalogState('ready');
      } catch {
        if (!mounted) return;
        setProjects([]);
        setProducts([]);
        setCatalogState('error');
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  const isLoading = catalogState === 'loading';

  const highlights = useMemo(() => {
    const gameProjects = projects
      .filter(
        (item) =>
          (item.status === 'published' || item.status === 'coming_soon') &&
          (includesGameTerm(item.title) ||
            includesGameTerm(item.category) ||
            item.technologies.some((tech) => includesGameTerm(tech)) ||
            includesGameTerm(item.short_description)),
      )
      .sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

    const gameProducts = products
      .filter(
        (item) =>
          (item.status === 'published' || item.status === 'coming_soon') &&
          (item.type.toLowerCase() === 'game' ||
            item.tags.some((tag) => includesGameTerm(tag)) ||
            includesGameTerm(item.title) ||
            includesGameTerm(item.short_description)),
      )
      .sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

    return [...gameProjects.map(mapGameProject), ...gameProducts.map(mapGameProduct)].slice(0, 6);
  }, [products, projects]);

  return (
    <div className="akai-page">
      <section>
        <div className="flex items-center gap-3">
          <div className="akai-hud-line" />
          <p className="text-xs uppercase tracking-[0.24em] text-red-300">Línea de videojuegos</p>
        </div>
        <h1 className="akai-section-title mt-3">Videojuegos y experiencias interactivas</h1>
        <p className="akai-section-subtitle">
          Diseñamos conceptos, prototipos, mecánicas, interfaces y experiencias jugables que combinan narrativa visual, tecnología y
          dirección artística.
        </p>
        <p className="mt-3 max-w-4xl text-sm text-zinc-300 md:text-base">
          Esta línea de negocio está orientada a marcas, estudios y equipos que necesitan desarrollar ideas jugables, validar conceptos
          o construir experiencias interactivas con identidad visual y base técnica sólida.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/contact" className="akai-btn-primary">
            Hablemos de una idea
          </Link>
          <Link to="/trabajos" className="akai-btn-secondary">
            Ver proyectos
          </Link>
          <Link to="/services" className="akai-btn-secondary">
            Explorar servicios
          </Link>
        </div>
      </section>

      {isLoading ? (
        <section className="mt-8">
          <article className="akai-card p-6">
            <h2 className="text-lg font-semibold text-white">Capacidades de videojuegos</h2>
            <p className="mt-2 text-sm text-zinc-300">Cargando información de la línea de desarrollo interactivo...</p>
          </article>
        </section>
      ) : null}

      {!isLoading ? (
        <>
          {catalogState === 'error' ? (
            <section className="mt-8">
              <article className="akai-card p-5">
                <h2 className="text-lg font-semibold text-white">No pudimos cargar los proyectos</h2>
                <p className="mt-2 text-sm text-zinc-300">
                  El catálogo no está disponible en este momento. Para proteger la precisión del portafolio, no mostramos contenido
                  provisional cuando falla la conexión.
                </p>
              </article>
            </section>
          ) : null}

          <section className="mt-10">
            <div className="flex items-center gap-3">
              <div className="akai-hud-line" />
              <p className="text-xs uppercase tracking-[0.24em] text-red-300">Qué desarrollamos</p>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {capabilities.map((item) => (
                <article key={item.title} className="akai-card p-6">
                  <div className="inline-flex rounded-xl border border-red-500/35 bg-red-950/40 p-2 text-red-200">
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-white">{item.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300">{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-10 grid gap-4 md:grid-cols-2">
            <article className="akai-card p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-red-300">Tipos de proyectos</p>
              <div className="mt-4 space-y-4">
                {projectTypes.map((item) => (
                  <div key={item.title}>
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm text-zinc-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="akai-card p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-red-300">Proceso creativo</p>
              <ol className="mt-4 space-y-3">
                {processSteps.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm text-zinc-300">
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-red-500/45 bg-black/45 text-xs text-red-200">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </article>
          </section>

          {catalogState === 'ready' && highlights.length > 0 ? (
            <section className="mt-10">
              <div className="flex items-center gap-3">
                <div className="akai-hud-line" />
                <p className="text-xs uppercase tracking-[0.24em] text-red-300">Referencias relacionadas</p>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {highlights.map((item) => {
                  const hasDemo = item.source === 'project' && isValidExternalUrl(item.demoUrl);
                  const hasRepository = item.source === 'project' && canShowRepository(item.repositoryUrl);

                  return (
                    <article key={item.id} className="akai-card p-5">
                      <p className="text-xs uppercase tracking-[0.16em] text-red-300">{item.meta}</p>
                      <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
                      <p className="mt-2 text-sm text-zinc-300">{item.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="akai-chip">{item.status}</span>
                        {item.tags.length > 0
                          ? item.tags.map((tag) => (
                              <span key={`${item.id}-${tag}`} className="akai-chip">
                                {tag}
                              </span>
                            ))
                          : null}
                      </div>
                      <div className="mt-5 flex flex-wrap gap-3">
                        <Link to="/contact" className="akai-btn-primary">
                          Hablar de un proyecto
                        </Link>
                        <Link to="/trabajos" className="akai-btn-secondary">
                          Ver proyectos
                        </Link>
                        {hasDemo ? (
                          <a
                            href={item.demoUrl as string}
                            target="_blank"
                            rel="noreferrer"
                            className="akai-btn-secondary"
                            aria-label={`Ver demo de ${item.title}`}
                          >
                            Ver demo
                          </a>
                        ) : null}
                        {hasRepository ? (
                          <a
                            href={item.repositoryUrl as string}
                            target="_blank"
                            rel="noreferrer"
                            className="akai-btn-secondary"
                            aria-label={`Ver repositorio de ${item.title}`}
                          >
                            Repositorio
                          </a>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}

          {catalogState === 'ready' && highlights.length === 0 ? (
            <section className="mt-10">
              <article className="akai-card p-6">
                <h2 className="text-lg font-semibold text-white">Aún no hay trabajos publicados en esta categoría</h2>
                <p className="mt-2 text-sm text-zinc-300">
                  Los proyectos aparecerán aquí cuando su publicación haya sido aprobada. Si tienes una idea de juego o experiencia
                  interactiva, podemos evaluar su alcance contigo.
                </p>
                <Link to="/contact" className="mt-4 inline-flex text-sm font-semibold text-red-200 underline underline-offset-4">
                  Hablemos de una idea
                </Link>
              </article>
            </section>
          ) : null}
        </>
      ) : null}

      <section className="pt-12">
        <div className="akai-panel p-6 text-center md:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-red-300">Siguiente paso</p>
          <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">Convirtamos tu idea en experiencia jugable</h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-zinc-300 md:text-base">
            Si quieres desarrollar un concepto de videojuego, prototipo o producto interactivo, diseñamos contigo una propuesta clara,
            visual y técnicamente viable.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="akai-btn-primary">
              Hablemos de una idea
            </Link>
            <Link to="/services" className="akai-btn-secondary">
              Explorar servicios
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Juegos;
