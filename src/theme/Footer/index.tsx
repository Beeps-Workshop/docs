import type {ReactNode} from 'react';
import type {WrapperProps} from '@docusaurus/types';
import Footer from '@theme-original/Footer';
import type FooterType from '@theme/Footer';
import AdUnit from '@site/src/components/AdUnit';

type Props = WrapperProps<typeof FooterType>;

// Wraps (doesn't replace) the default Footer so a manual, in-flow ad renders above it on every
// page. Deliberately not an overlay/anchor ad — it's part of the normal page layout.
export default function FooterWrapper(props: Props): ReactNode {
  return (
    <>
      <div className="footer-ad-slot">
        <AdUnit slot="REPLACE_WITH_FOOTER_SLOT_ID" />
      </div>
      <Footer {...props} />
    </>
  );
}
