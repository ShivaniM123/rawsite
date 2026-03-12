/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Prodesp site-wide cleanup.
 * Selectors from captured DOM of https://www.prodesp.sp.gov.br/transparencia/dados-abertos
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent banner (found: div#cookie-notice)
    // Remove gov SP top bar elections section (found: section#topo-eleicoes)
    WebImporter.DOMUtils.remove(element, [
      '#cookie-notice',
      '#topo-eleicoes',
    ]);
  }
  if (hookName === TransformHook.afterTransform) {
    // Remove site header (found: header#masthead)
    // Remove site footer (found: footer#colophon)
    // Remove skip link (found: a.skip-link)
    // Remove gov SP official top bar (found: section#topo-oficial)
    // Remove breadcrumb section (found: .elementor-widget-jet-breadcrumbs parent section)
    // Remove noscript, link, iframe elements
    WebImporter.DOMUtils.remove(element, [
      'header#masthead',
      'footer#colophon',
      'a.skip-link',
      '#topo-oficial',
      '.elementor-widget-jet-breadcrumbs',
      'noscript',
      'link',
      'iframe',
    ]);
  }
}
