import {useContext, type ReactNode} from 'react';
// @theme-init: the classic theme's own (from a plugin's theme path, @theme-original is this file).
import Heading from '@theme-init/Heading';
import type {Props} from '@theme/Heading';
import {VersionBadgeContext} from '../../versionBadge';

// Wraps the classic Heading: a doc's h1 gets the version badge after its text (see
// theme/DocItem/Content). Everywhere else the context is empty and nothing changes.
export default function HeadingWrapper(props: Props): ReactNode {
  const version = useContext(VersionBadgeContext);
  if (props.as !== 'h1' || version === null) return <Heading {...props} />;
  return (
    <Heading {...props}>
      {props.children}
      <span className="workshop-version-badge">{version}</span>
    </Heading>
  );
}
