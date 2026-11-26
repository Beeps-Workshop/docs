import type {ReactNode} from 'react';
import {mdiWeatherSunny} from '@mdi/js';
import type {Props} from '@theme/Icon/LightMode';

// Material Design sun for the colour-mode toggle (shown while the light mode is chosen).
export default function IconLightMode(props: Props): ReactNode {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden="true" {...props}>
      <path d={mdiWeatherSunny} fill="currentColor" />
    </svg>
  );
}
