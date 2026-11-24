type Position = 'commercial' | 'discussion' | 'original' | 'experimental';

export const positioning = {
  commercial: { en: 'Commercial service', es: 'Servicio comercial' },
  discussion: { en: 'Available for discussion', es: 'Disponible bajo consulta' },
  original: { en: 'Creative practice & original IP', es: 'Práctica artística y producción original' },
  experimental: { en: 'Exploration & development', es: 'Investigación y desarrollo experimental' },
} satisfies Record<Position, { en: string; es: string }>;

type Discipline = {
  id: string;
  slug: string;
  position: Position;
  legacyAnchor?: string;
  home: { title: string; description: string; areas: string[]; headline: string; panel: string; explore: string };
  detail: {
    title: string;
    description: string;
    capabilities: string[];
    scope: string;
    cta?: { label: string; to: '/contact' | '/trabajos/yorutsugi' };
  };
};

export const disciplines: readonly Discipline[] = [
  {
    id: 'digital', slug: 'digital-web', position: 'commercial', legacyAnchor: 'desarrollo-web',
    home: {
      title: 'DIGITAL & WEB', description: 'Websites, interfaces and digital experiences shaped around how people use them.', areas: ['Web development', 'UI/UX', 'Interfaces', 'Interactive digital experiences'],
      headline: 'Ideas made interactive.', panel: 'Websites, interfaces and digital products where design and development work together to create meaningful experiences.',
      explore: 'Explore digital & web',
    },
    detail: {
      title: 'Desarrollo Web',
      description: 'Diseñamos y desarrollamos soluciones web adaptadas a los objetivos, contenidos y necesidades de cada proyecto, desde una presencia corporativa hasta productos digitales interactivos.',
      capabilities: ['Sitios corporativos', 'Landing pages', 'Plataformas y aplicaciones web', 'Interfaces y UI/UX', 'Experiencias digitales interactivas'],
      scope: 'El alcance puede ir desde un sitio corporativo hasta una aplicación web. La estructura de contenidos, los flujos de uso y las necesidades de interacción orientan el diseño y el desarrollo.',
      cta: { label: 'Consultar un proyecto web', to: '/contact' },
    },
  },
  {
    id: 'design', slug: 'design-branding', position: 'discussion',
    home: {
      title: 'DESIGN & BRANDING', description: 'Graphic design, identity and art direction bring a consistent visual language to a project.', areas: ['Graphic design', 'Visual identity', 'Branding', 'Art direction'],
      headline: 'Identity with intention.', panel: 'Visual identities and design systems that give projects a distinctive character and a consistent creative language.',
      explore: 'Explore design & branding',
    },
    detail: {
      title: 'Diseño e Identidad Visual',
      description: 'Diseño gráfico, identidad visual y dirección artística para dar carácter y coherencia a un proyecto.',
      capabilities: ['Diseño gráfico', 'Identidad visual', 'Branding', 'Dirección artística'],
      scope: 'La conversación parte de las necesidades del proyecto: definir un lenguaje visual o aplicarlo de forma coherente a distintas piezas. El alcance se evalúa caso por caso.',
      cta: { label: 'Conversar sobre un proyecto de diseño', to: '/contact' },
    },
  },
  {
    id: 'illustration', slug: 'illustration-manga', position: 'original',
    home: {
      title: 'ILLUSTRATION & MANGA', description: 'Illustration and character design give narrative ideas a visual form, from concept art to manga and worldbuilding.', areas: ['2D illustration', 'Manga', 'Character design', 'Concept art', 'Visual worldbuilding'],
      headline: 'Stories drawn into existence.', panel: 'Characters, illustrations and fictional worlds shaped through visual storytelling and original artistic direction.',
      explore: 'Explore illustration & manga',
    },
    detail: {
      title: 'Ilustración y Manga',
      description: 'Personajes, ilustraciones y mundos de ficción construidos a través de la narrativa visual.',
      capabilities: ['Ilustración 2D', 'Manga', 'Diseño de personajes', 'Arte conceptual', 'Construcción visual de mundos'],
      scope: 'La ilustración explora el carácter y la atmósfera de una historia. En manga, la composición y la secuencia de viñetas también construyen su ritmo. YORUTSUGI es una producción original en desarrollo.',
      cta: { label: 'Explorar YORUTSUGI', to: '/trabajos/yorutsugi' },
    },
  },
  {
    id: '3d', slug: '3d-visualization', position: 'commercial', legacyAnchor: 'modelado-experiencias-3d',
    home: {
      title: '3D & VISUALIZATION', description: 'Models, environments and rendered images turn spatial ideas into digital scenes and experiences.', areas: ['3D modeling', 'Environments', 'Rendering', 'Digital visualization', '3D experiences'],
      headline: 'Giving imagination dimension.', panel: 'Digital objects, environments and visualizations that bring spatial ideas into tangible form.',
      explore: 'Explore 3D & visualization',
    },
    detail: {
      title: 'Modelado y Experiencias 3D',
      description: 'Creamos recursos, espacios y experiencias tridimensionales para comunicar productos, visualizar ideas y desarrollar propuestas digitales inmersivas.',
      capabilities: ['Modelado 3D', 'Visualización y renderizado 3D', 'Entornos digitales', 'Experiencias tridimensionales interactivas'],
      scope: 'El alcance distingue entre crear un objeto o escenario, producir una visualización renderizada y explorar una experiencia interactiva. El formato depende del uso previsto.',
      cta: { label: 'Consultar un proyecto 3D', to: '/contact' },
    },
  },
  {
    id: 'motion', slug: 'animation-motion', position: 'commercial', legacyAnchor: 'animacion-contenido-digital',
    home: {
      title: 'ANIMATION & MOTION', description: 'Animation, motion graphics and audiovisual production connect visual craft with timing and storytelling.', areas: ['2D animation', '3D animation', 'Motion graphics', 'Audiovisual production', 'Animated content'],
      headline: 'Stories brought to life.', panel: 'Animated images and audiovisual experiences that connect visual craft, movement and storytelling.',
      explore: 'Explore animation & motion',
    },
    detail: {
      title: 'Animación y Contenido Digital',
      description: 'Damos movimiento a ideas y mensajes mediante piezas visuales pensadas para marcas, productos y proyectos creativos.',
      capabilities: ['Animación 2D y 3D', 'Motion graphics', 'Piezas audiovisuales', 'Contenido visual digital y animado'],
      scope: 'El enfoque combina dirección visual, movimiento y ritmo. La duración, el soporte y lo que la pieza necesita comunicar orientan el alcance de producción.',
      cta: { label: 'Consultar un proyecto de animación', to: '/contact' },
    },
  },
  {
    id: 'games', slug: 'games-interactive', position: 'experimental',
    home: {
      title: 'GAMES & INTERACTIVE', description: 'An area of exploration and development: game prototypes and playable experiences built through creative experimentation.', areas: ['Game development exploration', 'Interactive prototypes', 'Playable experiences', 'Creative work with game engines'],
      headline: 'Worlds made to be experienced.', panel: 'An experimental practice exploring game prototypes, interactive narratives and playable digital worlds.',
      explore: 'Explore games & interactive',
    },
    detail: {
      title: 'Videojuegos y Experiencias Interactivas',
      description: 'Investigación y desarrollo experimental en prototipos de juegos, narrativas interactivas y mundos jugables.',
      capabilities: ['Prototipado de juegos', 'Narrativas interactivas', 'Exploración de motores y tecnologías de videojuegos'],
      scope: 'Esta práctica explora cómo las decisiones del jugador, las reglas y el espacio digital pueden contribuir a una experiencia narrativa. No se presenta como un servicio comercial ni como un catálogo de juegos terminados.',
    },
  },
];

export const servicePath = (slug: string) => `/services/${slug}`;
export const findDiscipline = (slug: string | undefined) => disciplines.find((item) => item.slug === slug);
