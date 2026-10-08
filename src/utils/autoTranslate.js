// Translates any English text that is rendered in the DOM (text nodes and common
// attributes) using a lookup function, so headings/labels that were never wired to
// t() still follow the selected language. The original text is remembered so that
// switching back to English restores it exactly.
const ATTRS = ["placeholder", "title", "aria-label", "alt"];
const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "TEXTAREA", "CODE", "PRE", "NOSCRIPT"]);

const normalize = (s) => s.replace(/\s+/g, " ").trim();

const shouldSkip = (el) =>
  !el || SKIP_TAGS.has(el.tagName) || !!el.closest?.('[translate="no"], .notranslate');

export const startAutoTranslate = (lookup) => {
  const textRecords = new WeakMap(); // text node -> { orig, translated }
  const attrRecords = new WeakMap(); // element -> { attr: { orig, translated } }

  const translate = (raw) => {
    const trimmed = normalize(raw);
    if (!trimmed) return null;
    const result = lookup(trimmed);
    if (!result || result === trimmed) return null;
    const lead = raw.match(/^\s*/)[0];
    const trail = raw.match(/\s*$/)[0];
    return lead + result + trail;
  };

  const doText = (node) => {
    if (shouldSkip(node.parentElement)) return;
    const current = node.nodeValue;
    const rec = textRecords.get(node);
    if (rec && current === rec.translated) return;
    const translated = translate(current);
    if (translated) {
      textRecords.set(node, { orig: current, translated });
      node.nodeValue = translated;
    } else if (rec) {
      textRecords.delete(node);
    }
  };

  const doAttrs = (el) => {
    if (shouldSkip(el)) return;
    let recs = attrRecords.get(el);
    for (const attr of ATTRS) {
      const current = el.getAttribute?.(attr);
      if (!current) continue;
      const rec = recs?.[attr];
      if (rec && current === rec.translated) continue;
      const translated = translate(current);
      if (translated) {
        if (!recs) {
          recs = {};
          attrRecords.set(el, recs);
        }
        recs[attr] = { orig: current, translated };
        el.setAttribute(attr, translated);
      } else if (rec) {
        delete recs[attr];
      }
    }
  };

  const walk = (root) => {
    if (root.nodeType === Node.TEXT_NODE) {
      doText(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    doAttrs(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let n = walker.nextNode();
    while (n) {
      if (n.nodeType === Node.TEXT_NODE) doText(n);
      else doAttrs(n);
      n = walker.nextNode();
    }
  };

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "childList") {
        m.addedNodes.forEach(walk);
      } else if (m.type === "characterData") {
        doText(m.target);
      } else if (m.type === "attributes") {
        doAttrs(m.target);
      }
    }
  });

  walk(document.body);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ATTRS,
  });

  // Stop translating and put the original English text back.
  return () => {
    observer.disconnect();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let n = walker.nextNode();
    while (n) {
      if (n.nodeType === Node.TEXT_NODE) {
        const rec = textRecords.get(n);
        if (rec && n.nodeValue === rec.translated) n.nodeValue = rec.orig;
      } else {
        const recs = attrRecords.get(n);
        if (recs) {
          for (const [attr, rec] of Object.entries(recs)) {
            if (n.getAttribute(attr) === rec.translated) n.setAttribute(attr, rec.orig);
          }
        }
      }
      n = walker.nextNode();
    }
  };
};
