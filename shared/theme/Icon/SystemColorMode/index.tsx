import type {ReactNode} from 'react';
import type {Props} from '@theme/Icon/SystemColorMode';

// Pixel half-filled disc for the colour-mode toggle (shown while following the system setting): the
// design's toggle icon, on a 10-pixel grid. The right half is cut out (even-odd), so it needs no
// background colour of its own.
export default function IconSystemColorMode(props: Props): ReactNode {
  return (
    <svg viewBox="0 0 10 10" width={20} height={20} shapeRendering="crispEdges" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M3 0h4v1h1v1h1v1h1v4H9v1H8v1H7v1H3V9H2V8H1V7H0V3h1V2h1V1h1zM5 1h2v1h1v1h1v4H8v1H7v1H5z"
      />
    </svg>
  );
}
