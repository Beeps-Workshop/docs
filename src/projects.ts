// Single source of truth for the projects in the docs hub.
// Imported by both docusaurus.config.ts (docs instances + navbar) and the homepage.
export type ProjectKind = 'mod' | 'plugin';

export type Project = {
  /** Short URL slug + docs instance id + folder name under projects/. */
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
  /**
   * Latest released docs version (e.g. '1.0.1'). When set, that version is the
   * default served docs and `current` becomes the unreleased "Snapshots".
   * Cut a new one with:  npm run docusaurus -- docs:version:<id> <version>
   */
  lastVersion?: string;
};

/** Wide banner across the top of a project's homepage card. Add static/img/projects/<id>-header.png. */
export const projectHeader = (id: string): string => `/img/projects/${id}-header.png`;

/** Square logo badge shown next to a project's title. Add static/img/projects/<id>-icon.png. */
export const projectIcon = (id: string): string => `/img/projects/${id}-icon.png`;

export const PROJECTS: Project[] = [
  {
    id: 'bki',
    label: 'BetterKeepInventory',
    short: 'BetterKeepInventory',
    kind: 'plugin',
    blurb: '', // TODO: one-line description (Modrinth import skipped per request)
    modrinth: 'https://modrinth.com/mod/betterkeepinventory',
    curseforge: 'https://www.curseforge.com/minecraft/bukkit-plugins/betterkeepinventory',
    lastVersion: '2.3.0',
  },
  {
    id: 'bmcrm',
    label: "Beep's Mean Crystalline Resource Machine",
    short: 'BMCRM',
    kind: 'mod',
    blurb: '', // TODO: import from Modrinth once the project is approved (currently under review)
    modrinth: 'https://modrinth.com/mod/bmcrm',
    curseforge: 'https://www.curseforge.com/minecraft/mc-mods/beeps-mean-crystalline-resource-machine-bmcrm',
    lastVersion: '1.0.0', // placeholder — bmcrm is under review; adjust to its real release version
  },
  {
    id: 'boe',
    label: "Beep's Other End",
    short: "Beep's Other End",
    kind: 'mod',
    blurb: 'An-other take on a end content mod. Preferring to keep the end barren.', // from Modrinth
    modrinth: 'https://modrinth.com/mod/beeps-other-end',
    curseforge: 'https://www.curseforge.com/minecraft/mc-mods/beeps-other-end',
    lastVersion: '1.0.1',
  },
  {
    id: 'fnf',
    label: 'Fixtures & Footnotes',
    short: 'Fixtures & Footnotes',
    kind: 'mod',
    blurb: 'A Small decorative mod for you and yours', // from Modrinth
    modrinth: 'https://modrinth.com/mod/fixtures-and-footnotes',
    curseforge: 'https://www.curseforge.com/minecraft/mc-mods/fixtures-and-footnotes',
    // No versioned docs cut yet, so `current` is what gets served. Freeze 1.0.0 with:
    //   npm run docusaurus -- docs:version:fnf 1.0.0
  },
  {
    id: 'fn',
    label: 'FiniteNetherite',
    short: 'FiniteNetherite',
    kind: 'plugin',
    blurb: 'Nerf Netherite + Mending', // from Modrinth
    modrinth: 'https://modrinth.com/mod/finitenetherite',
    curseforge: 'https://www.curseforge.com/minecraft/bukkit-plugins/finitenetherite',
    lastVersion: '1.0.1',
  },
];

export const MODS = PROJECTS.filter((p) => p.kind === 'mod');
export const PLUGINS = PROJECTS.filter((p) => p.kind === 'plugin');
