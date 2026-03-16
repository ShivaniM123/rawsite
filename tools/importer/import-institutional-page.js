/* eslint-disable */
/* global WebImporter */

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/prodesp-cleanup.js';
import sectionsTransformer from './transformers/prodesp-sections.js';

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'institutional-page',
  urls: [
    'https://www.prodesp.sp.gov.br/institucional/certificacoes',
  ],
  description: 'Institutional content page for Prodesp certifications, awards, and organizational information',
  blocks: [],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner',
      selector: 'section.elementor-element-cf8b35b',
      style: 'purple-gradient',
      blocks: [],
      defaultContent: [
        '.elementor-element-cf8b35b h1',
      ],
    },
    {
      id: 'section-2',
      name: 'Main Content',
      selector: 'section.elementor-element-3987062',
      style: null,
      blocks: [],
      defaultContent: [
        '.jet-breadcrumbs',
        '.elementor-element-0ab498f .elementor-text-editor',
      ],
    },
    {
      id: 'section-3',
      name: 'Infographic Image',
      selector: 'section.elementor-element-19d5e73',
      style: null,
      blocks: [],
      defaultContent: [
        '.elementor-element-f4af0a3 img',
      ],
    },
    {
      id: 'section-4',
      name: 'Tetrahedron Diagram',
      selector: 'section.elementor-element-bfda84f',
      style: null,
      blocks: [],
      defaultContent: [
        '.elementor-element-abdf7e3 img',
      ],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. No blocks to parse - all default content

    // 3. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 4. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 5. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: [],
      },
    }];
  },
};
