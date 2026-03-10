/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-video variant.
 * Base block: hero (1 col, 3 rows: name, bg image, content)
 * Source: https://www.prodesp.sp.gov.br/
 * Source selector: section.elementor-element-29fca9b .jet-video
 * Generated: 2026-03-10
 */
export default function parse(element, { document }) {
  // Extract background/overlay image from video overlay
  // From source DOM: .jet-video__overlay img
  const overlayImg = element.querySelector('.jet-video__overlay img, .jet-video img');

  // Extract video source for reference
  // From source DOM: video.jet-video-player
  const video = element.querySelector('video.jet-video-player, video');

  const cells = [];

  // Row 1: Background image (the video overlay image)
  if (overlayImg) {
    cells.push([overlayImg]);
  } else if (video) {
    // Fallback: create a link to the video
    const videoLink = document.createElement('a');
    videoLink.href = video.src || video.getAttribute('src') || '';
    videoLink.textContent = 'Video';
    cells.push([videoLink]);
  }

  // Row 2: Content cell (heading + description)
  const contentCell = [];
  // No explicit heading in the video hero; add video title if available
  const heading = element.querySelector('h1, h2, h3, [class*="title"]');
  if (heading) {
    contentCell.push(heading);
  }

  // If there's a play button text, skip it (decorative)
  // Add video link as a CTA
  if (video && video.src) {
    const link = document.createElement('a');
    link.href = video.src;
    link.textContent = 'Assistir vídeo';
    contentCell.push(link);
  }

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-video', cells });
  element.replaceWith(block);
}
