import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Boxes, Clapperboard, Code2, Cpu, Sparkles, Target, Zap } from 'lucide-react';
import ServicesCarousel from '../components/ServicesCarousel';
import { fallbackProjects } from '../data/fallbackProjects';
import { getPublicProjects, ProjectItem } from '../services/api';

function projectStatusLabel(status: ProjectItem['status']): string {
  if (status === 'published') return 'Publicado';
  if (status === 'coming_soon') return 'Próximamente';
  if (status === 'archived') return 'Archivado';
  return 'Borrador';
}

const differentiators = [
  {
    title: 'Creatividad con enfoque técnico',
    description: 'Diseñamos soluciones visuales con base sólida en arquitectura y desarrollo.',
    icon: Zap,
  },
  {
    title: 'Experiencias visualmente impactantes',
    description: 'Construimos productos con identidad estética fuerte y coherencia de marca.',
    icon: Sparkles,
  },
  {
    title: 'Soluciones adaptadas a cada proyecto',
    description: 'Cada propuesta se ajusta a objetivos reales, alcance y tipo de audiencia.',
    icon: Target,
  },
  {
    title: 'Integración de arte, tecnología e innovación',
    description: 'Unimos dirección creativa y ejecución técnica para producir experiencias premium.',
    icon: Cpu,
  },
];

const businessServices = [
  {
    title: 'Desarrollo Web',
    description: 'Diseñamos y desarrollamos sitios web, plataformas y aplicaciones digitales adaptadas a las necesidades de cada proyecto.',
    icon: Code2,
  },
  {
    title: 'Modelado y Experiencias 3D',
    description: 'Creamos modelos, entornos y experiencias tridimensionales para productos, espacios y proyectos digitales.',
    icon: Boxes,
  },
  {
    title: 'Animación y Contenido Digital',
    description: 'Desarrollamos animaciones 2D y 3D, piezas audiovisuales y contenido visual para marcas, productos y proyectos creativos.',
    icon: Clapperboard,
  },
];

const Home: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>(fallbackProjects);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadProjects = async () => {
      try {
        const apiProjects = await getPublicProjects();
        if (!mounted) return;
        if (apiProjects.length > 0) {
          setProjects(apiProjects);
        } else {
          setProjects(fallbackProjects);
        }
      } catch {
        if (!mounted) return;
        setProjects(fallbackProjects);
      } finally {
        if (mounted) {
          setIsLoadingProjects(false);
        }
      }
    };

    void loadProjects();

    return () => {
      mounted = false;
    };
  }, []);

  const featuredProjects = useMemo(() => projects.filter((item) => item.featured).slice(0, 3), [projects]);

  return (
    <div className="w-full">
      <section className="relative isolate overflow-hidden pt-28 sm:pt-32 lg:pt-36">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_18%_18%,rgba(179,23,47,0.24),transparent_44%),radial-gradient(circle_at_82%_22%,rgba(255,59,92,0.13),transparent_38%),linear-gradient(180deg,#0a0b0f_0%,#050506_58%,#08090d_100%)]"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-gradient-to-b from-black/75 via-black/80 to-black/95" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-akai-grid bg-[length:32px_32px] opacity-[0.16] [mask-image:radial-gradient(circle_at_center,black_15%,transparent_78%)]"
        />

        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)] lg:items-center xl:gap-16">
            <div className="space-y-7 animate-fade-up motion-reduce:animate-none sm:space-y-8">
              <div className="flex items-center gap-3">
                <div aria-hidden="true" className="h-px w-10 shrink-0 bg-gradient-to-r from-red-500/0 via-red-500/80 to-red-500/0 sm:w-16" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-300 sm:text-xs sm:tracking-[0.24em]">
                  ESTUDIO CREATIVO Y TECNOLÓGICO.
                </span>
              </div>

              <div>
                <h1 className="max-w-4xl text-[2.35rem] font-black leading-[1.06] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.35rem] xl:text-6xl">
                  Creamos experiencias digitales que conectan creatividad y tecnología.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
                  Desarrollamos soluciones web, experiencias 3D y contenido animado que transforman ideas en proyectos visuales,
                  funcionales y memorables.
                </p>
              </div>

              <ul className="grid gap-3 sm:grid-cols-3" aria-label="Pilares de servicio de Kyoru Studio">
                <li className="flex min-h-14 items-center gap-3 rounded-2xl border border-red-900/45 bg-black/35 p-3 backdrop-blur-sm">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-500/35 bg-red-950/45 text-red-200">
                    <Code2 className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold leading-snug text-zinc-100">Desarrollo Web</span>
                </li>
                <li className="flex min-h-14 items-center gap-3 rounded-2xl border border-red-900/45 bg-black/35 p-3 backdrop-blur-sm">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-500/35 bg-red-950/45 text-red-200">
                    <Boxes className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold leading-snug text-zinc-100">Modelado y Experiencias 3D</span>
                </li>
                <li className="flex min-h-14 items-center gap-3 rounded-2xl border border-red-900/45 bg-black/35 p-3 backdrop-blur-sm">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-500/35 bg-red-950/45 text-red-200">
                    <Clapperboard className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold leading-snug text-zinc-100">Animación y Contenido Digital</span>
                </li>
              </ul>

              <div className="flex flex-wrap items-center gap-3">
                <Link to="/services" className="akai-btn-primary motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                  Explorar servicios
                </Link>
                <Link to="/trabajos" className="akai-btn-secondary motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                  Ver proyectos
                </Link>
              </div>
            </div>

            <div className="animate-fade-up motion-reduce:animate-none lg:[animation-delay:120ms]">
              <div
                aria-hidden="true"
                className="relative mx-auto h-[260px] w-full max-w-[34rem] overflow-hidden rounded-[2rem] border border-red-500/20 bg-akai-gray/55 shadow-[0_28px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:h-[380px] lg:h-[440px]"
              >
                <div className="absolute inset-0 bg-akai-grid bg-[length:28px_28px] opacity-25 [mask-image:radial-gradient(circle_at_center,black_18%,transparent_82%)]" />
                <div className="absolute -left-16 top-1/3 h-52 w-52 rounded-full bg-red-700/20 blur-3xl" />
                <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-red-500/10 blur-3xl" />

                <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-3 sm:inset-x-7 sm:top-7">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-300" />
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500/70" />
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                  </div>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-400 sm:text-[10px] sm:tracking-[0.28em]">
                    Kyoru / Creative System
                  </span>
                </div>

                <div className="absolute left-1/2 top-[53%] aspect-square h-[74%] max-h-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/15" />
                <div className="absolute left-1/2 top-[53%] aspect-square h-[52%] max-h-[224px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-red-300/20" />
                <div className="absolute left-[18%] right-[18%] top-[53%] h-px bg-gradient-to-r from-transparent via-red-400/45 to-transparent" />
                <div className="absolute bottom-[12%] left-1/2 top-[28%] w-px bg-gradient-to-b from-transparent via-red-400/35 to-transparent" />

                <div className="absolute left-1/2 top-[53%] flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-red-400/35 bg-black/70 shadow-[0_0_50px_rgba(179,23,47,0.28)] sm:h-32 sm:w-32">
                  <div className="absolute inset-2 rounded-full border border-red-500/20" />
                  <span className="text-3xl font-black tracking-[-0.08em] text-white sm:text-4xl">K</span>
                  <span className="motion-safe:animate-pulse absolute right-[16%] top-[16%] h-2 w-2 rounded-full bg-red-300 shadow-[0_0_14px_rgba(252,165,165,0.9)]" />
                </div>

                <div className="absolute left-[6%] top-[23%] flex items-center gap-2 rounded-xl border border-red-500/25 bg-black/70 px-2.5 py-2 text-red-100 shadow-akai-soft sm:left-[8%] sm:px-3">
                  <Code2 className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] sm:text-xs">Web</span>
                </div>
                <div className="absolute right-[6%] top-[23%] flex items-center gap-2 rounded-xl border border-red-500/25 bg-black/70 px-2.5 py-2 text-red-100 shadow-akai-soft sm:right-[8%] sm:px-3">
                  <Boxes className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] sm:text-xs">3D</span>
                </div>
                <div className="absolute bottom-[7%] left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-red-500/25 bg-black/70 px-2.5 py-2 text-red-100 shadow-akai-soft sm:px-3">
                  <Clapperboard className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] sm:text-xs">Animación</span>
                </div>

                <div className="absolute bottom-4 left-4 h-8 w-8 border-b border-l border-red-500/25 sm:bottom-6 sm:left-6" />
                <div className="absolute right-4 top-16 h-8 w-8 border-r border-t border-red-500/25 sm:right-6 sm:top-20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="akai-page pt-8 md:pt-10">
        <div className="flex items-center gap-3">
          <div className="akai-hud-line" />
          <p className="text-xs uppercase tracking-[0.24em] text-red-300">Qué hacemos</p>
        </div>
        <h2 className="akai-section-title mt-3">Líneas de negocio de Kyoru Studio</h2>
        <p className="akai-section-subtitle">
          Integramos tecnología, creatividad y producción multimedia para construir soluciones digitales con identidad y alto impacto
          visual.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {businessServices.map((service) => {
            const Icon = service.icon;
            return (
              <Link key={service.title} to="/services" className="akai-card block p-6" aria-label={`Ver servicios de ${service.title}`}>
                <div className="inline-flex rounded-xl border border-red-500/35 bg-red-950/40 p-2 text-red-200">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{service.title}</h3>
                <p className="mt-2 text-sm text-zinc-300">{service.description}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-red-200">Ver servicios</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="akai-page pt-2 md:pt-2">
        <div className="flex items-center gap-3">
          <div className="akai-hud-line" />
          <p className="text-xs uppercase tracking-[0.24em] text-red-300">Destacados</p>
        </div>
        <h2 className="akai-section-title mt-3">Proyectos destacados</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {isLoadingProjects ? (
            <article className="akai-card p-6 md:col-span-2 xl:col-span-3">
              <p className="text-sm text-zinc-300">Cargando proyectos seleccionados...</p>
            </article>
          ) : featuredProjects.length > 0 ? (
            featuredProjects.map((project) => (
              <Link key={project.id} to="/trabajos" className="akai-card block p-5" aria-label={`Ver proyecto ${project.title}`}>
                <p className="text-xs uppercase tracking-[0.16em] text-red-300">{project.category || 'Proyecto'}</p>
                <h3 className="mt-2 text-lg font-semibold text-white">{project.title}</h3>
                <p className="mt-2 text-sm text-zinc-300">{project.short_description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="akai-chip">{projectStatusLabel(project.status)}</span>
                  {project.featured ? <span className="akai-chip">Destacado</span> : null}
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-red-200">Ver proyectos</p>
              </Link>
            ))
          ) : (
            <article className="akai-card p-6 md:col-span-2 xl:col-span-3">
              <h3 className="text-lg font-semibold text-white">Proyectos seleccionados</h3>
              <p className="mt-2 text-sm text-zinc-300">
                Estamos organizando casos para publicación. Puedes visitar la sección de trabajos para ver el portafolio completo.
              </p>
              <Link to="/trabajos" className="mt-4 inline-flex text-sm font-semibold text-red-200 underline underline-offset-4">
                Ir a proyectos
              </Link>
            </article>
          )}
        </div>
      </section>

      <section className="akai-page pt-2 md:pt-6">
        <div className="flex items-center gap-3">
          <div className="akai-hud-line" />
          <p className="text-xs uppercase tracking-[0.24em] text-red-300">Diferenciales</p>
        </div>
        <h2 className="akai-section-title mt-3">Por qué Kyoru Studio</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {differentiators.map((item) => (
            <article key={item.title} className="akai-card p-6">
              <div className="inline-flex rounded-xl border border-red-500/35 bg-red-950/40 p-2 text-red-200">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-zinc-300">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <ServicesCarousel />

      <section className="akai-page pb-20 pt-2 md:pt-4">
        <div className="akai-panel p-6 text-center md:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-red-300">Siguiente paso</p>
          <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">Hablemos de tu proyecto</h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-zinc-300 md:text-base">
            Si estás construyendo una marca, producto o experiencia digital, en Kyoru Studio podemos ayudarte a diseñarlo y
            desarrollarlo con un enfoque creativo y tecnológico.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="akai-btn-primary">
              Iniciar conversación
            </Link>
            <Link to="/services" className="akai-btn-secondary">
              Revisar servicios
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
