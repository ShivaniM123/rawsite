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

  // tools/importer/import-acordos-page.js
  var import_acordos_page_exports = {};
  __export(import_acordos_page_exports, {
    default: () => import_acordos_page_default
  });

  // tools/importer/parsers/columns.js
  function parse(element, { document }) {
    const cols = element.querySelectorAll(":scope .elementor-inner-column");
    const row = [];
    cols.forEach((col) => {
      const cellContent = [];
      col.querySelectorAll(".elementor-widget-text-editor .elementor-widget-container > *").forEach((el) => {
        cellContent.push(el);
      });
      col.querySelectorAll(".elementor-widget-image img").forEach((img) => {
        cellContent.push(img);
      });
      row.push(cellContent);
    });
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse2(element, { document }) {
    const cells = [];
    const imageBoxes = element.querySelectorAll(".elementor-widget-image-box");
    imageBoxes.forEach((box) => {
      const img = box.querySelector(".elementor-image-box-img img");
      const title = box.querySelector(".elementor-image-box-title");
      if (title) {
        title.querySelectorAll("br").forEach((br) => br.remove());
      }
      cells.push([img || "", title || ""]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-logos.js
  function parse3(element, { document }) {
    const cells = [];
    const imageWidgets = element.querySelectorAll(".elementor-widget-image");
    imageWidgets.forEach((widget) => {
      const link = widget.querySelector("a");
      const img = widget.querySelector("img");
      if (img) {
        cells.push([link || img]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-logos",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/prodesp-solucoes-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [".pum-overlay", ".pum"]);
      WebImporter.DOMUtils.remove(element, [".govsp-topo"]);
      WebImporter.DOMUtils.remove(element, [".govsp-kebab"]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, ["header#masthead"]);
      WebImporter.DOMUtils.remove(element, ["footer#colophon"]);
      WebImporter.DOMUtils.remove(element, ["#govsp-rodape"]);
      WebImporter.DOMUtils.remove(element, ["iframe", "link", "noscript"]);
      WebImporter.DOMUtils.remove(element, ["source"]);
    }
  }

  // tools/importer/transformers/prodesp-solucoes-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    var _a;
    if (hookName === H2.after) {
      const sections = (_a = payload == null ? void 0 : payload.template) == null ? void 0 : _a.sections;
      if (!sections || sections.length < 2) return;
      const doc = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = doc.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-acordos-page.js
  var parsers = {
    "columns": parse,
    "cards": parse2,
    "cards-logos": parse3
  };
  var PAGE_TEMPLATE = {
    name: "acordos-page",
    urls: [
      "https://solucoes.prodesp.sp.gov.br/acordos/"
    ],
    description: "Agreements/partnerships landing page on the Prodesp solutions portal",
    blocks: [
      {
        name: "columns",
        instances: ["section.elementor-element-6552a544"]
      },
      {
        name: "cards",
        instances: ["section.elementor-element-11d2837b"]
      },
      {
        name: "cards-logos",
        instances: ["section.elementor-element-54da4523"]
      }
    ],
    sections: [
      {
        id: "section-hero",
        name: "Hero / Intro",
        selector: "section.elementor-element-1aebf83",
        style: null,
        blocks: ["columns"],
        defaultContent: [".elementor-element-3cafce9f h2"]
      },
      {
        id: "section-benefits",
        name: "Benefits / Value Props",
        selector: "section.elementor-element-6785598a",
        style: "dark",
        blocks: ["cards"],
        defaultContent: []
      },
      {
        id: "section-companies",
        name: "Companies Section",
        selector: ["section.elementor-element-2a2a10e", "section.elementor-element-54da4523"],
        style: null,
        blocks: ["cards-logos"],
        defaultContent: [".elementor-element-132d1563 h2"]
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
  var import_acordos_page_default = {
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
  return __toCommonJS(import_acordos_page_exports);
})();
