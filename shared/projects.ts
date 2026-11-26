// Single source of truth for the projects in the docs hub.
// Imported by shared/index.ts (navbar, accent colour) and the homepage.
export type ProjectKind = 'mod' | 'plugin';

export type Project = {
  /** Short URL slug (the instance is served at /<id>/) + folder name under projects/. */
  id: string;
  /** Full display name (homepage cards). */
  label: string;
  /** Short name for the menu bar. */
  short: string;
  /** Groups the project under the Mods or Plugins navbar dropdown + homepage section. */
  kind: ProjectKind;
  /** One-line homepage description. */
  blurb: string;
  /** Optional Modrinth project page. Leave undefined to hide the button. */
  modrinth?: string;
  /** Optional CurseForge project page. Leave undefined to hide the button. */
  curseforge?: string;
  /** GitHub repo (owner/name) holding the project and its docs/ instance. */
  repo: string;
  /** Branch of `repo` the docs are built from. */
  branch: string;
  /** Private repo: no "edit this page" links. */
  private: boolean;
  /** Hex colours (#rrggbb) for the project's Infima primary in light and dark mode. */
  accent: {light: string; dark: string};
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
    modrinth: 'https://modrinth.com/mod/fixtures-and-footnotes',
    curseforge: 'https://www.curseforge.com/minecraft/mc-mods/fixtures-footnotes',
    repo: 'Beeps-Workshop/FixturesAndFootnotes',
    branch: 'main',
    private: false,
    accent: {light: '#2e8555', dark: '#25c2a0'}, // TODO accent
  },
  {
    id: 'bmcrm',
    label: "Beep's Mean Crystalline Resource Machine",
    short: 'BMCRM',
    kind: 'mod',
    blurb: 'Yet another take on passive resource generation. Forge crystals and resonate them to obtain their spoils.', // from Modrinth
    modrinth: 'https://modrinth.com/mod/bmcrm',
    curseforge: 'https://www.curseforge.com/minecraft/mc-mods/beeps-mean-crystalline-resource-machine-bmcrm',
    repo: 'Beeps-Workshop/bmcrm',
    branch: 'main',
    private: false,
    accent: {light: '#2e8555', dark: '#25c2a0'}, // TODO accent
  },
  {
    id: 'boe',
    label: "Beep's Other End",
    short: "Beep's Other End",
    kind: 'mod',
    blurb: 'An-other take on a end content mod. Preferring to keep the end barren.', // from Modrinth
    modrinth: 'https://modrinth.com/mod/beeps-other-end',
    curseforge: 'https://www.curseforge.com/minecraft/mc-mods/beeps-other-end',
    repo: 'Beeps-Workshop/beeps-other-end',
    branch: 'main',
    private: true,
    accent: {light: '#2e8555', dark: '#25c2a0'}, // TODO accent
  },
  {
    id: 'bki',
    label: 'BetterKeepInventory',
    short: 'BetterKeepInventory',
    kind: 'plugin',
    blurb: 'Take control of KeepInventory.', // from Modrinth
    modrinth: 'https://modrinth.com/mod/betterkeepinventory',
    curseforge: 'https://www.curseforge.com/minecraft/bukkit-plugins/betterkeepinventory',
    repo: 'Beeps-Workshop/BetterKeepInventory',
    branch: 'master',
    private: false,
    accent: {light: '#2e8555', dark: '#25c2a0'}, // TODO accent
  },
  {
    id: 'fn',
    label: 'FiniteNetherite',
    short: 'FiniteNetherite',
    kind: 'plugin',
    blurb: 'Nerf Netherite + Mending', // from Modrinth
    modrinth: 'https://modrinth.com/mod/finitenetherite',
    curseforge: 'https://www.curseforge.com/minecraft/bukkit-plugins/finitenetherite',
    repo: 'Beeps-Workshop/FiniteNetherite',
    branch: 'master',
    private: false,
    accent: {light: '#2e8555', dark: '#25c2a0'}, // TODO accent
  },
];

export const MODS = PROJECTS.filter((p) => p.kind === 'mod');
export const PLUGINS = PROJECTS.filter((p) => p.kind === 'plugin');
