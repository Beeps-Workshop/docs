import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useThemeConfig} from '@docusaurus/theme-common';
import ThemedImage from '@theme/ThemedImage';
import type {Props} from '@theme/Logo';
import {crossInstanceLink} from '../../links';

// Replaces (not wraps) the classic Logo so the navbar title/logo goes to the front page from every
// instance. The original links to the instance's own base URL (/bki/ in a project). Otherwise the
// same as theme-classic's Logo.
export default function Logo(props: Props): ReactNode {
  const {
    siteConfig: {title},
  } = useDocusaurusContext();
  const {
    navbar: {title: navbarTitle, logo},
  } = useThemeConfig();
  const {imageClassName, titleClassName, ...propsRest} = props;
  // If visible title is shown, fallback alt text should be an empty string to mark the logo as decorative.
  const alt = logo?.alt ?? (navbarTitle ? '' : title);
  return (
    <Link {...crossInstanceLink('/')} {...propsRest} {...(logo?.target && {target: logo.target})}>
      {logo && <LogoImage logo={logo} alt={alt} imageClassName={imageClassName} />}
      {navbarTitle != null && <b className={titleClassName}>{navbarTitle}</b>}
    </Link>
  );
}

type NavbarLogo = NonNullable<ReturnType<typeof useThemeConfig>['navbar']['logo']>;

function LogoImage({logo, alt, imageClassName}: {logo: NavbarLogo; alt: string; imageClassName?: string}): ReactNode {
  const sources = {
    light: useBaseUrl(logo.src),
    dark: useBaseUrl(logo.srcDark || logo.src),
  };
  const image = (
    <ThemedImage
      className={logo.className}
      sources={sources}
      height={logo.height}
      width={logo.width}
      alt={alt}
      style={logo.style}
    />
  );
  return imageClassName ? <div className={imageClassName}>{image}</div> : image;
}
