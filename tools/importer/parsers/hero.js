/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block variant.
 * Base block: hero
 * Source: https://www.prodesp.sp.gov.br/transparencia/dados-abertos
 * Selector: section.elementor-element-6e2d2fe
 * Source DOM: background image (.elementor-element-71eff86 img) with optional heading overlay
 */
export default function parse(element, { document }) {
  // Extract background image (found: .elementor-element-71eff86 .elementor-image img)
  const bgImage = element.querySelector('.elementor-element-71eff86 img, .bg-internoImage img, img');

  // Extract optional heading content (may exist on other content-page variants)
  const heading = element.querySelector('h1, h2, h3, [class*="title"]');
  const description = element.querySelector('p, [class*="subtitle"], [class*="description"]');
  const ctaLinks = Array.from(element.querySelectorAll('a.cta, a.button, a.elementor-button'));

  const cells = [];

  // Row 1: Background image
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content (heading, description, CTAs)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  contentCell.push(...ctaLinks);
  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
