import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {withWorkshop} from './shared';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// The main instance: the front page, contact and privacy. Each project's docs are their own
// instance under /<id>/. The shared look (navbar, footer, css, url, baseUrl) comes from withWorkshop.
export default withWorkshop({
  title: "Beep's Workshop",
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

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: false,
      } satisfies Preset.Options,
    ],
  ],
});
