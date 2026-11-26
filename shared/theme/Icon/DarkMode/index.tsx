import type {ReactNode} from 'react';
import {mdiWeatherNight} from '@mdi/js';
import type {Props} from '@theme/Icon/DarkMode';

// Material Design moon for the colour-mode toggle (shown while the dark mode is chosen).
export default function IconDarkMode(props: Props): ReactNode {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden="true" {...props}>
      <path d={mdiWeatherNight} fill="currentColor" />
    </svg>
  );
}
