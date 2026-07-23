import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {MODS, PLUGINS, projectHeader, projectIcon, type Project} from '@site/src/projects';

// Missing images are hidden so the gradient placeholder behind them shows through
// instead of a broken-image icon.
const hideIfMissing = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.style.display = 'none';
};

// Homepage hub: a hero + Mods / Plugins sections, one card per project.
function ProjectCard({project}: {project: Project}): ReactNode {
  return (
    <div className="card project-card">
      <div className="project-card__media">
        <img
          src={projectHeader(project.id)}
          alt=""
          loading="lazy"
          onError={hideIfMissing}
        />
      </div>
      <div className="card__header project-card__head">
        <img
          className="project-card__icon"
          src={projectIcon(project.id)}
          alt=""
          loading="lazy"
          onError={hideIfMissing}
        />
        <Heading as="h3">{project.label}</Heading>
      </div>
      <div className="card__body">
        {/* TODO: write a one-line blurb in src/projects.ts */}
        <p>{project.blurb}</p>
      </div>
      <div className="card__footer project-card__actions">
        <Link className="button button--primary button--block" to={`/${project.id}`}>
          Read the docs
        </Link>
        <div className="project-card__links">
          {project.modrinth && (
            <Link className="button button--secondary button--sm" href={project.modrinth}>
              Modrinth
            </Link>
          )}
          {project.curseforge && (
            <Link className="button button--secondary button--sm" href={project.curseforge}>
              CurseForge
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectSection({title, projects}: {title: string; projects: Project[]}): ReactNode {
  if (projects.length === 0) return null;
  return (
    <section style={{marginTop: '2.5rem'}}>
      <Heading as="h2">{title}</Heading>
      <div className="project-grid">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout title="Beep's Workshop" description="">
      <header className="hero hero--primary" style={{padding: '4rem 0'}}>
        <div className="container">
          <Heading as="h1" className="hero__title">
            Beep&apos;s Workshop
          </Heading>
          {/* TODO: write a one-line tagline */}
          <p className="hero__subtitle" />
        </div>
      </header>

      <main className="container" style={{padding: '1rem 0 3rem'}}>
        <ProjectSection title="Mods" projects={MODS} />
        <ProjectSection title="Plugins" projects={PLUGINS} />
      </main>
    </Layout>
  );
}
