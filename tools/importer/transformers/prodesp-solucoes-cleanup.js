/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: prodesp-solucoes cleanup.
 * Selectors from captured DOM of https://solucoes.prodesp.sp.gov.br/acordos/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove popup modals (very large, ~8850 lines of hidden pricing tables)
    // Found in captured HTML: <div id="pum-18384" class="pum pum-overlay ...">
    WebImporter.DOMUtils.remove(element, ['.pum-overlay', '.pum']);

    // Remove government top bar
    // Found in captured HTML: <section class="govsp-topo">
    WebImporter.DOMUtils.remove(element, ['.govsp-topo']);

    // Remove government kebab menu
    // Found in captured HTML: <div class="govsp-kebab">
    WebImporter.DOMUtils.remove(element, ['.govsp-kebab']);
  }

  if (hookName === H.after) {
    // Remove site header (Prodesp logo + navigation)
    // Found in captured HTML: <header id="masthead">
    WebImporter.DOMUtils.remove(element, ['header#masthead']);

    // Remove site footer (navigation, address, social links, copyright)
    // Found in captured HTML: <footer id="colophon">
    WebImporter.DOMUtils.remove(element, ['footer#colophon']);

    // Remove government footer bar
    // Found in captured HTML: <section id="govsp-rodape">
    WebImporter.DOMUtils.remove(element, ['#govsp-rodape']);

    // Remove iframes, link elements, noscript tags
    WebImporter.DOMUtils.remove(element, ['iframe', 'link', 'noscript']);

    // Remove source elements (leftover from picture tags)
    WebImporter.DOMUtils.remove(element, ['source']);
  }
}
