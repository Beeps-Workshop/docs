import type {ReactNode} from 'react';
import {useLocation} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
// @theme-init: the classic theme's own (from a plugin's theme path, @theme-original is this file).
import BlogPostItems from '@theme-init/BlogPostItems';
import type {Props} from '@theme/BlogPostItems';
import styles from './styles.module.css';

// Wraps the classic post list to put the Blog artboard's heading above it on the blog's own list
// pages (/blog, /blog/page/N). Tag and author pages list posts too, but keep their own headers.
export default function BlogPostItemsWrapper(props: Props): ReactNode {
  const isBlogList = useIsBlogList();
  return (
    <>
      {isBlogList && (
        <header className={styles.header}>
          <h1 className={styles.title}>news</h1>
          {/* Same text as the blog's blogDescription in docusaurus.config.ts (its meta description). */}
          <p className={styles.description}>New releases, versions and general ramblings from a madgal</p>
        </header>
      )}
      <BlogPostItems {...props} />
    </>
  );
}

// The blog's routeBasePath is 'blog' (docusaurus.config.ts); its later list pages are /blog/page/<n>.
function useIsBlogList(): boolean {
  const {pathname} = useLocation();
  const base = useBaseUrl('/blog');
  const rest = pathname.startsWith(base) ? pathname.slice(base.length) : null;
  return rest !== null && /^(\/page\/\d+)?\/?$/.test(rest);
}
