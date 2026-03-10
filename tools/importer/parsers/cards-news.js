/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-news variant.
 * Base block: cards (2 cols per row: image | text content)
 * Source: https://www.prodesp.sp.gov.br/
 * Source selector: section.elementor-element-0a91720 .jet-posts
 * Generated: 2026-03-10
 */
export default function parse(element, { document }) {
  // From source DOM: .jet-posts__item contains each card
  const items = element.querySelectorAll('.jet-posts__item');

  const cells = [];

  items.forEach((item) => {
    // Column 1: Image
    // From source DOM: .jet-posts__inner-box > img, or .jet-posts__thumb img
    const img = item.querySelector('.jet-posts__inner-box > img, .jet-posts__thumb img, img');

    // Column 2: Text content (title + optional description)
    // From source DOM: .jet-posts__inner-content h4.entry-title a
    const titleEl = item.querySelector('h4.entry-title a, .entry-title a, h4 a, h3 a');

    const textContent = [];
    if (titleEl) {
      // Create a proper heading element with the link
      const heading = document.createElement('h4');
      const link = document.createElement('a');
      link.href = titleEl.href || titleEl.getAttribute('href') || '';
      link.textContent = titleEl.textContent.trim();
      heading.append(link);
      textContent.push(heading);
    }

    // Add description if present
    // From source DOM: .jet-posts__inner-content p, .jet-posts__excerpt
    const desc = item.querySelector('.jet-posts__inner-content p, .jet-posts__excerpt');
    if (desc && desc.textContent.trim()) {
      textContent.push(desc);
    }

    // Build card row: [image, text]
    const imageCell = img ? [img] : [''];
    const textCell = textContent.length > 0 ? textContent : [''];
    cells.push([imageCell, textCell]);
  });

  if (cells.length === 0) {
    // Fallback: no items found, create empty block
    cells.push([[''], ['']]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news', cells });
  element.replaceWith(block);
}
