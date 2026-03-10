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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-video.js
  function parse(element, { document }) {
    const overlayImg = element.querySelector(".jet-video__overlay img, .jet-video img");
    const video = element.querySelector("video.jet-video-player, video");
    const cells = [];
    if (overlayImg) {
      cells.push([overlayImg]);
    } else if (video) {
      const videoLink = document.createElement("a");
      videoLink.href = video.src || video.getAttribute("src") || "";
      videoLink.textContent = "Video";
      cells.push([videoLink]);
    }
    const contentCell = [];
    const heading = element.querySelector('h1, h2, h3, [class*="title"]');
    if (heading) {
      contentCell.push(heading);
    }
    if (video && video.src) {
      const link = document.createElement("a");
      link.href = video.src;
      link.textContent = "Assistir v\xEDdeo";
      contentCell.push(link);
    }
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-showcase.js
  function parse2(element, { document }) {
    const row = element.querySelector(".elementor-row") || element;
    const columns = row.querySelectorAll(':scope > .elementor-column, :scope > [class*="elementor-col-"]');
    if (!columns || columns.length === 0) {
      const block2 = WebImporter.Blocks.createBlock(document, { name: "columns-showcase", cells: [[element.innerHTML]] });
      element.replaceWith(block2);
      return;
    }
    const cellRow = [];
    columns.forEach((col) => {
      const cellContent = [];
      const images = col.querySelectorAll(".elementor-motion-effects-layer img, .elementor-image img, .elementor-widget-image img");
      images.forEach((img) => cellContent.push(img));
      const headings = col.querySelectorAll(".elementor-heading-title, h2, h3");
      headings.forEach((h) => cellContent.push(h));
      const paragraphs = col.querySelectorAll(".elementor-text-editor p, .elementor-clearfix p");
      paragraphs.forEach((p) => {
        if (p.textContent.trim()) cellContent.push(p);
      });
      const links = col.querySelectorAll(".elementor-icon-box-title a, .elementor-icon-box-content a");
      links.forEach((link) => cellContent.push(link));
      const videos = col.querySelectorAll("video");
      videos.forEach((v) => {
        if (v.src) {
          const videoLink = document.createElement("a");
          videoLink.href = v.src;
          videoLink.textContent = v.src;
          cellContent.push(videoLink);
        }
      });
      if (cellContent.length > 0) {
        cellRow.push(cellContent);
      } else {
        cellRow.push("");
      }
    });
    const cells = [cellRow];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-showcase", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-news.js
  function parse3(element, { document }) {
    const items = element.querySelectorAll(".jet-posts__item");
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector(".jet-posts__inner-box > img, .jet-posts__thumb img, img");
      const titleEl = item.querySelector("h4.entry-title a, .entry-title a, h4 a, h3 a");
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
        ".jet-sticky-section"
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

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-video": parse,
    "columns-showcase": parse2,
    "cards-news": parse3
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Prodesp homepage - main landing page with hero, services, news, and institutional content",
    urls: [
      "https://www.prodesp.sp.gov.br/"
    ],
    blocks: [
      {
        name: "hero-video",
        instances: [
          "section.elementor-element-29fca9b .jet-video"
        ]
      },
      {
        name: "columns-showcase",
        instances: [
          "section.elementor-element-022a7e5 > .elementor-container",
          "section.elementor-element-1351002 > .elementor-container",
          "section.elementor-element-06386f9 > .elementor-container",
          "section.elementor-element-b0959dd > .elementor-container",
          "section.elementor-element-e0e7ee2 > .elementor-container",
          "section.elementor-element-463e9ae > .elementor-container"
        ]
      },
      {
        name: "cards-news",
        instances: [
          "section.elementor-element-0a91720 .jet-posts"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Logo",
        selector: "section.elementor-element-c18d8a1",
        style: null,
        blocks: [],
        defaultContent: [
          ".elementor-element-c18d8a1 .elementor-image img"
        ]
      },
      {
        id: "section-2",
        name: "Hero Video",
        selector: "section.elementor-element-29fca9b",
        style: "dark",
        blocks: [
          "hero-video"
        ],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Solu\xE7\xF5es",
        selector: "section.elementor-element-022a7e5",
        style: "purple-gradient",
        blocks: [
          "columns-showcase"
        ],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Poupatempo",
        selector: "section.elementor-element-1351002",
        style: null,
        blocks: [
          "columns-showcase"
        ],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Di\xE1rio Oficial",
        selector: "section.elementor-element-06386f9",
        style: null,
        blocks: [
          "columns-showcase"
        ],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Certificado Digital",
        selector: "section.elementor-element-b0959dd",
        style: "purple-gradient",
        blocks: [
          "columns-showcase"
        ],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Not\xEDcias Header",
        selector: "section.elementor-element-e9e6d13",
        style: null,
        blocks: [],
        defaultContent: [
          ".elementor-element-06a1cba h2",
          ".elementor-element-8f16c26 a"
        ]
      },
      {
        id: "section-8",
        name: "Podcast Media",
        selector: "section.elementor-element-e0e7ee2",
        style: null,
        blocks: [
          "columns-showcase"
        ],
        defaultContent: []
      },
      {
        id: "section-9",
        name: "News Grid",
        selector: "section.elementor-element-0a91720",
        style: null,
        blocks: [
          "cards-news"
        ],
        defaultContent: []
      },
      {
        id: "section-10",
        name: "Certifications",
        selector: "section.elementor-element-463e9ae",
        style: null,
        blocks: [
          "columns-showcase"
        ],
        defaultContent: []
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
  var import_homepage_default = {
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
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
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
  return __toCommonJS(import_homepage_exports);
})();
