// Builds the whole site: the main instance into build/, then every project in shared/projects.ts as
// its own Docusaurus instance (projects/<id>) into build/<id>. The main build goes first because
// Docusaurus empties its out dir; the project builds only add build/<id> next to it.
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const shared = path.join(root, 'shared');
const docusaurus = path.join(root, 'node_modules/@docusaurus/core/bin/docusaurus.mjs');

// shared/projects.ts is TypeScript; Node strips the types itself (22.6+ with a flag, 24+ by default).
const {PROJECTS} = await import(pathToFileURL(path.join(shared, 'projects.ts')).href);

// Check every project before building anything, so a missing source never half-builds.
for (const {id} of PROJECTS) {
  const dir = path.join(root, 'projects', id);
  if (!fs.existsSync(dir)) fail(`project '${id}': folder projects/${id} is missing (npm run fetch fills it)`);
  if (!fs.existsSync(path.join(dir, 'docusaurus.config.ts'))) fail(`project '${id}': projects/${id}/docusaurus.config.ts is missing`);
}

build(root, path.join(root, 'build'), {});
for (const {id} of PROJECTS) {
  build(path.join(root, 'projects', id), path.join(root, 'build', id), {DOCS_BASE_URL: `/${id}/`, WORKSHOP_SHARED: shared});
  checkProjectBuild(id);
}

// Every instance runs from this folder, so webpack's persistent cache (node_modules/.cache/webpack)
// would be shared between them, and it hands one instance another's resolved @generated modules (all
// project pages came out as the main site's 404). The builds are small, so the cache is simply off.
function build(siteDir, outDir, env) {
  // A stale generated folder has caused false broken-link errors, so every build starts clean.
  fs.rmSync(path.join(siteDir, '.docusaurus'), {recursive: true, force: true});
  const result = spawnSync(process.execPath, [docusaurus, 'build', siteDir, '--out-dir', outDir], {
    cwd: root,
    stdio: 'inherit',
    env: {...process.env, DOCUSAURUS_NO_PERSISTENT_CACHE: '1', ...env},
  });
  if (result.status !== 0) fail(`build of ${path.relative(root, siteDir) || 'main instance'} failed`);
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
