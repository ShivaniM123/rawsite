/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Prodesp section breaks and section-metadata.
 * Template: content-page (3 sections: Hero Banner, Breadcrumb, Main Content)
 * Sections with style: section-1 Hero Banner (dark-purple)
 * Selectors from captured DOM of https://www.prodesp.sp.gov.br/transparencia/dados-abertos
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = payload;
    const sections = payload.template?.sections;
    if (!sections || sections.length < 2) return;

    // Filter to sections that have meaningful content (blocks, defaultContent, or style)
    const activeSections = sections.filter(
      (s) => (s.blocks && s.blocks.length > 0) || (s.defaultContent && s.defaultContent.length > 0) || s.style,
    );

    // Process active sections in reverse order
    for (let i = activeSections.length - 1; i >= 0; i -= 1) {
      const section = activeSections[i];
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];

      let sectionEl = null;
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }
      if (!sectionEl) continue;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metaBlock);
      }

      // Add section break (hr) before non-first active sections
      if (i > 0 && sectionEl.previousElementSibling) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
