import type {ReactNode} from 'react';
import clsx from 'clsx';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';
import type {Props as DropdownProps} from '@theme/NavbarItem/DropdownNavbarItem';
import {PROJECTS, projectIcon} from '../../projects';
import {crossInstanceLink} from '../../links';

type Props = Omit<DropdownProps, 'items' | 'label'> & {
  /** The project this instance documents: the dropdown's label and its active entry. */
  projectId: string;
};

// The project breadcrumb in a project instance's navbar (`Beep's Workshop / <project> ▾`): a dropdown
// of every project, each a cross-instance link. Those links are plain <a>s, so Docusaurus can't tell
// which one is active; the current project's entry gets the active classes here.
export default function ProjectDropdown({projectId, mobile, className, ...props}: Props): ReactNode {
  const project = PROJECTS.find((p) => p.id === projectId);
  if (!project) throw new Error(`ProjectDropdown: unknown projectId '${projectId}'`);
  const items = PROJECTS.map((p) => ({
    label: p.short,
    ...crossInstanceLink(`/${p.id}/`),
    ...(p === project && {className: 'dropdown__link--active menu__link--active'}),
  }));
  // The icon lives in the main instance's static/, so its path is absolute (no /<id>/ base URL).
  const label = (
    <>
      <img className="workshop-navbar__project-icon" src={projectIcon(project.id)} alt="" width={24} height={24} />
      {project.short}
    </>
  );
  const dropdown = (
    <DropdownNavbarItem
      {...props}
      mobile={mobile}
      className={clsx('workshop-navbar__project', className)}
      // Rendered as the trigger's content; the type says string, the stock component renders any node.
      label={label as unknown as string}
      items={items}
    />
  );
  if (mobile) return dropdown;
  return (
    <>
      <span className="workshop-navbar__separator" aria-hidden="true">
        /
      </span>
      {dropdown}
    </>
  );
}
