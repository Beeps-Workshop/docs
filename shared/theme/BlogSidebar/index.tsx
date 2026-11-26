import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useWindowSize} from '@docusaurus/theme-common';
import {BlogSidebarItemList, useVisibleBlogSidebarItems} from '@docusaurus/plugin-content-blog/client';
import BlogSidebarMobile from '@theme/BlogSidebar/Mobile';
import type {Props} from '@theme/BlogSidebar';
import {PROJECTS, projectIcon, projectTagStyle} from '../../projects';
import {useWorkshopNews} from '../../useWorkshopNews';
import styles from './styles.module.css';

// Replaces the classic blog sidebar: "recent posts" (the blog plugin's list, blogSidebarCount long),
// then "by project", a chip per project tag page, and the workshop tag's. A tag gets a chip only when
// it has posts (shared/news.ts), since only then does its page exist. On a phone the recent posts go
// to the navbar menu (the classic mobile sidebar) and the chips stay above the posts.
export default function BlogSidebar({sidebar}: Props): ReactNode {
  const windowSize = useWindowSize();
  const items = useVisibleBlogSidebarItems(sidebar?.items ?? []);
  const {tags} = useWorkshopNews();
  if (!sidebar?.items.length) return null;
  const projects = PROJECTS.filter((p) => tags.includes(p.id));
  const workshop = tags.includes('workshop');
  const hasChips = projects.length > 0 || workshop;
  return (
    <aside className="col col--3">
      {windowSize === 'mobile' && <BlogSidebarMobile sidebar={sidebar} />}
      {/* On a phone the nav shows only the chips (the recent posts are hidden), so without chips it
          would be an empty gap. */}
      <nav
        className={clsx(styles.sidebar, !hasChips && styles.noChips, 'thin-scrollbar')}
        aria-label="Blog navigation">
        <div className={styles.recent}>
          <h2 className={styles.heading}>{sidebar.title}</h2>
          <BlogSidebarItemList
            items={items}
            ulClassName={clsx(styles.list, 'clean-list')}
            linkClassName={styles.link}
            linkActiveClassName={styles.linkActive}
          />
        </div>
        {hasChips && (
          <>
            <h2 className={styles.heading}>by project</h2>
            <ul className={clsx(styles.tags, 'clean-list')}>
              {projects.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/blog/tags/${p.id}`}
                    className="ptag px"
                    style={projectTagStyle(p.id) as React.CSSProperties}>
                    <img className={styles.icon} src={projectIcon(p.id)} alt="" width={16} height={16} />
                    {p.short}
                  </Link>
                </li>
              ))}
              {workshop && (
                <li>
                  <Link to="/blog/tags/workshop" className="ptag px">
                    Workshop
                  </Link>
                </li>
              )}
            </ul>
          </>
        )}
      </nav>
    </aside>
  );
}
