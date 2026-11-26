import type {ReactNode} from 'react';
import {useDocsVersion} from '@docusaurus/plugin-content-docs/client';
// @theme-init: the classic theme's own (from a plugin's theme path, @theme-original is this file).
import DocItemContent from '@theme-init/DocItem/Content';
import type {Props} from '@theme/DocItem/Content';
import {VersionBadgeContext, versionBadgeLabel} from '../../../versionBadge';

// Wraps the classic doc content so its title (an h1 from the markdown or the synthetic one) carries
// the version badge, per the Docs artboard. The version shows when Docusaurus would show its own
// badge (theme/DocVersionBadge, now empty): on projects with more than one version.
export default function DocItemContentWrapper(props: Props): ReactNode {
  const version = useDocsVersion();
  return (
    <VersionBadgeContext.Provider value={version.badge ? versionBadgeLabel(version.label) : null}>
      <DocItemContent {...props} />
    </VersionBadgeContext.Provider>
  );
}
