import type {ReactNode} from 'react';
import {mdiThemeLightDark} from '@mdi/js';
import type {Props} from '@theme/Icon/SystemColorMode';

// Material Design half-filled disc for the colour-mode toggle (shown while following the system setting).
export default function IconSystemColorMode(props: Props): ReactNode {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden="true" {...props}>
      <path d={mdiThemeLightDark} fill="currentColor" />
    </svg>
  );
}
