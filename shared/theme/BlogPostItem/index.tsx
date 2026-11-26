import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
// @theme-init: the classic theme's own (from a plugin's theme path, @theme-original is this file).
import BlogPostItem from '@theme-init/BlogPostItem';
import type {Props} from '@theme/BlogPostItem';
import BlogPostItemHeaderInfo from '@theme/BlogPostItem/Header/Info';
import Tag from '@theme/Tag';
import styles from './styles.module.css';

// A post in a list (the blog, a tag's or an author's page) is a card: date · read time, title, the
// post's description as the excerpt (its first paragraph unless the front matter sets one), its tags
// and "read more". A post's own page keeps the classic layout.
export default function BlogPostItemWrapper(props: Props): ReactNode {
  const {isBlogPostPage} = useBlogPost();
  return isBlogPostPage ? <BlogPostItem {...props} /> : <BlogPostCard />;
}

function BlogPostCard(): ReactNode {
  const {metadata, assets, frontMatter} = useBlogPost();
  const {title, description, permalink, tags} = metadata;
  // A post's front matter `image` (also its social card) heads the card.
  const image = assets.image ?? frontMatter.image;
  const imageUrl = useBaseUrl(image ?? '');
  return (
    <article className={`${styles.card} px`}>
      {image && <div className={styles.image} style={{backgroundImage: `url(${imageUrl})`}} />}
      <div className={styles.body}>
        <div className={styles.info}>
          <BlogPostItemHeaderInfo />
        </div>
        <h2 className={styles.title}>
          <Link to={permalink}>{title}</Link>
        </h2>
        {description && <p className={styles.excerpt}>{description}</p>}
        <div className={styles.footer}>
          {tags.length > 0 && (
            <ul className={styles.tags}>
              {tags.map((tag) => (
                <li key={tag.permalink}>
                  <Tag {...tag} />
                </li>
              ))}
            </ul>
          )}
          <Link to={permalink} className={`${styles.readMore} pbtn px`} aria-label={`Read more about ${title}`}>
            read more
          </Link>
        </div>
      </div>
    </article>
  );
}
