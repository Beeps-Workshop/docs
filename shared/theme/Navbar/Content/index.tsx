import {useState, type ReactNode} from 'react';
import {mdiHeart, mdiHeartOutline} from '@mdi/js';
import clsx from 'clsx';
import {siCurseforge, siModrinth} from 'simple-icons';
import {useThemeConfig, ErrorCauseBoundary, ThemeClassNames} from '@docusaurus/theme-common';
import {splitNavbarItems, useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import NavbarItem, {type Props as NavbarItemConfig} from '@theme/NavbarItem';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import SearchBar from '@theme/SearchBar';
import NavbarMobileSidebarToggle from '@theme/Navbar/MobileSidebar/Toggle';
import NavbarLogo from '@theme/Navbar/Logo';
import NavbarSearch from '@theme/Navbar/Search';

import styles from './styles.module.css';

// theme-classic's Navbar/Content (3.9.2) with the workshop's fixed far-right cluster: the instance's
// right items, then the colour-mode toggle and the Ko-fi heart, which every instance shows last. The
// left/right item lists themselves come from withWorkshop (shared/index.ts).

// A project's right-hand "Modrinth" / "CurseForge" link (label and host both match) is shown as that
// brand's icon in the same thin button; anything else, such as "download", stays a text button.
const STORE_ICONS = [
  {host: 'modrinth.com', label: 'modrinth', path: siModrinth.path},
  {host: 'curseforge.com', label: 'curseforge', path: siCurseforge.path},
];

function storeIcon(item: NavbarItemConfig): {label: string; href: string; path: string} | null {
  const {href, label} = item as {href?: unknown; label?: unknown};
  if (typeof href !== 'string' || typeof label !== 'string') return null;
  let host: string;
  try {
    host = new URL(href).hostname.toLowerCase();
  } catch {
    return null;
  }
  const store = STORE_ICONS.find(
    (s) => (host === s.host || host.endsWith(`.${s.host}`)) && label.trim().toLowerCase() === s.label,
  );
  return store ? {label, href, path: store.path} : null;
}

function NavbarItems({items}: {items: NavbarItemConfig[]}): ReactNode {
  return (
    <>
      {items.map((item, i) => (
        <ErrorCauseBoundary
          key={i}
          onError={(error) =>
            new Error(
              `A theme navbar item failed to render.
Please double-check the following navbar item (themeConfig.navbar.items) of your Docusaurus config:
${JSON.stringify(item, null, 2)}`,
              {cause: error},
            )
          }>
          <NavbarItemOrIcon item={item} />
        </ErrorCauseBoundary>
      ))}
    </>
  );
}

function NavbarItemOrIcon({item}: {item: NavbarItemConfig}): ReactNode {
  const store = storeIcon(item);
  if (!store) return <NavbarItem {...item} />;
  const className = (item as {className?: string}).className;
  return (
    <a
      className={clsx('navbar__item navbar__link', className, 'pbtn--icon')}
      href={store.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={store.label}
      title={store.label}>
      <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
        <path d={store.path} fill="currentColor" />
      </svg>
    </a>
  );
}

function KofiLink(): ReactNode {
  const [active, setActive] = useState(false);
  return (
    <a
      className={styles.kofi}
      href="https://ko-fi.com/sterr"
      target="_blank"
      rel="noopener"
      aria-label="Support on Ko-fi"
      title="Support on Ko-fi"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}>
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
        <path d={active ? mdiHeart : mdiHeartOutline} fill="currentColor" />
      </svg>
    </a>
  );
}

export default function NavbarContent(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  const items = useThemeConfig().navbar.items as NavbarItemConfig[];
  const [leftItems, rightItems] = splitNavbarItems(items);
  const searchBarItem = items.find((item) => item.type === 'search');

  return (
    <div className="navbar__inner">
      <div className={clsx(ThemeClassNames.layout.navbar.containerLeft, 'navbar__items', styles.left)}>
        {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
        <NavbarLogo />
        <NavbarItems items={leftItems} />
      </div>
      <div className={clsx(ThemeClassNames.layout.navbar.containerRight, 'navbar__items navbar__items--right')}>
        <NavbarItems items={rightItems} />
        {!searchBarItem && (
          <NavbarSearch>
            <SearchBar />
          </NavbarSearch>
        )}
        <NavbarColorModeToggle className={styles.colorModeToggle} />
        <KofiLink />
      </div>
    </div>
  );
}
