import React from 'react';
import { BookOpen } from 'lucide-react';
import { yorutsugi } from '../data/yorutsugi';

type YorutsugiArtworkProps = {
  className?: string;
  priority?: boolean;
};

const YorutsugiArtwork: React.FC<YorutsugiArtworkProps> = ({ className = '', priority = false }) => {
  if (yorutsugi.coverImageUrl) {
    return (
      <div className={`relative isolate overflow-hidden rounded-3xl border border-red-500/30 bg-black ${className}`}>
        <img
          src={yorutsugi.coverImageUrl}
          alt={`Portada oficial de ${yorutsugi.title}`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`relative isolate flex min-h-80 overflow-hidden rounded-3xl border border-red-500/30 bg-[#08090d] shadow-[0_26px_80px_rgba(0,0,0,0.5)] ${className}`}
    >
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_22%_20%,rgba(179,23,47,0.38),transparent_40%),radial-gradient(circle_at_80%_78%,rgba(255,59,92,0.16),transparent_36%),linear-gradient(145deg,#0c0d12_0%,#050506_60%,#13070a_100%)]" />
      <div className="absolute inset-0 -z-20 bg-akai-grid bg-[length:26px_26px] opacity-25 [mask-image:radial-gradient(circle_at_center,black_20%,transparent_86%)]" />
      <div className="absolute inset-5 -z-10 rounded-2xl border border-red-500/15 sm:inset-7" />
      <div className="absolute -left-16 top-1/3 -z-10 h-52 w-52 rounded-full border border-red-400/15" />
      <div className="absolute -right-20 bottom-8 -z-10 h-64 w-64 rounded-full border border-red-400/10" />

      <div className="flex w-full min-w-0 flex-col justify-between p-7 sm:p-9">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-red-200">
            <BookOpen className="h-4 w-4" />
            {yorutsugi.format}
          </span>
          <span className="rounded-full border border-red-500/35 bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-red-100">
            {yorutsugi.editorialStatus}
          </span>
        </div>

        <div className="my-12 min-w-0 text-center sm:my-16">
          <p className="whitespace-nowrap text-[clamp(2.15rem,7vw,5rem)] font-black leading-none tracking-[-0.065em] text-white">
            {yorutsugi.title}
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.28em] text-red-200 sm:text-sm">
            {yorutsugi.genres.join(' · ')}
          </p>
        </div>

        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Portada oficial pendiente de integración
        </p>
      </div>
    </div>
  );
};

export default YorutsugiArtwork;
