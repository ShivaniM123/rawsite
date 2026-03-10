/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroVideoParser from './parsers/hero-video.js';
import columnsShowcaseParser from './parsers/columns-showcase.js';
import cardsNewsParser from './parsers/cards-news.js';

// TRANSFORMER IMPORTS
import prodespCleanupTransformer from './transformers/prodesp-cleanup.js';
import prodespSectionsTransformer from './transformers/prodesp-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-video': heroVideoParser,
  'columns-showcase': columnsShowcaseParser,
  'cards-news': cardsNewsParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Prodesp homepage - main landing page with hero, services, news, and institutional content',
  urls: [
    'https://www.prodesp.sp.gov.br/'
  ],
  blocks: [
    {
      name: 'hero-video',
      instances: [
        'section.elementor-element-29fca9b .jet-video'
      ]
    },
    {
      name: 'columns-showcase',
      instances: [
        'section.elementor-element-022a7e5 > .elementor-container',
        'section.elementor-element-1351002 > .elementor-container',
        'section.elementor-element-06386f9 > .elementor-container',
        'section.elementor-element-b0959dd > .elementor-container',
        'section.elementor-element-e0e7ee2 > .elementor-container',
        'section.elementor-element-463e9ae > .elementor-container'
      ]
    },
    {
      name: 'cards-news',
      instances: [
        'section.elementor-element-0a91720 .jet-posts'
      ]
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Logo',
      selector: 'section.elementor-element-c18d8a1',
      style: null,
      blocks: [],
      defaultContent: [
        '.elementor-element-c18d8a1 .elementor-image img'
      ]
    },
    {
      id: 'section-2',
      name: 'Hero Video',
      selector: 'section.elementor-element-29fca9b',
      style: 'dark',
      blocks: [
        'hero-video'
      ],
      defaultContent: []
    },
    {
      id: 'section-3',
      name: 'Soluções',
      selector: 'section.elementor-element-022a7e5',
      style: 'purple-gradient',
      blocks: [
        'columns-showcase'
      ],
      defaultContent: []
    },
    {
      id: 'section-4',
      name: 'Poupatempo',
      selector: 'section.elementor-element-1351002',
      style: null,
      blocks: [
        'columns-showcase'
      ],
      defaultContent: []
    },
    {
      id: 'section-5',
      name: 'Diário Oficial',
      selector: 'section.elementor-element-06386f9',
      style: null,
      blocks: [
        'columns-showcase'
      ],
      defaultContent: []
    },
    {
      id: 'section-6',
      name: 'Certificado Digital',
      selector: 'section.elementor-element-b0959dd',
      style: 'purple-gradient',
      blocks: [
        'columns-showcase'
      ],
      defaultContent: []
    },
    {
      id: 'section-7',
      name: 'Notícias Header',
      selector: 'section.elementor-element-e9e6d13',
      style: null,
      blocks: [],
      defaultContent: [
        '.elementor-element-06a1cba h2',
        '.elementor-element-8f16c26 a'
      ]
    },
    {
      id: 'section-8',
      name: 'Podcast Media',
      selector: 'section.elementor-element-e0e7ee2',
      style: null,
      blocks: [
        'columns-showcase'
      ],
      defaultContent: []
    },
    {
      id: 'section-9',
      name: 'News Grid',
      selector: 'section.elementor-element-0a91720',
      style: null,
      blocks: [
        'cards-news'
      ],
      defaultContent: []
    },
    {
      id: 'section-10',
      name: 'Certifications',
      selector: 'section.elementor-element-463e9ae',
      style: null,
      blocks: [
        'columns-showcase'
      ],
      defaultContent: []
    }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  prodespCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [prodespSectionsTransformer] : []),
];

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
          section: blockDef.section || null,
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
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
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
