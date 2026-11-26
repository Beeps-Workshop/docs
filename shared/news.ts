import fs from 'fs';
import type {LoadContext, Plugin} from '@docusaurus/types';
import type {BlogContent} from '@docusaurus/plugin-content-blog';

// The main instance's blog, summarised for the pages that link to it: the homepage's news strip (the
// latest posts) and every per-tag link (a project's navbar "News", the blog sidebar's "by project"),
// which may only point at a tag that has posts, since a tag page exists only then. Runs in Node.js.

export const NEWS_PLUGIN = 'workshop-news';

export type NewsPost = {title: string; date: string; permalink: string; summary: string};

export type WorkshopNews = {
  /** The newest listed posts, newest first (at most LATEST_COUNT). */
  latest: NewsPost[];
  /** Keys (tags.yml) of the tags with at least one listed post, so with a /blog/tags/<key> page. */
  tags: string[];
};

const LATEST_COUNT = 3;

/**
 * Reads the blog plugin's posts once all content is loaded and publishes them as global data (read
 * with useWorkshopNews). When WORKSHOP_NEWS_FILE is set (scripts/build.mjs), also writes the tag keys
 * there as JSON, so the project builds that follow know which projects have a News page.
 */
export function newsPlugin(_context: LoadContext): Plugin {
  return {
    name: NEWS_PLUGIN,
    async allContentLoaded({allContent, actions}) {
      const blog = allContent['docusaurus-plugin-content-blog']?.default as BlogContent | undefined;
      if (!blog) throw new Error(`${NEWS_PLUGIN}: the blog plugin is not loaded`);
      const news: WorkshopNews = {
        latest: blog.blogPosts
          .filter((post) => !post.metadata.unlisted)
          .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime())
          .slice(0, LATEST_COUNT)
          .map(({metadata}) => ({
            title: metadata.title,
            date: new Date(metadata.date).toISOString(),
            permalink: metadata.permalink,
            summary: metadata.description,
          })),
        // A tag whose posts are all unlisted still gets a page, but an empty one: it is left out. Tags
        // come only from tags.yml (onInlineTags: 'throw'), whose permalinks end in /<key>.
        tags: Object.values(blog.blogTags)
          .filter((tag) => !tag.unlisted)
          .map((tag) => tag.permalink.split('/').pop()!),
      };
      actions.setGlobalData(news);
      const file = process.env.WORKSHOP_NEWS_FILE;
      if (file) fs.writeFileSync(file, JSON.stringify(news.tags));
    },
  };
}
