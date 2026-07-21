import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {PROJECTS} from '@site/src/projects';

// Homepage hub: a hero + one card per project linking into its docs.
// All copy (tagline, per-project blurbs) is intentionally left blank — write your own.
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

      <main className="container" style={{padding: '2.5rem 0'}}>
        <div className="project-grid">
          {PROJECTS.map((p) => (
            <div key={p.id} className="card project-card">
              <div className="card__header">
                <Heading as="h3">{p.label}</Heading>
              </div>
              <div className="card__body">
                {/* TODO: write a one-line blurb in src/projects.ts */}
                <p>{p.blurb}</p>
              </div>
              <div className="card__footer">
                <Link className="button button--primary button--block" to={`/${p.id}`}>
                  Read the docs
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
}
