/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: prodesp-solucoes sections.
 * Adds section breaks (<hr>) and Section Metadata blocks from template sections.
 * Selectors from captured DOM of https://solucoes.prodesp.sp.gov.br/acordos/
 *
 * Sections:
 * - section-hero: section.elementor-element-1aebf83 (style: null)
 * - section-benefits: section.elementor-element-6785598a (style: dark)
 * - section-companies: section.elementor-element-2a2a10e / section.elementor-element-54da4523 (style: null)
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const sections = payload?.template?.sections;
    if (!sections || sections.length < 2) return;

    const doc = element.ownerDocument;

    // Process sections in reverse order to avoid DOM position shifts
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];

      // Find the first matching element for this section
      let sectionEl = null;
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }
      if (!sectionEl) continue;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metaBlock);
      }

      // Add <hr> section break before non-first sections
      if (i > 0) {
        const hr = doc.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
