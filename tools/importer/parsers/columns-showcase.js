/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-showcase variant.
 * Base block: columns (N cols, row 1 = name, subsequent rows = N cells)
 * Source: https://www.prodesp.sp.gov.br/
 * Source selectors: section.elementor-element-022a7e5, -1351002, -06386f9, -b0959dd, -e0e7ee2, -463e9ae
 * Generated: 2026-03-10
 */
export default function parse(element, { document }) {
  // The element is .elementor-container with .elementor-row containing columns
  // From source DOM: .elementor-row > .elementor-col-50 (two columns)
  // or .elementor-row > .elementor-col-25 (four columns for certifications)
  const row = element.querySelector('.elementor-row') || element;
  const columns = row.querySelectorAll(':scope > .elementor-column, :scope > [class*="elementor-col-"]');

  if (!columns || columns.length === 0) {
    // Fallback: treat the whole element as a single column
    const block = WebImporter.Blocks.createBlock(document, { name: 'columns-showcase', cells: [[element.innerHTML]] });
    element.replaceWith(block);
    return;
  }

  // Build cells array - one row with N columns
  const cellRow = [];

  columns.forEach((col) => {
    const cellContent = [];

    // Extract images (including motion-effects background images)
    // From source DOM: .elementor-motion-effects-layer img, .elementor-image img
    const images = col.querySelectorAll('.elementor-motion-effects-layer img, .elementor-image img, .elementor-widget-image img');
    images.forEach((img) => cellContent.push(img));

    // Extract headings
    // From source DOM: .elementor-heading-title, h2, h3
    const headings = col.querySelectorAll('.elementor-heading-title, h2, h3');
    headings.forEach((h) => cellContent.push(h));

    // Extract text paragraphs
    // From source DOM: .elementor-text-editor p
    const paragraphs = col.querySelectorAll('.elementor-text-editor p, .elementor-clearfix p');
    paragraphs.forEach((p) => {
      if (p.textContent.trim()) cellContent.push(p);
    });

    // Extract CTA links
    // From source DOM: .elementor-icon-box-title a, .elementor-icon-box-content a
    const links = col.querySelectorAll('.elementor-icon-box-title a, .elementor-icon-box-content a');
    links.forEach((link) => cellContent.push(link));

    // Extract video elements
    // From source DOM: video.jet-video-player
    const videos = col.querySelectorAll('video');
    videos.forEach((v) => {
      if (v.src) {
        const videoLink = document.createElement('a');
        videoLink.href = v.src;
        videoLink.textContent = v.src;
        cellContent.push(videoLink);
      }
    });

    // If column has any content, add it; otherwise add empty placeholder
    if (cellContent.length > 0) {
      cellRow.push(cellContent);
    } else {
      cellRow.push('');
    }
  });

  const cells = [cellRow];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-showcase', cells });
  element.replaceWith(block);
}
