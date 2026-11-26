// Imports one blog post per minor release series from each project's Modrinth page into
// blog/releases/<id>-<major>-<minor>.md. Patch releases are left out. It only adds posts that are
// missing: an existing file is never changed or deleted, so a post can be edited after import.
//
//   npm run import-releases                 write every missing post
//   npm run import-releases -- --dry-run    list the files it would write
//   npm run import-releases -- --project bki
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const USER_AGENT = 'beeps-workshop-docs-importer';
const RELEASES_DIR = 'blog/releases';

/** Major and minor from the first `a.b` pair in a version string (`v2.3.0`, `2.3.0+1.21`), or null. */
function parseVersion(versionNumber) {
  const match = /(\d+)\.(\d+)(?:\.(\d+))?/.exec(versionNumber);
  if (!match) return null;
  const patch = match[3] === undefined ? 0 : Number(match[3]);
  return {major: Number(match[1]), minor: Number(match[2]), patch};
}

/**
 * One release per `major.minor`: its `x.y.0` version (a bare `x.y` counts as `x.y.0`), else the
 * earliest of that minor by `date_published`. Alpha/beta versions and unparseable ones are ignored.
 * Each result is the Modrinth version plus `major` and `minor`.
 */
export function pickMinorReleases(versions) {
  const series = new Map();
  for (const version of versions) {
    if (version.version_type && version.version_type !== 'release') continue;
    const parsed = parseVersion(version.version_number);
    if (!parsed) continue;
    const key = `${parsed.major}.${parsed.minor}`;
    if (!series.has(key)) series.set(key, []);
    series.get(key).push({...version, major: parsed.major, minor: parsed.minor, patch: parsed.patch});
  }
  const byDate = (a, b) => Date.parse(a.date_published) - Date.parse(b.date_published) || a.version_number.localeCompare(b.version_number);
  return [...series.values()].map((candidates) => {
    const zero = candidates.filter((c) => c.patch === 0).sort(byDate);
    const {patch: _patch, ...release} = (zero.length ? zero : candidates.sort(byDate))[0];
    return release;
  });
}

/** Escapes what would break MDX (`<`, `{`, `}`) outside code, leaving fenced blocks and inline code as written. */
function neutraliseMdx(markdown) {
  let fence = null;
  return markdown
    .split('\n')
    .map((line) => {
      const marker = /^\s*(`{3,}|~{3,})/.exec(line);
      if (fence) {
        if (marker && marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = null;
        return line;
      }
      if (marker) {
        fence = marker[1];
        return line;
      }
      return line
        .split(/(``[^\n]*?``|`[^`\n]*`)/)
        .map((part, i) => (i % 2 ? part : part.replace(/[<{}]/g, '\\$&')))
        .join('');
    })
    .join('\n');
}

const postPath = (project, release) => `${RELEASES_DIR}/${project.id}-${release.major}-${release.minor}.md`;

/** The post for one release: {path (relative to the repo root), contents}. */
export function postFile(project, release) {
  const changelog = neutraliseMdx((release.changelog ?? '').replace(/\r\n?/g, '\n').trim());
  const url = `https://modrinth.com/project/${project.modrinthSlug}/version/${release.id}`;
  const body = [
    ...(changelog ? [changelog] : []),
    `Minecraft ${release.game_versions.join(', ')} · ${release.loaders.join(', ')}`,
    `[View this release on Modrinth](${url})`,
  ].join('\n\n');
  const frontMatter = [
    `title: ${JSON.stringify(`${project.label} ${release.major}.${release.minor}`)}`,
    `date: ${new Date(release.date_published).toISOString()}`,
    `tags: [${project.id}, release]`,
    'authors: [beepsterr]',
    'imported: modrinth',
  ].join('\n');
  return {path: postPath(project, release), contents: `---\n${frontMatter}\n---\n\n${body}\n`};
}

/** The releases whose post file does not exist yet in `blogDir` (the folder holding the post files). */
export function missingPosts(project, releases, blogDir) {
  return releases.filter((release) => !fs.existsSync(path.join(blogDir, path.basename(postPath(project, release)))));
}

export async function fetchVersions(slug, fetchFn = fetch) {
  const url = `https://api.modrinth.com/v2/project/${slug}/version`;
  const response = await fetchFn(url, {headers: {'User-Agent': USER_AGENT}});
  if (!response.ok) throw new Error(`Modrinth ${url} answered ${response.status}`);
  return response.json();
}

async function loadProjects() {
  // shared/projects.ts is TypeScript; Node strips the types itself (22.18+).
  return (await import(pathToFileURL(path.join(root, 'shared/projects.ts')).href)).PROJECTS;
}

export async function main(argv, {fetch: fetchFn = fetch, root: repoRoot = root, projects, log = console.log} = {}) {
  const dryRun = argv.includes('--dry-run');
  const only = argv.includes('--project') ? argv[argv.indexOf('--project') + 1] : null;
  const all = projects ?? (await loadProjects());
  if (only && !all.some((p) => p.id === only)) throw new Error(`unknown project '${only}'`);

  const blogDir = path.join(repoRoot, RELEASES_DIR);
  let count = 0;
  for (const project of all.filter((p) => p.modrinthSlug && (!only || p.id === only))) {
    const releases = pickMinorReleases(await fetchVersions(project.modrinthSlug, fetchFn));
    for (const release of missingPosts(project, releases, blogDir)) {
      const {path: file, contents} = postFile(project, release);
      log(`${dryRun ? 'would write' : 'write'} ${file}`);
      if (!dryRun) {
        fs.mkdirSync(blogDir, {recursive: true});
        fs.writeFileSync(path.join(repoRoot, file), contents, {flag: 'wx'});
      }
      count++;
    }
  }
  if (count === 0) log('nothing to add');
  else log(`${dryRun ? 'would add' : 'added'} ${count} post${count === 1 ? '' : 's'}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(`import-releases: ${error.message}`);
    process.exit(1);
  });
}
