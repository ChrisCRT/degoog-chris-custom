const _decodeEntities = (text) =>
  String(text || "")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, n) => {
      const code = Number(n);
      return code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff)
        ? String.fromCodePoint(code)
        : _;
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => {
      const code = parseInt(n, 16);
      return code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff)
        ? String.fromCodePoint(code)
        : _;
    });

const _htmlToText = (html) =>
  _decodeEntities(
    String(html || "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(
        /<(script|style|noscript|svg|math|figure)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,
        " ",
      )
      .replace(
        /<sup\b[^>]*class=["'][^"']*\breference\b[^"']*["'][^>]*>[\s\S]*?<\/sup\s*>/gi,
        " ",
      )
      .replace(/<br\b[^>]*\/?>/gi, ", ")
      .replace(
        /<\/?(?:p|div|li|ul|ol|table|tr|td|th|h[1-6]|dd|dt|section|article)\b[^>]*>/gi,
        " ",
      )
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?%)\]])/g, "$1")
    .replace(/([( \[])\s+/g, "$1")
    .trim();

const _getAttribute = (tag, name) => {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = tag.match(
    new RegExp(`\\b${escaped}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"),
  );

  return match ? _decodeEntities(match[1] ?? match[2] ?? match[3] ?? "") : "";
};

const _getClass = (tag) =>
  _getAttribute(tag, "class").toLowerCase().split(/\s+/);

const _isInfobox = (tag) => _getClass(tag).includes("infobox");

const _extractLink = (html, pageUrl) => {
  const links = html.match(/<a\b[^>]*>[\s\S]*?<\/a\s*>/gi) || [];
  for (const link of links) {
    const openingTag = link.match(/<a\b[^>]*>/i)?.[0] || "";
    const href = _getAttribute(openingTag, "href");
    if (!href) continue;

    try {
      const url = new URL(href, pageUrl);
      if (!/^https?:$/.test(url.protocol) || url.username || url.password) {
        continue;
      }

      return { text: _htmlToText(link), url: url.href };
    } catch {}
  }

  return null;
};

const _findInfobox = (html) => {
  const openingTags = /<table\b[^>]*>/gi;
  let match;
  while ((match = openingTags.exec(html))) {
    if (!_isInfobox(match[0])) continue;
    const start = match.index;
    let depth = 1;
    const tokens = /<\/?table\b[^>]*>/gi;
    tokens.lastIndex = openingTags.lastIndex;

    let token;
    while ((token = tokens.exec(html))) {
      if (/^<table\b/i.test(token[0])) {
        depth++;
      } else {
        depth--;
      }

      if (depth === 0) {
        return html.slice(start, tokens.lastIndex);
      }
    }

    break;
  }

  return "";
};

const _extractInfobox = (html, pageUrl) => {
  const table = _findInfobox(html);
  if (!table) return { imageUrl: "", facts: [] };

  let imageUrl = "";
  const imageCell = table.match(
    /<td\b[^>]*class=["'][^"']*\binfobox-image\b[^"']*["'][^>]*>([\s\S]*?)<\/td\s*>/i,
  )?.[1];
  if (imageCell) {
    const img = imageCell.match(/<img\b[^>]*>/i)?.[0];
    if (img) {
      imageUrl =
        _getAttribute(img, "src") ||
        _getAttribute(img, "data-src") ||
        _getAttribute(img, "data-original") ||
        _getAttribute(img, "data-lazy-src");
    }
  }

  const facts = [];
  const rows = table.match(/<tr\b[^>]*>[\s\S]*?<\/tr\s*>/gi) || [];
  for (const row of rows) {
    const openingTags = row.match(/<t[dh]\b[^>]*>/gi) || [];
    if (
      openingTags.some((tag) =>
        _getClass(tag).some((name) =>
          ["infobox-image", "infobox-above", "infobox-subheader"].includes(
            name,
          ),
        ),
      )
    ) {
      continue;
    }

    const header = row.match(/<th\b[^>]*>([\s\S]*?)<\/th\s*>/i)?.[1];
    const cell = row.match(/<td\b[^>]*>([\s\S]*?)<\/td\s*>/i)?.[1];
    if (!header || !cell) continue;

    const label = _htmlToText(header);
    const value = _htmlToText(cell);
    if (
      !label ||
      !value ||
      label.length > 100 ||
      value.length > 350 ||
      /^(coordinates|map|logo|image)$/i.test(label)
    ) {
      continue;
    }
    if (
      facts.some((fact) => fact.label.toLowerCase() === label.toLowerCase())
    ) {
      continue;
    }

    const isWebsite = /^(official )?website$/i.test(label);
    const link = isWebsite ? _extractLink(cell, pageUrl) : null;
    facts.push({
      label,
      value: link?.text || value,
      ...(link?.url ? { url: link.url } : {}),
    });
    if (facts.length >= 12) break;
  }

  return { imageUrl, facts };
};

const _limitWords = (text, limit = 100) =>
  text.split(/\s+/).filter(Boolean).slice(0, limit).join(" ");

const _extractLead = (html) => {
  const content =
    html.match(
      /<div\b[^>]*id=["']mw-content-text["'][^>]*>([\s\S]*?)(?=<div\b[^>]*class=["'][^"']*\bprintfooter\b|$)/i,
    )?.[1] || html;
  const parserOutput =
    content.match(
      /<div\b[^>]*class=["'][^"']*\bmw-parser-output\b[^"']*["'][^>]*>([\s\S]*)/i,
    )?.[1] || content;
  const paragraphs = parserOutput.match(/<p\b[^>]*>[\s\S]*?<\/p\s*>/gi) || [];

  for (const paragraph of paragraphs) {
    const openingTag = paragraph.match(/<p\b[^>]*>/i)?.[0] || "";
    const classes = _getClass(openingTag);
    if (
      classes.some((name) => ["mw-empty-elt", "mw-no-invert"].includes(name))
    ) {
      continue;
    }

    const text = _htmlToText(paragraph);
    if (
      text.length >= 40 &&
      !/^(coordinates|this article|this page|for other uses)\b/i.test(text)
    ) {
      return _limitWords(text, 100);
    }
  }

  return "";
};

export const extractArticle = (html, pageUrl, baseUrl, title = "") => {
  const infobox = _extractInfobox(html, pageUrl);
  let imageUrl = "";
  if (infobox.imageUrl) {
    try {
      const image = new URL(infobox.imageUrl, pageUrl);
      const base = new URL(baseUrl);

      if (
        image.origin === base.origin &&
        image.pathname.includes("/_assets_/") &&
        /^https?:$/.test(image.protocol) &&
        !image.username &&
        !image.password
      ) {
        imageUrl = image.href;
      }
    } catch {}
  }

  const lead = _extractLead(html);

  return {
    extract: lead,
    imageUrl,
    facts: infobox.facts,
  };
};

export const buildThumbnail = (imageUrl, thumbRoute, escapeHtml) => {
  if (!imageUrl || !thumbRoute) return "";
  const src = `${thumbRoute}?url=${encodeURIComponent(imageUrl)}`;

  return `<img class="wiki-thumb"
    src="${escapeHtml(src)}"
    alt=""
    loading="lazy">`;
};
