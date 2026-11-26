import type {CSSProperties, ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
import Layout from '@theme/Layout';
import {PROJECTS, projectHeader, projectIcon, projectTagStyle, type Project} from '@site/shared/projects';
import {crossInstanceLink} from '@site/shared/links';
import {useWorkshopNews} from '@site/shared/useWorkshopNews';
import type {NewsPost} from '@site/shared/news';

// The main site's homepage (spec: workshop restyle, Homepage): the hero with the latest news beside
// it, a pixel divider, then a card per project linking to its docs.

const HERO_LINE = 'Minecraft mods, server plugins and assorted tinkering. Docs and downloads for all of it.';

// One step of the divider's zigzag (88px wide, back to the starting height), after a lead-in.
const DIVIDER_PATH =
  'M0 10 h8 v-4 h8 v-4 h16' + ' v4 h8 v4 h16 v4 h8 v4 h16 v-4 h8 v-4 h8 v-4 h8 v-4 h16'.repeat(24);

/** A CSS url() for an image path, with the base URL. Shown as a background, a missing file leaves
 * only the box's own colour instead of a broken-image icon. */
function useImageUrl(path: string): string {
  return `url(${JSON.stringify(useBaseUrl(path))})`;
}

function NewsItem({post}: {post: NewsPost}): ReactNode {
  return (
    <Link to={post.permalink} className="home-news__post">
      <time className="home-news__date" dateTime={post.date}>
        {post.date.slice(0, 10)}
      </time>
      <span className="home-news__text">
        <span className="home-news__title">{post.title}</span>
        {post.summary && <span className="home-news__summary">{post.summary}</span>}
      </span>
    </Link>
  );
}

/** The newest posts beside the hero, or nothing while the blog has none (/blog exists only then). */
function NewsStrip(): ReactNode {
  const {latest} = useWorkshopNews();
  if (latest.length === 0) return null;
  return (
    <section id="news" className="home-news px" aria-labelledby="home-news-heading">
      <div className="home-news__head">
        <h2 id="home-news-heading" className="home-news__heading">
          news
        </h2>
        <Link to="/blog" className="home-news__all">
          all posts &gt;
        </Link>
      </div>
      {latest.map((post) => (
        <NewsItem key={post.permalink} post={post} />
      ))}
    </section>
  );
}

// A mod's card opens with its header art, its icon framed over the art's lower edge; other kinds
// have no art (the design), so the icon sits at the top.
function ProjectCard({project}: {project: Project}): ReactNode {
  const header = useImageUrl(projectHeader(project.id));
  const icon = useImageUrl(projectIcon(project.id));
  const withHeader = project.kind === 'mod';
  const tagStyle = projectTagStyle(project.id) as CSSProperties;
  return (
    <Link className={`home-card pcard px${withHeader ? ' home-card--header' : ''}`} {...crossInstanceLink(`/${project.id}/`)}>
      {withHeader && (
        <span className="home-card__header" style={{...tagStyle, backgroundImage: header}} aria-hidden="true" />
      )}
      <span className="home-card__top">
        <span className="home-card__icon-frame px">
          <span className="home-card__icon" style={{backgroundImage: icon}} aria-hidden="true" />
        </span>
        <span className="home-card__kind ptag" style={tagStyle}>
          {project.kind}
        </span>
      </span>
      <span className="home-card__body">
        <span className="home-card__name">{project.label}</span>
        <span className="home-card__blurb">{project.blurb}</span>
      </span>
    </Link>
  );
}

export default function Home(): ReactNode {
  // The navbar's "projects" links to /#projects. The anchor checks see only ids from headings and
  // links, so the section's id is reported here.
  useBrokenLinks().collectAnchor('projects');
  return (
    <Layout description={HERO_LINE}>
      <main className="home">
        <section className="home-hero">
          <div className="home-hero__intro">
            <h1 className="home-hero__title">
              Beep&apos;s
              <br />
              Workshop
            </h1>
            <div className="home-hero__bar" aria-hidden="true">
              <div />
            </div>
            <p className="home-hero__line">{HERO_LINE}</p>
          </div>
          <NewsStrip />
        </section>

        <div className="home-divider" aria-hidden="true">
          <svg width="2144" height="20" viewBox="0 0 2144 20" shapeRendering="crispEdges">
            <path d={DIVIDER_PATH} fill="none" strokeWidth="3" />
          </svg>
        </div>

        <section id="projects" className="home-projects" aria-labelledby="home-projects-heading">
          <h2 id="home-projects-heading" className="home-projects__heading">
            projects
          </h2>
          <div className="home-projects__grid">
            {PROJECTS.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
