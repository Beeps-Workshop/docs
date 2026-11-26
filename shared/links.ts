// Links between instances (a project's docs, the main site's /contact, ...). Each instance is its own
// Docusaurus site, so these can't be checked for broken links or routed client-side.
//
// `pathname://` makes Docusaurus' Link treat the URL as a plain <a> and skip the broken-link check,
// but on its own it still prepends the instance's base URL (/bki/contact) and opens a new tab.
// `autoAddBaseUrl: false` and `target: '_self'` turn both off. Spread the result into a <Link> or a
// navbar/footer item (they pass extra keys through to Link).
export const crossInstanceLink = (pathname: string) => ({
  to: `pathname://${pathname}`,
  autoAddBaseUrl: false,
  target: '_self',
});
