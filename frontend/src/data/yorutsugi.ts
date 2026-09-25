export type YorutsugiProtagonist = {
  name: string;
  alias: string | null;
  imageUrl: string | null;
};

export type YorutsugiPublication = {
  title: string;
  label: string;
  url: string;
};

export type YorutsugiOfficialLink = {
  label: string;
  url: string;
};

export type YorutsugiContent = {
  title: string;
  route: string;
  label: string;
  format: string;
  genres: string[];
  editorialStatus: string;
  description: string;
  coverImageUrl: string | null;
  protagonists: YorutsugiProtagonist[];
  publications: YorutsugiPublication[];
  officialLinks: YorutsugiOfficialLink[];
};

export const yorutsugi: YorutsugiContent = {
  title: 'YORUTSUGI',
  route: '/trabajos/yorutsugi',
  label: 'Producción original',
  format: 'Manga original',
  genres: ['Fantasía', 'Acción'],
  editorialStatus: 'En desarrollo',
  description:
    'YORUTSUGI es un manga original de fantasía y acción producido por Kyoru Studio y actualmente en desarrollo.',
  coverImageUrl: null,
  protagonists: [
    { name: 'Kaena Homusaki', alias: null, imageUrl: null },
    { name: 'Haruki Fujinori', alias: null, imageUrl: null },
    { name: 'Rinka Mikazari', alias: 'Rin', imageUrl: null },
    { name: 'Daichi Gebara', alias: null, imageUrl: null },
    { name: 'Mizuki Yemari', alias: null, imageUrl: null },
  ],
  publications: [],
  officialLinks: [],
};
