// Single source of truth for the projects in the docs hub.
// Imported by both docusaurus.config.ts (docs instances + navbar) and the homepage.
// `blurb` is intentionally left empty — homepage copy is yours to write.
export type Project = {
  /** Short URL slug + docs instance id + folder name under projects/. */
  id: string;
  /** Full display name (homepage cards). */
  label: string;
  /** Short name for the menu bar. */
  short: string;
  /** One-line homepage description — WRITE YOUR OWN. */
  blurb: string;
};

export const PROJECTS: Project[] = [
  {id: 'bki', label: 'BetterKeepInventory', short: 'BetterKeepInventory', blurb: ''},
  {id: 'bmcrm', label: "Beep's Mean Crystalline Resource Machine", short: 'BMCRM', blurb: ''},
  {id: 'boe', label: "Beep's Other End", short: "Beep's Other End", blurb: ''},
  {id: 'fn', label: 'FiniteNetherite', short: 'FiniteNetherite', blurb: ''},
];
