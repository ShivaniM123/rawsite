var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-news-article.js
  var import_news_article_exports = {};
  __export(import_news_article_exports, {
    default: () => import_news_article_default
  });

  // tools/importer/parsers/cards-news.js
  function parse(element, { document }) {
    const items = element.querySelectorAll(".jet-posts__item, .rpwe-li");
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector(".jet-posts__inner-box > img, .jet-posts__thumb img, .rpwe-thumb, img");
      const titleEl = item.querySelector("h4.entry-title a, .entry-title a, .rpwe-title a, h4 a, h3 a");
      const textContent = [];
      if (titleEl) {
        const heading = document.createElement("h4");
        const link = document.createElement("a");
        link.href = titleEl.href || titleEl.getAttribute("href") || "";
        link.textContent = titleEl.textContent.trim();
        heading.append(link);
        textContent.push(heading);
      }
      const desc = item.querySelector(".jet-posts__inner-content p, .jet-posts__excerpt");
      if (desc && desc.textContent.trim()) {
        textContent.push(desc);
      }
      const imageCell = img ? [img] : [""];
      const textCell = textContent.length > 0 ? textContent : [""];
      cells.push([imageCell, textCell]);
    });
    if (cells.length === 0) {
      cells.push([[""], [""]]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/prodesp-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#topo-eleicoes",
        "#topo-oficial",
        ".dpNoneMobile",
        ".jet-sticky-section",
        // Skip-to-content link
        "a.skip-link",
        // Cookie consent banner
        "#cookie-notice"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header#masthead",
        "footer#colophon",
        "#menu-rodape-oficial",
        "#rodape-menu-eleicoes",
        ".page-header",
        ".elementor-widget-spacer",
        // News article: post metadata, author bio, post navigation
        ".entry-meta",
        ".entry-footer",
        ".post-author-bio",
        "nav.post-navigation",
        "iframe",
        "link",
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/prodesp-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const template = payload && payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = [...template.sections].reverse();
      sections.forEach((section) => {
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) return;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (section.id !== template.sections[0].id) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-news-article.js
  var parsers = {
    "cards-news": parse
  };
  var PAGE_TEMPLATE = {
    name: "news-article",
    description: "News article page with article content (title, date, featured image, body) and latest news sidebar",
    urls: [
      "https://www.prodesp.sp.gov.br/edital-de-ate-r-15-milhoes-leva-startups-a-desenvolver-solucoes-para-desafios-reais-do-governo-de-sao-paulo"
    ],
    blocks: [
      {
        name: "cards-news",
        instances: ["aside#secondary .rpwe-ul"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Article Content",
        selector: "article#post-21678",
        style: null,
        blocks: [],
        defaultContent: [
          "h1.entry-title",
          ".entry-header > p",
          "figure.post-thumbnail img",
          ".entry-content > p"
        ]
      },
      {
        id: "section-2",
        name: "Latest News Sidebar",
        selector: "aside#secondary .rpwe_widget",
        style: null,
        blocks: ["cards-news"],
        defaultContent: ["h4.widget-title"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_news_article_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_news_article_exports);
})();
