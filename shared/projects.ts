// Single source of truth for the projects in the docs hub.
// Imported by shared/index.ts (accent colour), the navbar's project dropdown, the homepage and scripts/build.mjs.
export type ProjectKind = 'mod' | 'plugin' | 'misc';

export type Project = {
  /** Short URL slug (the instance is served at /<id>/) + folder name under projects/. */
  id: string;
  /** Full display name (homepage cards). */
  label: string;
  /** Short name for the menu bar. */
  short: string;
  /** The project's kind: its homepage card label. */
  kind: ProjectKind;
  /** One-line homepage description. */
  blurb: string;
  /** GitHub repo (owner/name) holding the project and its docs/ instance. */
  repo: string;
  /** Branch of `repo` the docs are built from. */
  branch: string;
  /** Private repo: no "edit this page" links. */
  private: boolean;
  /**
   * Hex colours (#rrggbb) for light and dark mode: the project instance's Infima primary and links,
   * and the project's tag chips everywhere. Each reaches 4.5:1 on --bg and --surface in its mode.
   */
  accent: {light: string; dark: string};
  /** Modrinth project slug. Data for the release importer, not a rendered link. */
  modrinthSlug?: string;
};

/** Wide banner across the top of a project's homepage card. Add static/img/projects/<id>-header.png. */
export const projectHeader = (id: string): string => `/img/projects/${id}-header.png`;

/** Square logo badge shown next to a project's title. Add static/img/projects/<id>-icon.png. */
export const projectIcon = (id: string): string => `/img/projects/${id}-icon.png`;

export const PROJECTS: Project[] = [
  {
    id: 'fnf',
    label: 'Fixtures & Footnotes',
    short: 'Fixtures & Footnotes',
    kind: 'mod',
    blurb: 'A Small decorative mod for you and yours', // from Modrinth
    repo: 'Beeps-Workshop/FixturesAndFootnotes',
    branch: 'main',
    private: false,
    accent: {light: '#A9561F', dark: '#E8935A'},
    modrinthSlug: 'fixtures-and-footnotes',
  },
  {
    id: 'bmcrm',
    label: "Beep's Mean Crystalline Resource Machine",
    short: 'BMCRM',
    kind: 'mod',
    blurb: 'Yet another take on passive resource generation. Forge crystals and resonate them to obtain their spoils.', // from Modrinth
    repo: 'Beeps-Workshop/bmcrm',
    branch: 'main',
    private: false,
    accent: {light: '#3F780C', dark: '#9DFF3C'},
    modrinthSlug: 'bmcrm',
  },
  {
    id: 'boe',
    label: "Beep's Other End",
    short: "Beep's Other End",
    kind: 'mod',
    blurb: 'An-other take on a end content mod. Preferring to keep the end barren.', // from Modrinth
    repo: 'Beeps-Workshop/beeps-other-end',
    branch: 'main',
    private: true,
    accent: {light: '#7A600F', dark: '#D8BE5C'},
    modrinthSlug: 'beeps-other-end',
  },
  {
    id: 'bki',
    label: 'BetterKeepInventory',
    short: 'BetterKeepInventory',
    kind: 'plugin',
    blurb: 'Take control of KeepInventory.', // from Modrinth
    repo: 'Beeps-Workshop/BetterKeepInventory',
    branch: 'master',
    private: false,
    accent: {light: '#1F6FA8', dark: '#7CC4F0'},
    modrinthSlug: 'betterkeepinventory',
  },
  {
    id: 'fn',
    label: 'FiniteNetherite',
    short: 'FiniteNetherite',
    kind: 'plugin',
    blurb: 'Nerf Netherite + Mending', // from Modrinth
    repo: 'Beeps-Workshop/FiniteNetherite',
    branch: 'master',
    private: false,
    accent: {light: '#3A3A42', dark: '#B4B4BC'},
    modrinthSlug: 'finitenetherite',
  },
];

/**
 * Colours for a `.ptag` chip naming the project (blog tags, homepage card labels), tinted from its
 * accent in the current colour mode. Returns CSS custom properties, not `background`/`color`, so the
 * chip's hover rule in custom.css still applies. Use as the chip's style:
 * `<Link className="ptag" style={projectTagStyle(id) as React.CSSProperties}>`.
 * The variables it points at are defined on every instance by the workshop plugin
 * (projectVarsCss in shared/index.ts).
 */
export function projectTagStyle(id: string): {'--tag-bg': string; '--tag-fg': string} {
  return {'--tag-bg': `var(--tag-${id}-bg)`, '--tag-fg': `var(--tag-${id}-fg)`};
}
