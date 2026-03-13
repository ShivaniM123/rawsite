/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block.
 * Base: cards
 * Source: section.elementor-element-11d2837b
 * Source URL: https://solucoes.prodesp.sp.gov.br/acordos/
 *
 * Structure: 3 image-box widgets in a row (icon + title each)
 *   - acordo-02.png | + OFERTAS DE PRODUTOS E SERVIÇOS
 *   - acordo-03.png | + ECONOMIA
 *   - acordo-04.png | + AGILIDADE NA CONTRATAÇÃO DOS SERVIÇOS
 *
 * Target: Cards block table with 2 columns per row (image | text)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all image-box widgets (each represents a card)
  const imageBoxes = element.querySelectorAll('.elementor-widget-image-box');

  imageBoxes.forEach((box) => {
    const img = box.querySelector('.elementor-image-box-img img');
    const title = box.querySelector('.elementor-image-box-title');

    // Clean trailing <br> tags from title (e.g. "+ ECONOMIA<br><br>")
    if (title) {
      title.querySelectorAll('br').forEach((br) => br.remove());
    }

    cells.push([img || '', title || '']);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards',
    cells,
  });
  element.replaceWith(block);
}
