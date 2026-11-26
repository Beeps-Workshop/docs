import {createContext} from 'react';

/**
 * The version label shown as a badge after a doc's title (theme/Heading), or null for none. Provided
 * by theme/DocItem/Content, so it is set only inside a doc's content and only on versioned projects
 * whose current version has a badge.
 */
export const VersionBadgeContext = createContext<string | null>(null);

/** "2.3.6" → "v2.3.6"; a name such as "Snapshots" stays as it is. */
export function versionBadgeLabel(label: string): string {
  return /^\d/.test(label) ? `v${label}` : label;
}
