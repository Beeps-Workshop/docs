import type {ReactNode} from 'react';
import type {WrapperProps} from '@docusaurus/types';
import Footer from '@theme-init/Footer';
import type FooterType from '@theme/Footer';
import AdUnit, {ADS_ENABLED} from '../../components/AdUnit';

type Props = WrapperProps<typeof FooterType>;

// Wraps (doesn't replace) the default Footer so a manual, in-flow ad renders above it on every
// page of every instance. Deliberately not an overlay/anchor ad — it's part of the normal page layout.
// This comes from the workshop plugin's theme, so it wraps @theme-init (@theme-original would point
// back at itself), and imports relatively since @site is a different folder in each instance.
export default function FooterWrapper(props: Props): ReactNode {
  return (
    <>
      {ADS_ENABLED && (
        <div className="footer-ad-slot">
          <AdUnit slot="REPLACE_WITH_FOOTER_SLOT_ID" />
        </div>
      )}
      <Footer {...props} />
    </>
  );
}
