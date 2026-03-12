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

  // tools/importer/import-content-page.js
  var import_content_page_exports = {};
  __export(import_content_page_exports, {
    default: () => import_content_page_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const bgImage = element.querySelector(".elementor-element-71eff86 img, .bg-internoImage img, img");
    const heading = element.querySelector('h1, h2, h3, [class*="title"]');
    const description = element.querySelector('p, [class*="subtitle"], [class*="description"]');
    const ctaLinks = Array.from(element.querySelectorAll("a.cta, a.button, a.elementor-button"));
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    contentCell.push(...ctaLinks);
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/prodesp-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#cookie-notice",
        "#topo-eleicoes"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header#masthead",
        "footer#colophon",
        "a.skip-link",
        "#topo-oficial",
        ".elementor-widget-jet-breadcrumbs",
        "noscript",
        "link",
        "iframe"
      ]);
    }
  }

  // tools/importer/transformers/prodesp-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    var _a;
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const sections = (_a = payload.template) == null ? void 0 : _a.sections;
      if (!sections || sections.length < 2) return;
      const activeSections = sections.filter(
        (s) => s.blocks && s.blocks.length > 0 || s.defaultContent && s.defaultContent.length > 0 || s.style
      );
      for (let i = activeSections.length - 1; i >= 0; i -= 1) {
        const section = activeSections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0 && sectionEl.previousElementSibling) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-content-page.js
  var parsers = {
    "hero": parse
  };
  var PAGE_TEMPLATE = {
    name: "content-page",
    description: "Standard content page with hero banner, breadcrumb, and single-column content area for text, documents, and CTAs",
    urls: [
      "https://www.prodesp.sp.gov.br/transparencia/dados-abertos",
      "https://www.prodesp.sp.gov.br/institucional/missao-visao-e-valores",
      "https://www.prodesp.sp.gov.br/transparencia/carta-de-servicos-ao-usuario",
      "https://www.prodesp.sp.gov.br/transparencia/demonstracoes-financeiras"
    ],
    blocks: [
      {
        name: "hero",
        instances: ["section.elementor-element-6e2d2fe"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Banner",
        selector: "section.elementor-element-6e2d2fe",
        style: "dark-purple",
        blocks: ["hero"],
        defaultContent: ["h1.page-title"]
      },
      {
        id: "section-2",
        name: "Breadcrumb",
        selector: "section.elementor-element-5ffff5d",
        style: null,
        blocks: [],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Main Content",
        selector: "section.elementor-element-8dea8a1",
        style: null,
        blocks: [],
        defaultContent: [".elementor-element-61409e0 .elementor-text-editor"]
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
            element
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_content_page_default = {
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
  return __toCommonJS(import_content_page_exports);
})();
