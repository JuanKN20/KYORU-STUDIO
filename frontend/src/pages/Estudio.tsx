import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Boxes, Clapperboard, Code2 } from 'lucide-react';

const studioAreas = [
  {
    number: '01',
    title: 'Desarrollo Web',
    description: 'Construimos sitios, interfaces y productos digitales claros, funcionales y adaptados a cada proyecto.',
    icon: Code2,
  },
  {
    number: '02',
    title: 'Modelado y Experiencias 3D',
    description: 'Damos forma tridimensional a productos, espacios y conceptos para visualizar y explorar ideas.',
    icon: Boxes,
  },
  {
    number: '03',
    title: 'Animación y Contenido Digital',
    description: 'Comunicamos ideas mediante movimiento, narrativa visual y piezas digitales.',
    icon: Clapperboard,
  },
];

const processSteps = [
  {
    number: '01',
    title: 'Entender',
    description: 'Partimos de la necesidad, el contexto y los objetivos para definir qué debe resolver el proyecto.',
  },
  {
    number: '02',
    title: 'Diseñar',
    description: 'Establecemos una dirección visual y técnica coherente con el alcance y la experiencia buscada.',
  },
  {
    number: '03',
    title: 'Construir',
    description: 'Convertimos esa dirección en una solución funcional, cuidando las disciplinas que intervienen.',
  },
  {
    number: '04',
    title: 'Refinar',
    description: 'Revisamos y ajustamos el resultado para que sea claro, sólido y consistente.',
  },
];

const Estudio: React.FC = () => {
  return (
    <div className="w-full overflow-hidden">
      <header className="relative isolate overflow-hidden pt-28 sm:pt-32 lg:pt-36" aria-labelledby="studio-page-title">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_16%_18%,rgba(179,23,47,0.24),transparent_42%),radial-gradient(circle_at_84%_28%,rgba(255,59,92,0.12),transparent_38%),linear-gradient(180deg,#0a0b0f_0%,#050506_62%,#08090d_100%)]"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-gradient-to-b from-black/70 via-black/80 to-black/95" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-akai-grid bg-[length:32px_32px] opacity-[0.15] [mask-image:radial-gradient(circle_at_center,black_18%,transparent_80%)]"
        />

        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
          <div className="grid min-w-0 gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)] lg:items-center lg:gap-14 xl:gap-16">
            <div className="min-w-0 animate-fade-up motion-reduce:animate-none">
              <div className="flex items-center gap-3">
                <div aria-hidden="true" className="akai-hud-line" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-300 sm:text-xs sm:tracking-[0.24em]">
                  ESTUDIO CREATIVO Y TECNOLÓGICO
                </p>
              </div>

              <h1
                id="studio-page-title"
                className="mt-6 max-w-4xl break-words text-[2.45rem] font-black leading-[1.07] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.5rem] xl:text-6xl"
              >
                Damos forma a ideas en las que la creatividad y la tecnología trabajan juntas.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
                Kyoru Studio desarrolla soluciones y experiencias digitales integrando desarrollo web, 3D y producción visual bajo
                una dirección coherente para cada proyecto.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  to="/contact"
                  className="akai-btn-primary w-full gap-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-auto"
                >
                  Hablemos de tu proyecto
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/trabajos"
                  className="akai-btn-secondary w-full motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-auto"
                >
                  Ver nuestros trabajos
                </Link>
              </div>
            </div>

            <div className="animate-fade-up motion-reduce:animate-none lg:[animation-delay:120ms]">
              <div
                aria-hidden="true"
                className="relative mx-auto min-h-[21rem] w-full max-w-[34rem] overflow-hidden rounded-[2rem] border border-red-500/20 bg-akai-gray/55 shadow-[0_28px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:min-h-[25rem]"
              >
                <div className="absolute inset-0 bg-akai-grid bg-[length:28px_28px] opacity-25 [mask-image:radial-gradient(circle_at_center,black_18%,transparent_82%)]" />
                <div className="absolute -left-20 top-1/4 h-56 w-56 rounded-full bg-red-700/20 blur-3xl" />
                <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-red-500/10 blur-3xl" />

                <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-3 sm:inset-x-7 sm:top-7">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-300" />
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500/70" />
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                  </div>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-400 sm:text-[10px] sm:tracking-[0.24em]">
                    Kyoru / Studio System
                  </span>
                </div>

                <div className="absolute left-1/2 top-[48%] aspect-square h-[58%] max-h-[15rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/15" />
                <div className="absolute left-1/2 top-[48%] aspect-square h-[40%] max-h-[10rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-red-300/25" />
                <div className="absolute left-[12%] right-[12%] top-[48%] h-px bg-gradient-to-r from-transparent via-red-400/40 to-transparent" />
                <div className="absolute bottom-[22%] left-1/2 top-[20%] w-px bg-gradient-to-b from-transparent via-red-400/35 to-transparent" />

                <div className="absolute left-1/2 top-[48%] flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-red-400/35 bg-black/75 shadow-[0_0_50px_rgba(179,23,47,0.28)] sm:h-28 sm:w-28">
                  <div className="absolute inset-2 rounded-full border border-red-500/20" />
                  <span className="text-3xl font-black tracking-[-0.08em] text-white sm:text-4xl">K</span>
                  <span className="motion-safe:animate-pulse absolute right-[16%] top-[16%] h-2 w-2 rounded-full bg-red-300 shadow-[0_0_14px_rgba(252,165,165,0.9)]" />
                </div>

                <div className="absolute inset-x-4 bottom-5 grid grid-cols-3 gap-2 sm:inset-x-6 sm:bottom-7 sm:gap-3">
                  {['Web', '3D', 'Animación'].map((discipline) => (
                    <div
                      key={discipline}
                      className="flex min-h-11 min-w-0 items-center justify-center rounded-xl border border-red-500/25 bg-black/70 px-2 py-2 text-center shadow-akai-soft"
                    >
                      <span className="break-words text-[9px] font-bold uppercase tracking-[0.1em] text-red-100 sm:text-[10px] sm:tracking-[0.14em]">
                        {discipline}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section
        aria-labelledby="about-kyoru-title"
        className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-12 lg:px-8 lg:py-24"
      >
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <div aria-hidden="true" className="akai-hud-line" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300">QUIÉN ES KYORU</p>
          </div>
          <h2 id="about-kyoru-title" className="akai-section-title mt-3">
            Un estudio multidisciplinario para construir experiencias digitales.
          </h2>
        </div>

        <div className="akai-panel p-6 sm:p-8">
          <p className="text-base leading-relaxed text-zinc-200 sm:text-lg">
            Kyoru Studio combina creatividad, tecnología y producción digital para transformar ideas en soluciones visuales y
            funcionales.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
            Cada proyecto parte de una necesidad concreta y busca una dirección clara entre concepto, forma y ejecución, sin separar
            la intención creativa de la realidad técnica.
          </p>

          <ul className="mt-7 grid gap-3 sm:grid-cols-3" aria-label="Enfoque multidisciplinario de Kyoru Studio">
            {['Creatividad', 'Tecnología', 'Producción digital'].map((focus) => (
              <li key={focus} className="rounded-2xl border border-red-900/35 bg-black/25 px-4 py-4 text-sm font-semibold text-zinc-100">
                <span aria-hidden="true" className="mr-2 text-red-300">/</span>
                {focus}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="studio-areas-title" className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <div aria-hidden="true" className="akai-hud-line" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300">ÁREAS DE TRABAJO</p>
          </div>
          <h2 id="studio-areas-title" className="akai-section-title mt-3">
            Tres disciplinas, una visión integrada.
          </h2>
          <p className="akai-section-subtitle leading-relaxed">
            Las áreas de Kyoru pueden responder a una necesidad específica o combinarse para construir una experiencia coherente.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {studioAreas.map((area) => {
            const Icon = area.icon;
            const headingId = `studio-area-${area.number}-title`;

            return (
              <article
                key={area.number}
                aria-labelledby={headingId}
                className="akai-card relative flex h-full min-w-0 flex-col overflow-hidden p-6 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7 md:last:col-span-2 lg:last:col-span-1"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-400/70 to-transparent"
                />
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/35 bg-red-950/45 text-red-100">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-black tracking-[0.22em] text-red-300">{area.number}</span>
                </div>
                <h3 id={headingId} className="mt-6 text-2xl font-bold leading-tight text-white">
                  {area.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">{area.description}</p>
              </article>
            );
          })}
        </div>

        <Link
          to="/services"
          className="akai-btn-secondary mt-8 gap-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          Explorar todos los servicios
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>

      <section
        aria-labelledby="studio-process-title"
        className="relative isolate overflow-hidden border-y border-red-950/45 bg-black/25 py-16 sm:py-20 lg:py-24"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-akai-grid bg-[length:32px_32px] opacity-[0.08] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"
        />
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <div aria-hidden="true" className="akai-hud-line" />
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300">NUESTRO ENFOQUE</p>
            </div>
            <h2 id="studio-process-title" className="akai-section-title mt-3">
              Un proceso claro para avanzar de la idea al resultado.
            </h2>
            <p className="akai-section-subtitle leading-relaxed">
              Una estructura sencilla para tomar decisiones, construir con intención y revisar cada resultado antes de darlo por terminado.
            </p>
          </div>

          <ol className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {processSteps.map((step) => (
              <li key={step.number} className="min-w-0">
                <article className="akai-panel h-full p-6 sm:p-7">
                  <p className="text-sm font-black tracking-[0.22em] text-red-300">{step.number}</p>
                  <h3 className="mt-5 text-2xl font-bold text-white">{step.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-300">{step.description}</p>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="studio-principles-title" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <div aria-hidden="true" className="akai-hud-line" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300">DIRECCIÓN</p>
          </div>
          <h2 id="studio-principles-title" className="akai-section-title mt-3">
            Lo que guía al estudio.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <article className="akai-panel relative overflow-hidden p-6 sm:p-8">
            <div aria-hidden="true" className="absolute right-0 top-0 h-32 w-32 rounded-full bg-red-600/10 blur-3xl" />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">MISIÓN</p>
            <h3 className="mt-4 text-2xl font-bold leading-tight text-white sm:text-3xl">Crear con propósito y ejecutar con claridad.</h3>
            <p className="mt-5 text-sm leading-relaxed text-zinc-300 sm:text-base">
              Crear soluciones y experiencias digitales que conecten creatividad, tecnología y ejecución para transformar ideas en
              proyectos claros, funcionales y memorables.
            </p>
          </article>

          <article className="akai-panel relative overflow-hidden p-6 sm:p-8">
            <div aria-hidden="true" className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-red-600/10 blur-3xl" />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">VISIÓN</p>
            <h3 className="mt-4 text-2xl font-bold leading-tight text-white sm:text-3xl">Crecer como un estudio con identidad propia.</h3>
            <p className="mt-5 text-sm leading-relaxed text-zinc-300 sm:text-base">
              Consolidar Kyoru Studio como un estudio creativo y tecnológico que crezca de forma responsable, amplíe sus capacidades
              y desarrolle proyectos con identidad y valor duradero.
            </p>
          </article>
        </div>
      </section>

      <section aria-labelledby="studio-originals-title" className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <article className="akai-panel relative isolate overflow-hidden p-6 sm:p-8 lg:p-10">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_85%_30%,rgba(179,23,47,0.22),transparent_40%),linear-gradient(135deg,rgba(10,10,14,0.78),rgba(4,4,6,0.94))]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-akai-grid bg-[length:30px_30px] opacity-[0.1] [mask-image:radial-gradient(circle_at_75%_40%,black_5%,transparent_65%)]"
          />

          <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)] lg:items-center lg:gap-12">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div aria-hidden="true" className="akai-hud-line" />
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300">PRODUCCIONES ORIGINALES</p>
              </div>
              <h2 id="studio-originals-title" className="akai-section-title mt-3">
                Ideas que también nacen dentro del estudio.
              </h2>
              <p className="mt-5 max-w-3xl text-sm leading-relaxed text-zinc-300 sm:text-base">
                Kyoru también desarrolla propiedad intelectual y producciones originales. YORUTSUGI es la primera obra presentada por
                el estudio y actualmente se encuentra en desarrollo.
              </p>
              <Link
                to="/trabajos/yorutsugi"
                className="akai-btn-secondary mt-7 gap-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                Conocer YORUTSUGI
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="relative min-w-0 rounded-3xl border border-red-500/25 bg-black/55 p-6 text-center shadow-akai-soft sm:p-8">
              <BookOpen className="mx-auto h-7 w-7 text-red-200" aria-hidden="true" />
              <p className="mt-5 break-words text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">YORUTSUGI</p>
              <span className="akai-chip mt-4">En desarrollo</span>
            </div>
          </div>
        </article>
      </section>

      <section aria-labelledby="studio-contact-title" className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24">
        <div className="akai-panel relative isolate overflow-hidden px-6 py-10 text-center sm:px-10 sm:py-12 lg:px-16 lg:py-14">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_120%,rgba(179,23,47,0.3),transparent_48%),linear-gradient(135deg,rgba(10,10,14,0.82),rgba(4,4,6,0.94))]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-akai-grid bg-[length:30px_30px] opacity-[0.12] [mask-image:radial-gradient(circle_at_center,black_10%,transparent_78%)]"
          />

          <div className="mx-auto max-w-3xl animate-fade-up motion-reduce:animate-none">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300">HABLEMOS DE TU PROYECTO</p>
            <h2 id="studio-contact-title" className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Conversemos sobre lo que quieres crear.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
              Cuéntanos tu idea, necesidad o punto de partida para explorar una dirección creativa y tecnológica adecuada para el
              proyecto.
            </p>
            <Link
              to="/contact"
              className="akai-btn-primary mt-7 gap-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              Iniciar conversación
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Estudio;
