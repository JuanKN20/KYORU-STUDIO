import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

type ServiceItem = {
  id: number;
  title: string;
  description: string;
  link: string;
  cta: string;
  toneClass: string;
};

const services: ServiceItem[] = [
  {
    id: 1,
    title: "Desarrollo Web",
    description:
      "Diseñamos y desarrollamos sitios, plataformas y aplicaciones digitales adaptadas a las necesidades de cada proyecto.",
    link: "/services",
    cta: "Explorar Desarrollo Web",
    toneClass:
      "bg-[radial-gradient(circle_at_15%_10%,rgba(179,23,47,0.35),transparent_48%),radial-gradient(circle_at_85%_20%,rgba(255,59,92,0.18),transparent_42%),linear-gradient(135deg,rgba(5,5,8,0.96)_0%,rgba(16,8,10,0.9)_55%,rgba(10,12,16,0.95)_100%)]",
  },
  {
    id: 2,
    title: "Modelado y Experiencias 3D",
    description:
      "Creamos modelos, entornos y experiencias tridimensionales para productos, espacios y proyectos digitales.",
    link: "/services",
    cta: "Explorar servicios 3D",
    toneClass:
      "bg-[radial-gradient(circle_at_80%_12%,rgba(255,59,92,0.24),transparent_40%),radial-gradient(circle_at_24%_80%,rgba(179,23,47,0.22),transparent_46%),linear-gradient(135deg,rgba(6,7,10,0.96)_0%,rgba(15,8,12,0.9)_62%,rgba(12,11,18,0.94)_100%)]",
  },
  {
    id: 3,
    title: "Animación y Contenido Digital",
    description:
      "Desarrollamos animaciones, piezas audiovisuales y contenido visual para marcas, productos y proyectos creativos.",
    link: "/services",
    cta: "Explorar contenido digital",
    toneClass:
      "bg-[radial-gradient(circle_at_22%_20%,rgba(179,23,47,0.3),transparent_45%),radial-gradient(circle_at_75%_75%,rgba(255,59,92,0.16),transparent_46%),linear-gradient(135deg,rgba(8,9,12,0.96)_0%,rgba(18,10,14,0.9)_58%,rgba(9,12,17,0.95)_100%)]",
  },
];

const ServicesCarousel: React.FC = () => {
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const currentService = services[currentServiceIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentServiceIndex((prevIndex) => (prevIndex + 1) % services.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 md:pt-10 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="akai-hud-line" />
        <p className="text-xs uppercase tracking-[0.24em] text-red-300">Servicios destacados</p>
      </div>
      <h2 className="akai-section-title mt-3">Capacidades de Kyoru Studio</h2>

      <div className="relative mt-8 min-h-[420px] overflow-hidden rounded-3xl border border-red-900/40 shadow-akai-soft md:min-h-[520px]">
        <div className={`absolute inset-0 transition-all duration-500 ${currentService.toneClass}`} />
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:34px_34px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35" />

        <div className="absolute inset-0 flex items-end p-5 sm:p-8 md:p-10">
          <div className="max-w-xl space-y-4 rounded-2xl border border-red-700/30 bg-black/40 p-5 backdrop-blur-md md:p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-red-200">Línea de negocio</p>
            <h3 className="text-2xl font-bold text-white md:text-3xl">{currentService.title}</h3>
            <p className="text-sm leading-relaxed text-zinc-200 md:text-base">{currentService.description}</p>
            <Link
              to={currentService.link}
              className="akai-btn-primary gap-2 px-5 py-2.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {currentService.cta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-5 left-5 flex gap-2 md:bottom-auto md:left-auto md:right-5 md:top-5 md:flex-col">
          {services.map((service, index) => (
            <button
              type="button"
              key={service.id}
              onClick={() => setCurrentServiceIndex(index)}
              className={`h-2.5 w-10 rounded-full transition ${
                index === currentServiceIndex
                  ? "bg-red-400 shadow-[0_0_16px_rgba(255,59,92,0.65)]"
                  : "bg-zinc-400/45"
              }`}
              aria-label={`Ver ${service.title}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesCarousel;
