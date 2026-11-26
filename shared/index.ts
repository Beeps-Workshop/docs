import path from 'path';
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config, LoadContext, Plugin} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {PROJECTS, type Project} from './projects';
import {crossInstanceLink} from './links';

// The look every workshop instance shares (the main site and each project's docs): navbar, footer,
// prism, colour mode, custom.css and the swizzled Footer. Runs in Node.js at config time.

export type WorkshopOptions = {
  /** The project this instance documents. Marks it active in the navbar and applies its accent. */
  projectId?: string;
};

// Ads are off (see ADS_ENABLED in shared/components/AdUnit.tsx). To turn them back on, flip that
// and add the AdSense loader to the config withWorkshop returns:
//   scripts: [{src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6217402110753644', async: true, crossorigin: 'anonymous'}],

/** Adds the shared look to an instance's config. */
export function withWorkshop(config: Config, opts: WorkshopOptions = {}): Config {
  const project = findProject(opts.projectId);
  return {
    ...config,
    url: 'https://workshop.beepsterr.com',
    baseUrl: process.env.DOCS_BASE_URL ?? '/',
    plugins: [...(config.plugins ?? []), [workshopPlugin, opts]],
    themeConfig: {
      ...config.themeConfig,
      colorMode: {respectPrefersColorScheme: true},
      navbar: navbar(project),
      footer: {
        style: 'dark',
        links: [
          {
            title: 'More',
            items: [
              {label: 'Contact', ...crossInstanceLink('/contact')},
              {label: 'Privacy Policy', ...crossInstanceLink('/privacy')},
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Beep's Workshop.`,
      },
      prism: {
        additionalLanguages: ['java', 'yaml'],
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    } satisfies Preset.ThemeConfig,
  };
}

function findProject(projectId: string | undefined): Project | undefined {
  if (projectId === undefined) return undefined;
  const project = PROJECTS.find((p) => p.id === projectId);
  if (!project) throw new Error(`withWorkshop: unknown projectId '${projectId}'`);
  return project;
}

// Project links cross instances (see shared/links.ts), so Docusaurus can't tell which one is active:
// the current project's item and its dropdown get the active classes here.
function navbar(active: Project | undefined): Preset.ThemeConfig['navbar'] {
  return {
    title: "Beep's Workshop",
    // TODO: add static/img/logo.png and uncomment:
    // logo: {alt: "Beep's Workshop", src: 'img/logo.png'},
    items: [
      // Projects grouped into Mods / Plugins dropdowns (kind lives in shared/projects.ts).
      ...(['mod', 'plugin'] as const).map((kind) => {
        const projects = PROJECTS.filter((p) => p.kind === kind);
        return {
          type: 'dropdown' as const,
          label: kind === 'mod' ? 'Mods' : 'Plugins',
          position: 'left' as const,
          ...(active?.kind === kind && {className: 'navbar__link--active'}),
          items: projects.map((p) => ({
            label: p.short,
            ...crossInstanceLink(`/${p.id}/`),
            ...(p === active && {className: 'dropdown__link--active menu__link--active'}),
          })),
        };
      }),
      {
        href: 'https://github.com/Beeps-Workshop',
        label: 'GitHub',
        position: 'right' as const,
      },
    ],
  };
}

/** Provides the swizzled theme components, custom.css and the instance's accent colour. */
export function workshopPlugin(_context: LoadContext, opts: WorkshopOptions): Plugin {
  const project = findProject(opts.projectId);
  return {
    name: 'workshop-theme',
    getThemePath: () => path.join(__dirname, 'theme'),
    getClientModules: () => [path.join(__dirname, 'css/custom.css')],
    // The main instance keeps custom.css's primary; a project instance overrides it with its accent.
    injectHtmlTags: () => (project ? {headTags: [{tagName: 'style', innerHTML: accentCss(project.accent)}]} : {}),
  };
}

/**
 * Infima's primary colour and its six shades for light and dark mode. The shades follow Docusaurus'
 * own colour generator (HSL lightness scaled by 10/15/30%). The selectors are more specific than
 * custom.css's `:root` / `[data-theme='dark']`, since stylesheets load after these head tags.
 */
export function accentCss(accent: Project['accent']): string {
  return `html:root { ${primaryVars(accent.light)} } html[data-theme='dark'] { ${primaryVars(accent.dark)} }`;
}

function primaryVars(hex: string): string {
  const vars = [
    ['', 0],
    ['-dark', -0.1],
    ['-darker', -0.15],
    ['-darkest', -0.3],
    ['-light', 0.1],
    ['-lighter', 0.15],
    ['-lightest', 0.3],
  ] as const;
  return vars.map(([suffix, amount]) => `--ifm-color-primary${suffix}: ${shade(hex, amount)};`).join(' ');
}

/** Scales the colour's HSL lightness by (1 + amount), like `Color(hex).lighten(amount)`. */
function shade(hex: string, amount: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new Error(`accent must be a #rrggbb hex, got '${hex}'`);
  const n = parseInt(m[1], 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => c / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  let l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  l = Math.min(1, Math.max(0, l * (1 + amount)));
  // HSL back to RGB.
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const o = l - c / 2;
  const [r1, g1, b1] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return `#${[r1, g1, b1].map((v) => Math.round((v + o) * 255).toString(16).padStart(2, '0')).join('')}`;
}
