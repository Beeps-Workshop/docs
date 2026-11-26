import type {ReactNode} from 'react';
import clsx from 'clsx';
// @theme-init: the classic theme's own (from a plugin's theme path, @theme-original is this file).
import NavbarColorModeToggle from '@theme-init/Navbar/ColorModeToggle';
import type {Props} from '@theme/Navbar/ColorModeToggle';

// Wraps the classic toggle (in the bar and in the mobile menu's header) with a class that gives it the
// design's square 44px target; the pixel icons are theme/Icon/*.
export default function NavbarColorModeToggleWrapper({className}: Props): ReactNode {
  return <NavbarColorModeToggle className={clsx(className, 'workshop-color-toggle')} />;
}
