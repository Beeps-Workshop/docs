import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';
import {compile} from '@mdx-js/mdx';
import {fetchVersions, main, missingPosts, pickMinorReleases, postFile} from './import-releases.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const bki = JSON.parse(fs.readFileSync(path.join(here, 'fixtures/modrinth-bki.json'), 'utf8'));

const project = {id: 'bki', label: 'BetterKeepInventory', modrinthSlug: 'betterkeepinventory'};

const v = (version_number, date_published, extra = {}) => ({
  id: `id-${version_number}`,
  version_number,
  version_type: 'release',
  date_published,
  changelog: `notes ${version_number}`,
  game_versions: ['1.21'],
  loaders: ['paper'],
  ...extra,
});

const frontMatter = (contents) => contents.match(/^---\n([\s\S]*?)\n---\n/)[1];

test('pickMinorReleases keeps one release per minor on the real bki response, preferring x.y.0', () => {
  const picked = pickMinorReleases(bki);
  assert.deepEqual(
    picked.map((r) => r.version_number).sort(),
    ['1.3', '1.4', '1.5', '1.6', '2.0.0', '2.1.0', '2.2.0', '2.3.0'],
  );
  assert.equal(picked.find((r) => r.version_number === '2.3.0').id, bki.find((r) => r.version_number === '2.3.0').id);
  assert.ok(picked.every((r) => r.version_type === 'release'));
});

test('a minor without x.y.0 takes its earliest release by date_published', () => {
  const picked = pickMinorReleases([
    v('1.4.2', '2026-03-03T00:00:00Z'),
    v('1.4.1', '2026-03-01T00:00:00Z'),
    v('1.4.3', '2026-03-05T00:00:00Z'),
  ]);
  assert.deepEqual(picked.map((r) => r.version_number), ['1.4.1']);
});

test('versions with prefixes and suffixes parse by their first two numeric groups', () => {
  const picked = pickMinorReleases([
    v('v2.3.4', '2026-02-01T00:00:00Z'),
    v('v2.3.0', '2026-01-01T00:00:00Z'),
    v('3.1.0+1.21', '2026-05-02T00:00:00Z'),
    v('3.1.2+1.21', '2026-05-01T00:00:00Z'),
    v('4.2+1.21', '2026-06-01T00:00:00Z'), // a bare x.y counts as x.y.0
    v('4.2.1+1.21', '2026-05-30T00:00:00Z'),
  ]);
  assert.deepEqual(picked.map((r) => [r.major, r.minor, r.version_number]).sort(), [
    [2, 3, 'v2.3.0'],
    [3, 1, '3.1.0+1.21'],
    [4, 2, '4.2+1.21'],
  ]);
});

test('pre-releases never stand for a minor, and unparseable versions are ignored', () => {
  const picked = pickMinorReleases([
    v('2.0.0-BETA-1', '2026-01-01T00:00:00Z', {version_type: 'beta'}),
    v('2.0.1', '2026-02-01T00:00:00Z'),
    v('nightly', '2026-03-01T00:00:00Z'),
  ]);
  assert.deepEqual(picked.map((r) => r.version_number), ['2.0.1']);
});

test('postFile front matter and body follow the spec', () => {
  const release = pickMinorReleases(bki).find((r) => r.version_number === '2.3.0');
  const {path: file, contents} = postFile(project, release);
  assert.equal(file, 'blog/releases/bki-2-3.md');
  assert.equal(
    frontMatter(contents),
    [
      'title: "BetterKeepInventory 2.3"',
      'date: 2026-07-24T16:39:10.804Z',
      'tags: [bki, release]',
      'authors: [beepsterr]',
      'imported: modrinth',
    ].join('\n'),
  );
  const body = contents.replace(/^---\n[\s\S]*?\n---\n/, '');
  assert.ok(body.startsWith(`\n${release.changelog.trim()}\n`));
  assert.match(body, /\nMinecraft 1\.21, .*26\.2 · folia, paper, purpur, spigot\n/);
  assert.ok(body.trimEnd().endsWith('https://modrinth.com/project/betterkeepinventory/version/' + release.id + ')'));
});

test('a release without a changelog yields only the versions line and the link', () => {
  const release = pickMinorReleases([v('1.3', '2025-08-05T11:12:41Z', {changelog: ''})])[0];
  const {contents} = postFile(project, release);
  const body = contents.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
  assert.deepEqual(body.split('\n').filter(Boolean), [
    'Minecraft 1.21 · paper',
    '[View this release on Modrinth](https://modrinth.com/project/betterkeepinventory/version/id-1.3)',
  ]);
  const nullChangelog = postFile(project, {...release, changelog: null}).contents;
  assert.equal(nullChangelog, contents);
});

test('titles with quotes and ampersands stay valid YAML', () => {
  const release = pickMinorReleases([v('1.0.0', '2026-01-01T00:00:00Z')])[0];
  const {contents} = postFile({...project, label: `Beep's "Other" End & Co`}, release);
  assert.match(contents, /^title: "Beep's \\"Other\\" End & Co 1\.0"$/m);
});

test('changelog text that would break MDX is neutralised, code is left alone', async () => {
  const changelog = [
    'Added <b>bold</b> and {x} support.',
    'Fires when ticks < 20, when ticks <20 and when a}b {x y}.',
    '',
    'Inline `<b>{x}` stays.',
    '',
    '```js',
    'if (a < b) { run(); }',
    '```',
  ].join('\r\n');
  const release = pickMinorReleases([v('1.0.0', '2026-01-01T00:00:00Z', {changelog})])[0];
  const {contents} = postFile(project, release);
  assert.ok(!contents.includes('\r'));
  const body = contents.replace(/^---\n[\s\S]*?\n---\n/, '');
  assert.ok(body.includes('Added \\<b>bold\\</b> and \\{x\\} support.'));
  assert.ok(body.includes('ticks \\< 20, when ticks \\<20 and when a\\}b \\{x y\\}.'));
  assert.ok(body.includes('Inline `<b>{x}` stays.'));
  assert.ok(body.includes('if (a < b) { run(); }'));
  await compile(body);
  await assert.rejects(compile(changelog), 'the raw changelog really does break MDX');
});

test('every real bki changelog compiles as MDX', async () => {
  for (const release of pickMinorReleases(bki)) await compile(postFile(project, release).contents);
});

test('builds of one base version merge into one release with every loader, version and link', () => {
  const picked = pickMinorReleases([
    v('1.0.0+neoforge', '2026-07-28T10:00:00Z', {loaders: ['neoforge'], game_versions: ['1.21.10', '1.21.2'], changelog: ''}),
    v('1.0.0+fabric', '2026-07-28T10:00:00Z', {loaders: ['fabric'], game_versions: ['1.21.2', '1.21.1'], changelog: 'first words'}),
    v('1.0.1+fabric', '2026-08-01T10:00:00Z'),
  ]);
  assert.equal(picked.length, 1);
  assert.deepEqual(picked[0].loaders, ['fabric', 'neoforge']);
  assert.deepEqual(picked[0].game_versions, ['1.21.1', '1.21.2', '1.21.10']);
  assert.equal(picked[0].changelog, 'first words');
  const {contents} = postFile(project, picked[0]);
  assert.ok(contents.includes('Minecraft 1.21.1, 1.21.2, 1.21.10 · fabric, neoforge'));
  assert.ok(
    contents.includes(
      'Modrinth: [fabric](https://modrinth.com/project/betterkeepinventory/version/id-1.0.0+fabric) · ' +
        '[neoforge](https://modrinth.com/project/betterkeepinventory/version/id-1.0.0+neoforge)',
    ),
  );
});

test('different patch releases are not merged', () => {
  const picked = pickMinorReleases([v('1.2.1+a', '2026-02-01T00:00:00Z'), v('1.2.2+a', '2026-03-01T00:00:00Z')]);
  assert.deepEqual(picked.map((r) => r.version_number), ['1.2.1+a']);
  assert.equal(picked[0].loaders.length, 1);
});

test('game versions sort numerically', () => {
  const release = pickMinorReleases([v('1.0.0', '2026-01-01T00:00:00Z', {game_versions: ['1.21.10', '1.21.2', '1.9', '26.1']})])[0];
  assert.deepEqual(release.game_versions, ['1.9', '1.21.2', '1.21.10', '26.1']);
});

test('headings in the changelog drop one level, except inside code', () => {
  const changelog = '# v1.3.0\n## What\'s Changed\n###### six\n#nospace\n```\n# comment\n```';
  const release = pickMinorReleases([v('1.3.0', '2026-01-01T00:00:00Z', {changelog})])[0];
  const body = postFile(project, release).contents;
  assert.ok(body.includes("\n## v1.3.0\n### What's Changed\n###### six\n#nospace\n```\n# comment\n```"));
  assert.ok(!/^# /m.test(body.replace(/^---\n[\s\S]*?\n---\n/, '').replace(/```[\s\S]*?```/g, '')));
});

test('main rejects --project without a value', async () => {
  const opts = {fetch: async () => ({ok: true, json: async () => []}), root: os.tmpdir(), projects: [project], log() {}};
  await assert.rejects(main(['--project'], opts), /usage/);
  await assert.rejects(main(['--project', '--dry-run'], opts), /usage/);
});

test('missingPosts skips a minor whose file exists, even if its content was edited', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'import-releases-'));
  fs.writeFileSync(path.join(dir, 'bki-2-3.md'), 'my own words\n');
  const releases = pickMinorReleases(bki);
  const missing = missingPosts(project, releases, dir);
  assert.equal(missing.length, releases.length - 1);
  assert.ok(!missing.some((r) => r.major === 2 && r.minor === 3));
  fs.rmSync(dir, {recursive: true});
});

test('main writes missing posts, never overwrites, and honours --dry-run and --project', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'import-releases-'));
  const calls = [];
  const fakeFetch = async (url, init) => {
    calls.push({url: String(url), ua: init?.headers?.['User-Agent']});
    return {ok: true, json: async () => bki};
  };
  const projects = [project, {id: 'zzz', label: 'No Slug'}];
  const out = [];
  const log = (line) => out.push(line);

  await main(['--dry-run'], {fetch: fakeFetch, root, projects, log});
  assert.equal(fs.existsSync(path.join(root, 'blog/releases')), false);
  assert.equal(out.filter((l) => l.includes('bki-')).length, 8);

  out.length = 0;
  await main(['--project', 'bki'], {fetch: fakeFetch, root, projects, log});
  assert.equal(fs.readdirSync(path.join(root, 'blog/releases')).length, 8);
  assert.equal(calls[0].url, 'https://api.modrinth.com/v2/project/betterkeepinventory/version');
  assert.match(calls[0].ua, /beeps-workshop-docs-importer/);

  const edited = path.join(root, 'blog/releases/bki-1-3.md');
  fs.writeFileSync(edited, 'edited\n');
  fs.rmSync(path.join(root, 'blog/releases/bki-1-4.md'));
  out.length = 0;
  await main([], {fetch: fakeFetch, root, projects, log});
  assert.equal(fs.readFileSync(edited, 'utf8'), 'edited\n');
  assert.equal(fs.readdirSync(path.join(root, 'blog/releases')).length, 8);

  out.length = 0;
  await main([], {fetch: fakeFetch, root, projects, log});
  assert.deepEqual(out, ['nothing to add']);

  await assert.rejects(main(['--project', 'nope'], {fetch: fakeFetch, root, projects, log}), /unknown project/);
  fs.rmSync(root, {recursive: true});
});

test('fetchVersions fails loudly on an HTTP error', async () => {
  await assert.rejects(fetchVersions('x', async () => ({ok: false, status: 404})), /404/);
});
