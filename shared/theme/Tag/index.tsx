import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/Tag';
import {PROJECTS, projectIcon, projectTagStyle} from '../../projects';
import styles from './styles.module.css';

// Replaces the classic Tag (posts' and docs' tag lists, the tags pages) with a pixel chip. A blog tag
// named after a project (blog/tags.yml: /blog/tags/<id>) is tinted in that project's accent and
// carries its icon. Not a wrap: the classic Tag's Link has no slot for the chip's style or icon, so it
// is rewritten with the same props and href.
export default function Tag({permalink, label, count, description}: Props): ReactNode {
  const project = PROJECTS.find((p) => permalink.endsWith(`/blog/tags/${p.id}`));
  return (
    <Link
      rel="tag"
      href={permalink}
      title={description}
      className="ptag"
      style={project && (projectTagStyle(project.id) as React.CSSProperties)}>
      {project && <img className={styles.icon} src={projectIcon(project.id)} alt="" width={16} height={16} />}
      {label}
      {count !== undefined && <span className={styles.count}>{count}</span>}
    </Link>
  );
}
