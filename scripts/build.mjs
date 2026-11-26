// Builds the whole site: the main instance into build/, then every project in shared/projects.ts as
// its own Docusaurus instance (projects/<id>) into build/<id>. The main build goes first because
// Docusaurus empties its out dir; the project builds only add build/<id> next to it.
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const shared = path.join(root, 'shared');
const docusaurus = path.join(root, 'node_modules/@docusaurus/core/bin/docusaurus.mjs');

// shared/projects.ts is TypeScript; Node strips the types itself (22.6+ with a flag, 24+ by default).
let PROJECTS;
try {
  ({PROJECTS} = await import(pathToFileURL(path.join(shared, 'projects.ts')).href));
} catch (error) {
  fail(`cannot load shared/projects.ts on Node ${process.versions.node} (needs 22.18+, which strips TypeScript types by itself): ${error.message}`);
}

const SITE_URL = 'https://workshop.beepsterr.com';

// No build inherits these from the caller's shell: the first two would turn the main build into a
// project instance, the others are set below for the builds that need them.
const {
  DOCS_BASE_URL: _baseUrl,
  WORKSHOP_SHARED: _shared,
  WORKSHOP_NEWS_FILE: _newsFile,
  WORKSHOP_NEWS_TAGS: _newsTags,
  ...cleanEnv
} = process.env;

// Check every project before building anything, so a missing source never half-builds.
for (const {id} of PROJECTS) {
  const dir = path.join(root, 'projects', id);
  if (!fs.existsSync(dir)) fail(`project '${id}': folder projects/${id} is missing (npm run fetch fills it)`);
  if (!fs.existsSync(path.join(dir, 'docusaurus.config.ts'))) fail(`project '${id}': projects/${id}/docusaurus.config.ts is missing`);
}

const newsTags = buildMain();
writeRobots();
for (const {id} of PROJECTS) {
  build(path.join(root, 'projects', id), path.join(root, 'build', id), {
    DOCS_BASE_URL: `/${id}/`,
    WORKSHOP_SHARED: shared,
    WORKSHOP_NEWS_TAGS: newsTags.join(','),
  });
  checkProjectBuild(id);
}

// Builds the main instance and returns the blog tags that have posts, which its news plugin
// (shared/news.ts) writes to WORKSHOP_NEWS_FILE. A project gets a News link only if its id is one.
// The temp folder is removed before any failure is reported (fail() exits at once).
function buildMain() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'workshop-news-'));
  const file = path.join(dir, 'tags.json');
  const ok = run(root, path.join(root, 'build'), {WORKSHOP_NEWS_FILE: file});
  const tags = ok && fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : undefined;
  fs.rmSync(dir, {recursive: true, force: true});
  if (!ok) fail('build of main instance failed');
  if (!tags) fail('the main build did not write the blog tags (shared/news.ts)');
  return tags;
}

// Every instance runs from this folder, so webpack's persistent cache (node_modules/.cache/webpack)
// would be shared between them, and it hands one instance another's resolved @generated modules (all
// project pages came out as the main site's 404). The builds are small, so the cache is simply off.
function build(siteDir, outDir, env) {
  if (!run(siteDir, outDir, env)) fail(`build of ${path.relative(root, siteDir) || 'main instance'} failed`);
}

/** Runs one instance's build; true if it succeeded. */
function run(siteDir, outDir, env) {
  // A stale generated folder has caused false broken-link errors, so every build starts clean.
  fs.rmSync(path.join(siteDir, '.docusaurus'), {recursive: true, force: true});
  const result = spawnSync(process.execPath, [docusaurus, 'build', siteDir, '--out-dir', outDir], {
    cwd: root,
    stdio: 'inherit',
    env: {...cleanEnv, DOCUSAURUS_NO_PERSISTENT_CACHE: '1', ...env},
  });
  return result.status === 0;
}

// robots.txt is generated rather than kept in static/ so the per-project sitemaps (each instance
// writes its own build/<id>/sitemap.xml) come from PROJECTS and cannot drift from it. Only the root
// one is served: crawlers ignore robots.txt below the site root.
function writeRobots() {
  const sitemaps = ['/sitemap.xml', ...PROJECTS.map(({id}) => `/${id}/sitemap.xml`)];
  const lines = ['User-agent: *', 'Allow: /', '', ...sitemaps.map((p) => `Sitemap: ${SITE_URL}${p}`)];
  fs.writeFileSync(path.join(root, 'build', 'robots.txt'), lines.join('\n') + '\n');
}

// Guards against an instance rendering another's pages: a project's front page is a docs page (the
// docs plugin marks <html> with `plugin-docs`), never the main site's front page.
function checkProjectBuild(id) {
  const page = path.join(root, 'build', id, 'index.html');
  if (!fs.existsSync(page)) fail(`project '${id}': build/${id}/index.html is missing`);
  const html = fs.readFileSync(page, 'utf8');
  if (!/<html[^>]*class="[^"]*\bplugin-docs\b/.test(html) || html === fs.readFileSync(path.join(root, 'build', 'index.html'), 'utf8')) {
    fail(`project '${id}': build/${id}/index.html is not the project's docs front page`);
  }
}

function fail(message) {
  console.error(`build: ${message}`);
  process.exit(1);
}
