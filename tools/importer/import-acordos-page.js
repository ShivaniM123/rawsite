/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import columnsParser from './parsers/columns.js';
import cardsParser from './parsers/cards.js';
import cardsLogosParser from './parsers/cards-logos.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/prodesp-solucoes-cleanup.js';
import sectionsTransformer from './transformers/prodesp-solucoes-sections.js';

// PARSER REGISTRY
const parsers = {
  'columns': columnsParser,
  'cards': cardsParser,
  'cards-logos': cardsLogosParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'acordos-page',
  urls: [
    'https://solucoes.prodesp.sp.gov.br/acordos/'
  ],
  description: 'Agreements/partnerships landing page on the Prodesp solutions portal',
  blocks: [
    {
      name: 'columns',
      instances: ['section.elementor-element-6552a544']
    },
    {
      name: 'cards',
      instances: ['section.elementor-element-11d2837b']
    },
    {
      name: 'cards-logos',
      instances: ['section.elementor-element-54da4523']
    }
  ],
  sections: [
    {
      id: 'section-hero',
      name: 'Hero / Intro',
      selector: 'section.elementor-element-1aebf83',
      style: null,
      blocks: ['columns'],
      defaultContent: ['.elementor-element-3cafce9f h2']
    },
    {
      id: 'section-benefits',
      name: 'Benefits / Value Props',
      selector: 'section.elementor-element-6785598a',
      style: 'dark',
      blocks: ['cards'],
      defaultContent: []
    },
    {
      id: 'section-companies',
      name: 'Companies Section',
      selector: ['section.elementor-element-2a2a10e', 'section.elementor-element-54da4523'],
      style: null,
      blocks: ['cards-logos'],
      defaultContent: ['.elementor-element-132d1563 h2']
    }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
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

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
