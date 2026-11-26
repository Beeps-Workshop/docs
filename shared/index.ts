import path from 'path';
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config, LoadContext, Plugin} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type {NavbarItem} from '@docusaurus/theme-common';
import {PROJECTS, type Project} from './projects';
import {crossInstanceLink} from './links';

// The look every workshop instance shares (the main site and each project's docs): navbar, footer,
// prism, colour mode, custom.css and the swizzled theme components (theme/). Runs in Node.js at config time.

export type {NavbarItem};

export type WorkshopOptions = {
  /** The project this instance documents. Marks it active in the navbar and applies its accent. */
  projectId?: string;
  /** The project's own navbar items, rendered on the right as pixel buttons in this order. */
  right?: NavbarItem[];
};

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
      navbar: navbar(project, isVersioned(config), opts.right ?? []),
      prism: {
        additionalLanguages: ['java', 'yaml'],
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    } satisfies Preset.ThemeConfig,
  };
}

// A project instance is versioned when its classic preset's docs set a lastVersion (see the project's
// docusaurus.config.ts); only then does the navbar get a version dropdown.
function isVersioned(config: Config): boolean {
  return (config.presets ?? []).some((preset) => {
    if (!Array.isArray(preset) || (preset[0] !== 'classic' && preset[0] !== '@docusaurus/preset-classic')) return false;
    const docs = (preset[1] as Preset.Options | undefined)?.docs;
    return typeof docs === 'object' && docs.lastVersion !== undefined;
  });
}

function findProject(projectId: string | undefined): Project | undefined {
  if (projectId === undefined) return undefined;
  const project = PROJECTS.find((p) => p.id === projectId);
  if (!project) throw new Error(`withWorkshop: unknown projectId '${projectId}'`);
  return project;
}

// Left: the title (to / from every instance, see theme/Logo), then on a project instance
// `/ <project ▾> <version ▾> News`, on the main site the workshop nav. Right: the project's own items
// as pixel buttons; theme/Navbar/Content adds the colour toggle and the Ko-fi heart after them.
function navbar(project: Project | undefined, versioned: boolean, right: NavbarItem[]): Preset.ThemeConfig['navbar'] {
  const news = project && newsLink(project.id);
  const left: NavbarItem[] = project
    ? [
        {type: 'custom-projectDropdown', projectId: project.id},
        ...(versioned ? [{type: 'docsVersionDropdown', className: 'workshop-navbar__version'}] : []),
        ...(news ? [news] : []),
      ]
    : [
        // A homepage section, not a page: never shown as the current one (no pathname is empty).
        {label: 'projects', to: '/#projects', activeBaseRegex: '^$'},
        // A plain link (crossInstanceLink), which the link checks skip, since the blog plugin creates
        // /blog only once a post exists.
        {label: 'news', ...crossInstanceLink('/blog')},
      ];
  return {
    title: "Beep's Workshop",
    // TODO: add static/img/logo.png and uncomment:
    // logo: {alt: "Beep's Workshop", src: 'img/logo.png'},
    items: [
      ...left.map((item) => ({...item, position: 'left' as const})),
      ...right.map((item) => ({
        ...item,
        position: 'right' as const,
        className: ['pbtn', item.className].filter(Boolean).join(' '),
      })),
    ],
  };
}

/**
 * The project's "News" link (to its blog tag page on the main site), placed after the version
 * dropdown, or null while the project's tag has no posts, as the tag page exists only then.
 * WORKSHOP_NEWS_TAGS (comma-separated tag keys) comes from scripts/build.mjs, which reads it from the
 * main build (shared/news.ts); a project built or previewed alone has none, so no News link.
 */
function newsLink(projectId: string): NavbarItem | null {
  const tags = (process.env.WORKSHOP_NEWS_TAGS ?? '').split(',');
  return tags.includes(projectId) ? {label: 'News', ...crossInstanceLink(`/blog/tags/${projectId}`)} : null;
}

// Self-hosted fonts (no Google Fonts request): Inter for --font-body, JetBrains Mono for --font-mono
// (see custom.css). Each file holds one weight. --font-display comes from the Adobe Fonts kit below.
const FONTS = [
  '@fontsource/inter/400.css',
  '@fontsource/inter/500.css',
  '@fontsource/inter/600.css',
  '@fontsource/jetbrains-mono/500.css',
];

const TYPEKIT_KIT = 'https://use.typekit.net/ngy6ari.css';

/** Provides the swizzled theme components, fonts, custom.css and the colours that come from PROJECTS. */
export function workshopPlugin(_context: LoadContext, opts: WorkshopOptions): Plugin {
  const project = findProject(opts.projectId);
  const css = projectVarsCss(PROJECTS) + (project ? ' ' + accentCss(project.accent) : '');
  return {
    name: 'workshop-theme',
    getThemePath: () => path.join(__dirname, 'theme'),
    getClientModules: () => [...FONTS.map((font) => require.resolve(font)), path.join(__dirname, 'css/custom.css')],
    // The main instance keeps custom.css's primary and --link; a project instance overrides them with its accent.
    injectHtmlTags: () => ({
      headTags: [
        // --font-display: the Adobe Fonts kit, which Adobe's licence requires loading from their servers.
        {tagName: 'link', attributes: {rel: 'preconnect', href: 'https://use.typekit.net', crossorigin: ''}},
        {tagName: 'link', attributes: {rel: 'stylesheet', href: TYPEKIT_KIT}},
        {tagName: 'style', innerHTML: css},
      ],
    }),
  };
}

// Tag tints: the accent mixed into --surface, with the accent as text. The shares keep every accent
// at 4.5:1 or better against its tint (the tightest is fnf in light mode, about 4.5 at 10%).
const TAG_TINT = {light: '10%', dark: '18%'};

function tagVars(prefix: string, accent: string, mode: keyof typeof TAG_TINT): string {
  return `${prefix}-bg: color-mix(in srgb, ${accent} ${TAG_TINT[mode]}, var(--surface)); ${prefix}-fg: ${accent};`;
}

/**
 * `--accent-<id>` and the tag tints `--tag-<id>-bg` / `--tag-<id>-fg` for every project, in light and
 * dark mode, on every instance, so any page can name any project in its colours (projectTagStyle).
 */
export function projectVarsCss(projects: Project[]): string {
  const vars = (mode: keyof typeof TAG_TINT) =>
    projects.map((p) => `--accent-${p.id}: ${p.accent[mode]}; ${tagVars(`--tag-${p.id}`, p.accent[mode], mode)}`).join(' ');
  return `html:root { ${vars('light')} } html[data-theme='dark'] { ${vars('dark')} }`;
}

/**
 * A project instance's accent for light and dark mode: Infima's primary and its six shades, links,
 * and `--project-accent` / `--project-tag-bg` / `--project-tag-fg`. The shades follow Docusaurus' own
 * colour generator (HSL lightness scaled by 10/15/30%). The selectors are more specific than
 * custom.css's `:root` / `[data-theme='dark']`, since stylesheets load after these head tags.
 */
export function accentCss(accent: Project['accent']): string {
  return (
    `html:root { ${accentVars(accent.light, 'light')} --link-hover: ${shade(accent.light, -0.15)}; } ` +
    `html[data-theme='dark'] { ${accentVars(accent.dark, 'dark')} --link-hover: ${shade(accent.dark, 0.15)}; }`
  );
}

function accentVars(hex: string, mode: keyof typeof TAG_TINT): string {
  return `${primaryVars(hex)} --link: ${hex}; --project-accent: ${hex}; ${tagVars('--project-tag', hex, mode)}`;
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
