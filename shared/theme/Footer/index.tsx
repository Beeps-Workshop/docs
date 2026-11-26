import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {crossInstanceLink} from '../../links';
import {SPONSORS} from '../../sponsors';
import styles from './styles.module.css';

// Replaces the classic Footer: the same on every instance. Terms, Privacy and AI live on the main
// site, so they are cross-instance links; the sponsor banners are plain <img>s with absolute paths
// (no useBaseUrl, which would prefix a project's /bki/) so they come from the main site's static/.
export default function Footer(): ReactNode {
  return (
    <footer className={styles.footer}>
      <div className={styles.row}>
        <span className={styles.title}>Beep's Workshop</span>
        <nav aria-label="Footer" className={styles.links}>
          <Link {...crossInstanceLink('/terms')}>Terms</Link>
          <Link {...crossInstanceLink('/privacy')}>Privacy</Link>
          <Link {...crossInstanceLink('/ai')}>AI</Link>
        </nav>
        <span className={styles.copyright}>Copyright © {new Date().getFullYear()} Beep's Workshop</span>
      </div>
      {SPONSORS.length > 0 && (
        <div className={styles.sponsors}>
          {SPONSORS.map((sponsor) => (
            <a
              key={sponsor.name}
              href={sponsor.href}
              target="_blank"
              rel="sponsored noopener"
              className={styles.sponsor}
            >
              <img src={sponsor.image} alt={sponsor.alt} width={800} height={133} loading="lazy" />
            </a>
          ))}
        </div>
      )}
    </footer>
  );
}
