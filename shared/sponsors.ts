// Partner banners shown in the footer of every instance. `image` is an absolute path on the main site
// (static/), so project instances load it from there instead of from under their own base URL.
export type Sponsor = {name: string; href: string; image: string; alt: string};

export const SPONSORS: Sponsor[] = [
  {
    name: 'RealisticNode',
    href: 'https://realisticnode.com/beepsterr',
    image: '/img/sponsors/realisticnode.webp',
    alt: 'RealisticNode — 10% off game servers with code BEEPSTERR',
  },
];
