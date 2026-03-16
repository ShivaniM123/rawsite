import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Decorates the columns section of the footer.
 * The fragment structure has each column as a direct child div of the section.
 * @param {Element} section The first section containing footer columns
 */
function decorateColumns(section) {
  section.classList.add('footer-columns');
  [...section.children].forEach((col) => {
    col.classList.add('footer-column');

    // Find the social icons paragraph
    const socialP = col.querySelector('p.footer-social');
    if (!socialP) {
      // Check for paragraph with multiple icon spans
      const iconPs = col.querySelectorAll('p');
      iconPs.forEach((p) => {
        const icons = p.querySelectorAll('.icon');
        if (icons.length >= 3) {
          p.classList.add('footer-social');
        }
      });
    }
  });
}

/**
 * Decorates the bottom bar section with gov buttons and logo.
 * @param {Element} section The last section of the footer
 */
function decorateBottomBar(section) {
  const wrapper = section.querySelector('.default-content-wrapper');
  if (!wrapper) return;

  wrapper.classList.add('footer-bottom');

  // Style gov button links
  wrapper.querySelectorAll('a').forEach((a) => {
    const p = a.closest('p');
    if (!p) return;

    // Links with text (not image-only) become gov buttons
    if (a.textContent.trim() && !a.querySelector('img')) {
      a.classList.add('button', 'footer-gov-btn');
      p.classList.add('button-wrapper');
    }
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  let footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  if (!footerMeta && window.location.pathname.startsWith('/content/')) {
    footerPath = '/content/footer';
  }
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const sections = footer.querySelectorAll('.section');

  // Decorate columns in the first section
  if (sections.length > 0) {
    decorateColumns(sections[0]);
  }

  // Decorate bottom bar in the last section
  if (sections.length > 1) {
    decorateBottomBar(sections[sections.length - 1]);
  }

  block.append(footer);
}
