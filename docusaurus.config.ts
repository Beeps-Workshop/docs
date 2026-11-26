import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {withWorkshop} from './shared';
import {newsPlugin} from './shared/news';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// The main instance: the front page, the blog and the static pages (terms, privacy, ai). Each project's docs are their own
// instance under /<id>/. The shared look (navbar, footer, css, url, baseUrl) comes from withWorkshop.
export default withWorkshop({
  title: "Beeps' Workshop",
  tagline: '', // TODO: your tagline (used in <meta>); homepage copy lives in src/pages/index.tsx
  favicon: undefined, // TODO: add static/img/favicon.ico and set this to 'img/favicon.ico'

  future: {v4: true},

  // Required by the type; withWorkshop sets both (baseUrl from DOCS_BASE_URL).
  url: 'https://workshop.beepsterr.com',
  baseUrl: '/',

  organizationName: 'Beeps-Workshop',
  projectName: 'workshop',

  onBrokenLinks: 'throw',

  i18n: {defaultLocale: 'en', locales: ['en']},

  plugins: [
    ['@docusaurus/plugin-client-redirects', {redirects: [{from: '/contact', to: '/terms#contact'}]}],
    // The blog's latest posts and tags-with-posts, for the homepage and the project builds' News links.
    newsPlugin,
  ],

  presets: [
    [
      'classic',
      {
        docs: false,
        // One .md/.mdx per post in blog/. Tags and authors are keys from blog/tags.yml and blog/authors.yml.
        blog: {
          routeBasePath: 'blog',
          blogTitle: 'news',
          blogDescription: 'New releases, versions and general ramblings from a madgal',
          blogSidebarTitle: 'recent posts',
          blogSidebarCount: 5,
          tags: 'tags.yml',
          onInlineTags: 'throw',
          authorsMapPath: 'authors.yml',
          feedOptions: {type: ['rss', 'atom']},
          // The list shows each post's description (its first paragraph unless set), never the
          // post itself, so a post needs no <!-- truncate --> marker.
          onUntruncatedBlogPosts: 'ignore',
        },
      } satisfies Preset.Options,
    ],
  ],
});
