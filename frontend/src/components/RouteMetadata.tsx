import { useEffect } from 'react';

const SITE_URL = 'https://kyorustudio.com';
const SOCIAL_IMAGE_URL = `${SITE_URL}/images/Kyoru/Logo%20Kyoru.png`;

type RouteMetadataEntry = {
  title: string;
  description: string;
  language: 'en' | 'es';
  locale: 'en_US' | 'es_CO';
};

const routeMetadata: Record<string, RouteMetadataEntry> = {
  '/': {
    title: 'Kyoru Studio | Independent Creative Studio',
    description:
      'Kyoru Studio creates digital experiences, visual productions and original worlds where art, technology and storytelling become one.',
    language: 'en',
    locale: 'en_US',
  },
  '/services': {
    title: 'Servicios creativos y tecnológicos | Kyoru Studio',
    description:
      'Desarrollo web, modelado y experiencias 3D, animación y contenido digital para proyectos creativos y tecnológicos.',
    language: 'es',
    locale: 'es_CO',
  },
  '/trabajos': {
    title: 'Proyectos y producciones originales | Kyoru Studio',
    description:
      'Explora los proyectos, producciones originales y mundos creativos desarrollados por Kyoru Studio.',
    language: 'es',
    locale: 'es_CO',
  },
  '/trabajos/yorutsugi': {
    title: 'YORUTSUGI | Producción original de Kyoru Studio',
    description:
      'Conoce YORUTSUGI, manga original de fantasía y acción producido por Kyoru Studio y actualmente en desarrollo.',
    language: 'es',
    locale: 'es_CO',
  },
  '/estudio': {
    title: 'Estudio creativo y tecnológico | Kyoru Studio',
    description:
      'Conoce el enfoque de Kyoru Studio: creatividad, tecnología y narrativa aplicadas a experiencias digitales y producciones visuales.',
    language: 'es',
    locale: 'es_CO',
  },
  '/juegos': {
    title: 'Videojuegos y experiencias interactivas | Kyoru Studio',
    description:
      'Capacidades de Kyoru Studio para prototipos, mecánicas, narrativa, arte y experiencias interactivas.',
    language: 'es',
    locale: 'es_CO',
  },
  '/contact': {
    title: 'Contacto | Kyoru Studio',
    description:
      'Comparte tu idea o proyecto con Kyoru Studio para iniciar una conversación sobre su dirección creativa y tecnológica.',
    language: 'es',
    locale: 'es_CO',
  },
};

function setMetaContent(selector: string, content: string) {
  const element = document.head.querySelector<HTMLMetaElement>(selector);
  if (element) element.content = content;
}

function setCanonical(url: string | null) {
  const existingCanonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!url) {
    existingCanonical?.remove();
    return;
  }

  const canonical = existingCanonical ?? document.createElement('link');
  canonical.rel = 'canonical';
  canonical.href = url;
  if (!existingCanonical) document.head.append(canonical);
}

type RouteMetadataProps = {
  pathname: string;
};

export default function RouteMetadata({ pathname }: RouteMetadataProps) {
  useEffect(() => {
    const metadata = routeMetadata[pathname];
    const isIndexable = Boolean(metadata);
    const title = metadata?.title ?? 'Página no encontrada | Kyoru Studio';
    const description =
      metadata?.description ?? 'La página solicitada no existe o ya no está disponible en Kyoru Studio.';
    const locale = metadata?.locale ?? 'es_CO';

    document.title = title;
    document.documentElement.lang = metadata?.language ?? 'es';

    setCanonical(isIndexable ? new URL(pathname, SITE_URL).toString() : null);
    setMetaContent('meta[name="robots"]', isIndexable ? 'index,follow' : 'noindex,follow');
    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[property="og:url"]', isIndexable ? new URL(pathname, SITE_URL).toString() : SITE_URL);
    setMetaContent('meta[property="og:locale"]', locale);
    setMetaContent('meta[property="og:locale:alternate"]', locale === 'en_US' ? 'es_CO' : 'en_US');
    setMetaContent('meta[property="og:image"]', SOCIAL_IMAGE_URL);
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', description);
    setMetaContent('meta[name="twitter:image"]', SOCIAL_IMAGE_URL);
  }, [pathname]);

  return null;
}
