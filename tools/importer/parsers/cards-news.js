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
  // Support two source DOM patterns:
  // 1. Homepage: .jet-posts__item (Elementor JetEngine posts)
  // 2. News sidebar: .rpwe-li (Recent Posts Widget Extended)
  const items = element.querySelectorAll('.jet-posts__item, .rpwe-li');

  const cells = [];

  items.forEach((item) => {
    // Column 1: Image
    const img = item.querySelector('.jet-posts__inner-box > img, .jet-posts__thumb img, .rpwe-thumb, img');

    // Column 2: Text content (title + optional description)
    const titleEl = item.querySelector('h4.entry-title a, .entry-title a, .rpwe-title a, h4 a, h3 a');

    const textContent = [];
    if (titleEl) {
      const heading = document.createElement('h4');
      const link = document.createElement('a');
      link.href = titleEl.href || titleEl.getAttribute('href') || '';
      link.textContent = titleEl.textContent.trim();
      heading.append(link);
      textContent.push(heading);
    }

    // Add description if present
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
