import type {ReactNode} from 'react';
import type {Props} from '@theme/Icon/DarkMode';

// Pixel crescent moon for the colour-mode toggle (shown while the dark mode is chosen), on a 12-pixel grid.
export default function IconDarkMode(props: Props): ReactNode {
  return (
    <svg viewBox="0 0 12 12" width={24} height={24} shapeRendering="crispEdges" {...props}>
      <path
        fill="currentColor"
        d="M3 1h2v1H3zM2 2h2v1H2zM1 3h3v1H1zM1 4h3v1H1zM0 5h5v1H0zM0 6h5v1H0zM1 7h6v1H1zM1 8h10v1H1zM2 9h8v1H2zM3 10h6v1H3zM5 11h2v1H5z"
      />
    </svg>
  );
}
