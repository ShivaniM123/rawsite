/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block.
 * Base: columns
 * Source: section.elementor-element-6552a544
 * Source URL: https://solucoes.prodesp.sp.gov.br/acordos/
 *
 * Structure: 2-column layout
 *   Left column: 4 paragraphs of text (Prodesp mission description)
 *   Right column: illustration image (acordo-01.png)
 *
 * Target: Columns block table with 1 row, 2 columns
 */
export default function parse(element, { document }) {
  // Find inner columns (elementor-col-50 within the inner section)
  const cols = element.querySelectorAll(':scope .elementor-inner-column');

  const row = [];

  cols.forEach((col) => {
    const cellContent = [];

    // Gather text content from text-editor widgets
    col.querySelectorAll('.elementor-widget-text-editor .elementor-widget-container > *').forEach((el) => {
      cellContent.push(el);
    });

    // Gather images from image widgets
    col.querySelectorAll('.elementor-widget-image img').forEach((img) => {
      cellContent.push(img);
    });

    row.push(cellContent);
  });

  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns',
    cells,
  });
  element.replaceWith(block);
}
