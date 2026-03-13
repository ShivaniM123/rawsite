/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-logos block.
 * Base: cards (variant: cards-logos)
 * Source: section.elementor-element-54da4523
 * Source URL: https://solucoes.prodesp.sp.gov.br/acordos/
 *
 * Structure: Grid of 28 company logos in rows of 4
 *   Each logo is an image wrapped in a link to the agreements page
 *   Found in: .elementor-widget-image > .elementor-widget-container > a > picture/img
 *
 * Target: Cards-logos block table with 1 cell per row (linked image)
 *   The cards-logos CSS handles circular grey backgrounds and 4-column grid
 *   Card body is hidden via CSS (display: none)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all image widgets within this section (each is a company logo)
  const imageWidgets = element.querySelectorAll('.elementor-widget-image');

  imageWidgets.forEach((widget) => {
    const link = widget.querySelector('a');
    const img = widget.querySelector('img');

    if (img) {
      // Use the linked image if available, otherwise just the image
      cells.push([link || img]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-logos',
    cells,
  });
  element.replaceWith(block);
}
