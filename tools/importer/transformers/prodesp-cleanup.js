/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Prodesp cleanup.
 * Selectors from captured DOM of https://www.prodesp.sp.gov.br/
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove elements that may interfere with block parsing
    // Government election bar (top banner) - from captured DOM: id="topo-eleicoes"
    // Government official bar (top banner) - from captured DOM: id="topo-oficial"
    // Mobile-hidden navigation section - from captured DOM: class="dpNoneMobile"
    // Sticky nav section - from captured DOM: class="jet-sticky-section"
    WebImporter.DOMUtils.remove(element, [
      '#topo-eleicoes',
      '#topo-oficial',
      '.dpNoneMobile',
      '.jet-sticky-section',
      // Skip-to-content link
      'a.skip-link',
      // Cookie consent banner
      '#cookie-notice',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome
    // Site header - from captured DOM: id="masthead", class="site-header"
    // Site footer - from captured DOM: id="colophon", class="site-footer"
    // Footer official menu - from captured DOM: id="menu-rodape-oficial"
    // Footer election menu - from captured DOM: id="rodape-menu-eleicoes"
    // Page header with H1 "Home" - from captured DOM: class="page-header"
    // Spacer elements - from captured DOM: class="elementor-widget-spacer"
    // Iframes, link tags, noscript
    WebImporter.DOMUtils.remove(element, [
      'header#masthead',
      'footer#colophon',
      '#menu-rodape-oficial',
      '#rodape-menu-eleicoes',
      '.page-header',
      '.elementor-widget-spacer',
      // News article: post metadata, author bio, post navigation
      '.entry-meta',
      '.entry-footer',
      '.post-author-bio',
      'nav.post-navigation',
      'iframe',
      'link',
      'noscript',
    ]);
  }
}
