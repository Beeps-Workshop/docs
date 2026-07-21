import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type {Options as DocsOptions} from '@docusaurus/plugin-content-docs';
import {PROJECTS} from './src/projects';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Beep's Workshop",
  tagline: '', // TODO: your tagline (used in <meta>); homepage copy lives in src/pages/index.tsx
  favicon: undefined, // TODO: add static/img/favicon.ico and set this to 'img/favicon.ico'

  future: {v4: true},

  url: 'https://workshop.beepsterr.com',
  baseUrl: '/',

  organizationName: 'Beeps-Workshop',
  projectName: 'workshop',

  onBrokenLinks: 'throw',

  i18n: {defaultLocale: 'en', locales: ['en']},

  // No default docs instance — each project gets its own versioned instance below.
  presets: [
    [
      'classic',
      {
        docs: false,
        blog: false,
        theme: {customCss: './src/css/custom.css'},
      } satisfies Preset.Options,
    ],
  ],

  // One independently-versioned docs instance per project.
  // Freeze a release with:  npm run docusaurus docs:version:<id> <version>
  plugins: PROJECTS.map((p) => {
    const options: DocsOptions = {
      id: p.id,
      path: `projects/${p.id}/docs`,
      routeBasePath: p.id,
      sidebarPath: './sidebars.ts',
      // Docs live in this repo, so "edit this page" points back here — at the real file, whether it's
      // the current version (projects/<id>/docs/...) or a frozen one (<id>_versioned_docs/version-x/...).
      editUrl: ({versionDocsDirPath, docPath}) =>
        `https://github.com/Beeps-Workshop/docs/edit/main/${versionDocsDirPath}/${docPath}`,
    };
    // BetterKeepInventory ships with imported version history (2.0.0 - 2.3.0).
    if (p.id === 'bki') {
      options.lastVersion = '2.3.0';
      options.versions = {current: {label: 'Snapshots', banner: 'unreleased'}};
    }
    return ['@docusaurus/plugin-content-docs', options];
  }),

  themeConfig: {
    colorMode: {respectPrefersColorScheme: true},
    navbar: {
      title: "Beep's Workshop",
      // TODO: add static/img/logo.png and uncomment:
      // logo: {alt: "Beep's Workshop", src: 'img/logo.png'},
      items: [
        // Every project shown directly in the menu bar.
        ...PROJECTS.map((p) => ({
          type: 'docSidebar' as const,
          sidebarId: 'docs',
          docsPluginId: p.id,
          label: p.short,
          position: 'left' as const,
        })),
        {
          href: 'https://github.com/Beeps-Workshop',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} Beep's Workshop.`,
    },
    prism: {
      additionalLanguages: ['java', 'yaml'],
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
