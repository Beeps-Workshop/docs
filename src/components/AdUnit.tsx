import type {ReactNode} from 'react';
import {useEffect, useRef} from 'react';

// AdSense fills the <ins> tag once we push to the adsbygoogle queue — this only ever runs
// client-side, after the tag is already in the DOM (see docusaurus.config.ts for the loader script).
declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/** Ads are off for now. Flipping this back also needs the loader script in docusaurus.config.ts. */
export const ADS_ENABLED = false;

export type AdUnitProps = {
  /** The ad unit's data-ad-slot id from AdSense. Use a placeholder until units are approved. */
  slot: string;
  className?: string;
};

export default function AdUnit({slot, className}: AdUnitProps): ReactNode {
  const pushed = useRef(false);

  useEffect(() => {
    if (!ADS_ENABLED || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Blocked by an ad blocker, or the AdSense script hasn't loaded yet — nothing to do.
    }
  }, []);

  if (!ADS_ENABLED) return null;

  return (
    <ins
      className={['adsbygoogle', className].filter(Boolean).join(' ')}
      style={{display: 'block'}}
      data-ad-client="ca-pub-6217402110753644"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
