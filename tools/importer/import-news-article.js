/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsNewsParser from './parsers/cards-news.js';

// TRANSFORMER IMPORTS
import prodespCleanupTransformer from './transformers/prodesp-cleanup.js';
import prodespSectionsTransformer from './transformers/prodesp-sections.js';

// PARSER REGISTRY
const parsers = {
  'cards-news': cardsNewsParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'news-article',
  description: 'News article page with article content (title, date, featured image, body) and latest news sidebar',
  urls: [
    'https://www.prodesp.sp.gov.br/edital-de-ate-r-15-milhoes-leva-startups-a-desenvolver-solucoes-para-desafios-reais-do-governo-de-sao-paulo',
  ],
  blocks: [
    {
      name: 'cards-news',
      instances: ['aside#secondary .rpwe-ul'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Article Content',
      selector: 'article#post-21678',
      style: null,
      blocks: [],
      defaultContent: [
        'h1.entry-title',
        '.entry-header > p',
        'figure.post-thumbnail img',
        '.entry-content > p',
      ],
    },
    {
      id: 'section-2',
      name: 'Latest News Sidebar',
      selector: 'aside#secondary .rpwe_widget',
      style: null,
      blocks: ['cards-news'],
      defaultContent: ['h4.widget-title'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  prodespCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1
    ? [prodespSectionsTransformer]
    : []),
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
          section: blockDef.section || null,
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

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
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
