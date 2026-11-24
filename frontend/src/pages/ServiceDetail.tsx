import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { disciplines, findDiscipline, positioning, servicePath } from '../data/disciplines';
import NotFound from './NotFound';

export default function ServiceDetail() {
  const { slug } = useParams();
  const discipline = findDiscipline(slug);
  if (!discipline) return <NotFound />;

  const { detail, position } = discipline;
  const next = disciplines[(disciplines.indexOf(discipline) + 1) % disciplines.length];

  return (
    <div className="bg-akai-black px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-36">
      <article className="mx-auto max-w-7xl">
        <Link to="/services" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-red-200 underline decoration-red-400/60 underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-300">
          <ArrowLeft size={16} aria-hidden="true" /> Todas las disciplinas
        </Link>
        <header className="mt-9 border-b border-red-900/60 pb-10 sm:pb-14">
          <h1 tabIndex={-1} data-route-focus="" className="max-w-5xl text-balance font-[family-name:var(--kyoru-font-display)] text-4xl font-bold leading-[1.04] tracking-tight text-akai-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-300 sm:text-6xl lg:text-7xl">
            {detail.title}
          </h1>
          <p className="mt-4 text-sm font-semibold text-red-200">{positioning[position].es}</p>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-zinc-200">{detail.description}</p>
        </header>
        <div className="grid gap-9 py-10 md:grid-cols-[1.35fr_1fr] md:gap-16 md:py-14">
          <section aria-labelledby="discipline-scope">
            <h2 id="discipline-scope" className="text-2xl font-semibold">Alcance</h2>
            <p className="mt-4 max-w-prose leading-relaxed text-zinc-300">{detail.scope}</p>
            {detail.cta && (
              <Link to={detail.cta.to} className="akai-btn-secondary mt-6 gap-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                {detail.cta.label} <ArrowRight size={16} aria-hidden="true" />
              </Link>
            )}
          </section>
          <section aria-labelledby="discipline-capabilities">
            <h2 id="discipline-capabilities" className="text-2xl font-semibold">Capacidades</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-zinc-300 marker:text-red-400">
              {detail.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
            </ul>
          </section>
        </div>
        <nav aria-label="Explorar disciplinas" className="border-t border-zinc-700 pt-6">
          <p className="text-sm text-zinc-400">Siguiente disciplina</p>
          <Link to={servicePath(next.slug)} className="inline-flex min-h-11 items-center gap-2 font-semibold text-red-200 underline decoration-red-400/60 underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-300">
            {next.detail.title} <ArrowRight className="shrink-0" size={16} aria-hidden="true" />
          </Link>
        </nav>
      </article>
    </div>
  );
}
