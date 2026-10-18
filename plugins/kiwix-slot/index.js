import { buildUrl } from "./request.js";
import { parseResults } from "./parse.js";

let template = "";
let doFetch = fetch;

const DEFAULT_INSTANCE = "http://localhost:8080";
const MIN_RELEVANCE = 0.6;

const _esc = (s) => {
  if (typeof s !== "string") return "";
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const _render = (data) => {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] ?? "");
};

const _normalise = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const _relevance = (query, title, snippet) => {
  const q = _normalise(query);
  const t = _normalise(title);
  const s = _normalise(snippet);
  if (!q || !t) return 0;
  if (q === t) return 1;
  if (t.includes(q)) return 0.95;

  const terms = q.split(" ").filter((term) => term.length > 1);
  if (!terms.length) return 0;

  const titleMatch = terms.filter((term) => t.includes(term)).length;
  const snippetMatch = terms.filter((term) => s.includes(term)).length;

  return (
    (titleMatch / terms.length) * 0.75 + (snippetMatch / terms.length) * 0.25
  );
};

const _buildThumbnail = (html, pageUrl) => {
  const infobox = html.match(
    /<td\b[^>]*class=["'][^"']*\binfobox-image\b[^"']*["'][^>]*>([\s\S]*?)<\/td>/i,
  );
  if (!infobox) return "";

  const image = infobox[1].match(
    /<img\b(?=[^>]*\bclass=["'][^"']*\bmw-file-element\b[^"']*["'])[^>]*>/i,
  );
  if (!image) return "";

  const src = image[0].match(/\bsrc=["']([^"']+)["']/i)?.[1];
  if (!src) return "";

  try {
    const url = new URL(src, pageUrl).href;
    return `<img class="wiki-thumb" src="${_esc(url)}" alt="" loading="lazy">`;
  } catch {
    return "";
  }
};

export const slot = {
  isClientExposed: false,
  id: "kiwix-slot",
  name: "Kiwix",
  position: "knowledge-panel",
  waitForResults: true,
  description: "Shows a relevant article from your Kiwix library",

  settingsSchema: [
    {
      key: "instanceUrl",
      label: "Instance URL",
      type: "url",
      placeholder: DEFAULT_INSTANCE,
      description: "Base URL of your kiwix-serve instance",
      default: DEFAULT_INSTANCE,
    },
    {
      key: "bookName",
      label: "Book Name",
      type: "text",
      placeholder: "wikipedia_en_all_maxi_2026-08",
      description:
        "Optional ZIM book name to search. Leave blank to search all books",
      default: "",
    },
  ],

  init(ctx) {
    template = ctx.template;
    doFetch = ctx.fetch ?? fetch;
  },

  configure(settings) {
    this.instanceUrl = (settings.instanceUrl || DEFAULT_INSTANCE).replace(
      /\/+$/,
      "",
    );
    this.bookName = (settings.bookName || "").trim();
  },

  trigger() {
    return true;
  },

  async execute(query, context = {}) {
    const q = typeof query === "string" ? query.trim() : "";
    if (!q) return { title: "", html: "" };

    const baseUrl = this.instanceUrl || DEFAULT_INSTANCE;
    const response = await doFetch(buildUrl(baseUrl, this.bookName, q), {
      headers: { Accept: "application/xml, text/xml" },
    });
    context?.sentinel?.(response, this.name);
    if (!response.ok) return { title: "", html: "" };

    const xml = await response.text();
    const [best] = parseResults(xml, baseUrl, this.name);
    if (!best || _relevance(q, best.title, best.snippet) < MIN_RELEVANCE) {
      return { title: "", html: "" };
    }

    let thumbnail = "";
    const pageResponse = await doFetch(best.url);
    if (pageResponse.ok) {
      const html = await pageResponse.text();
      thumbnail = _buildThumbnail(html, best.url);
    }

    const content = _render({
      thumbnail,
      url: _esc(best.url),
      title: _esc(best.title),
      description: _esc(best.snippet.slice(0, 200)),
      extract: _esc(best.snippet),
    });

    return { title: "", html: content };
  },
};

export default { slot };
