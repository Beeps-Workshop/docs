import type {ReactNode} from 'react';
import type {Props} from '@theme/Icon/LightMode';

// Pixel sun for the colour-mode toggle (shown while the light mode is chosen), on a 12-pixel grid.
export default function IconLightMode(props: Props): ReactNode {
  return (
    <svg viewBox="0 0 12 12" width={24} height={24} shapeRendering="crispEdges" {...props}>
      <path
        fill="currentColor"
        d="M4 3h4v1h1v4H8v1H4V8H3V4h1zM5 0h2v2H5zM5 10h2v2H5zM0 5h2v2H0zM10 5h2v2h-2zM1 1h2v2H1zM9 1h2v2H9zM1 9h2v2H1zM9 9h2v2H9z"
      />
    </svg>
  );
}
