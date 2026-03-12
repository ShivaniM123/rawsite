/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/prodesp-cleanup.js';
import sectionsTransformer from './transformers/prodesp-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero': heroParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'content-page',
  description: 'Standard content page with hero banner, breadcrumb, and single-column content area for text, documents, and CTAs',
  urls: [
    'https://www.prodesp.sp.gov.br/transparencia/dados-abertos',
    'https://www.prodesp.sp.gov.br/institucional/missao-visao-e-valores',
    'https://www.prodesp.sp.gov.br/transparencia/carta-de-servicos-ao-usuario',
    'https://www.prodesp.sp.gov.br/transparencia/demonstracoes-financeiras',
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['section.elementor-element-6e2d2fe'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner',
      selector: 'section.elementor-element-6e2d2fe',
      style: 'dark-purple',
      blocks: ['hero'],
      defaultContent: ['h1.page-title'],
    },
    {
      id: 'section-2',
      name: 'Breadcrumb',
      selector: 'section.elementor-element-5ffff5d',
      style: null,
      blocks: [],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Main Content',
      selector: 'section.elementor-element-8dea8a1',
      style: null,
      blocks: [],
      defaultContent: ['.elementor-element-61409e0 .elementor-text-editor'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
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
