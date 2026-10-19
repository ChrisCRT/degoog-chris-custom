import { buildUrl } from "./request.js";
import { parseResults } from "./parse.js";
import { extractArticle, buildThumbnail } from "./extract.js";

let template = "";
let doFetch = fetch;
let proxyFetch = fetch;
let bypassProxy = false;
let THUMB_ROUTE = "";
let instanceUrl = "";
let bookName = "";
let searchCache = null;

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

export const slot = {
  isClientExposed: false,
  id: "kiwix-slot",
  name: "Kiwix",
  position: "knowledge-panel",
  waitForResults: false,
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
    {
      key: "bypassProxy",
      label: "Bypass proxy",
      type: "toggle",
      default: "false",
      description:
        "When enabled, requests go directly to Kiwix instead of using Degoog's outgoing proxy.",
    },
  ],

  init(ctx) {
    template = ctx.template;
    proxyFetch = ctx.fetch ?? fetch;
    doFetch = proxyFetch;
    THUMB_ROUTE = ctx.routeUrl("thumb");
    searchCache = ctx.useCache("search", 600_000);
  },

  configure(settings) {
    instanceUrl = (settings.instanceUrl || DEFAULT_INSTANCE).replace(
      /\/+$/,
      "",
    );
    bookName = (settings.bookName || "").trim();
    bypassProxy = settings.bypassProxy !== "false";
    doFetch = bypassProxy ? fetch : proxyFetch;
  },

  trigger() {
    return true;
  },

  async execute(query, context = {}) {
    const q = typeof query === "string" ? query.trim() : "";
    if (!q) return { title: "", html: "" };

    const baseUrl = instanceUrl || DEFAULT_INSTANCE;

    const searchKey = JSON.stringify([baseUrl, bookName, _normalise(q)]);
    const cached = await searchCache.get(searchKey);
    if (cached !== undefined && cached !== null) {
      return { title: "", html: cached };
    }

    const response = await doFetch(buildUrl(baseUrl, bookName, q), {
      headers: { Accept: "application/xml, text/xml" },
    });
    context?.sentinel?.(response, this.name);
    if (!response.ok) return { title: "", html: "" };

    const xml = await response.text();
    const [best] = parseResults(xml, baseUrl, this.name)
      .map((result) => ({
        result,
        score: _relevance(q, result.title, result.snippet),
      }))
      .sort((a, b) => b.score - a.score);

    if (!best || best.score < MIN_RELEVANCE) {
      await searchCache.set(searchKey, "");
      return { title: "", html: "" };
    }

    let article = {
      extract: "",
      imageUrl: "",
      facts: [],
    };

    try {
      const pageResponse = await doFetch(best.result.url);
      context?.sentinel?.(pageResponse, this.name);

      if (pageResponse.ok) {
        const html = await pageResponse.text();
        article = extractArticle(html, best.result.url, baseUrl);
      }
    } catch (error) {
      context?.logger?.warn?.("Kiwix article extraction failed", error);
    }

    const thumbnail = buildThumbnail(article.imageUrl, THUMB_ROUTE, _esc);
    const extract = article.extract || "";
    const facts = article.facts
      .map(({ label, value, url }) => {
        const renderedValue = url
          ? `<a href="${_esc(url)}" target="_blank" rel="noopener noreferrer">${_esc(value)}</a>`
          : _esc(value);

        return `<div class="wiki-fact">
        <span class="wiki-fact-label">${_esc(label)}</span>
        <span class="wiki-fact-value">${renderedValue}</span>
        </div>`;
      })
      .join("");

    const content = _render({
      thumbnail,
      url: _esc(best.result.url),
      title: _esc(best.result.title),
      extract: _esc(extract),
      facts,
    });

    await searchCache.set(searchKey, content);

    return { title: "", html: content };
  },
};

export const routes = [
  {
    method: "get",
    path: "/thumb",
    handler: async (req) => {
      try {
        const requestUrl = new URL(req.url);
        const rawUrl = requestUrl.searchParams.get("url");
        if (!rawUrl || !instanceUrl) {
          return new Response("Missing image URL", { status: 400 });
        }

        let imageUrl;
        try {
          imageUrl = new URL(rawUrl);
        } catch {
          return new Response("Invalid image URL", { status: 400 });
        }

        const baseUrl = new URL(instanceUrl);
        if (
          imageUrl.origin !== baseUrl.origin ||
          !imageUrl.pathname.includes("/_assets_/") ||
          !/^https?:$/.test(imageUrl.protocol) ||
          imageUrl.username ||
          imageUrl.password
        ) {
          return new Response("Invalid thumbnail URL", { status: 400 });
        }

        const response = await doFetch(imageUrl.href, {
          headers: { Accept: "image/*" },
          redirect: "error",
        });
        if (!response.ok) {
          return new Response("Kiwix image request failed", {
            status: response.status,
          });
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.toLowerCase().startsWith("image/")) {
          return new Response("Kiwix did not return an image", {
            status: 502,
          });
        }

        return new Response(response.body, {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "private, max-age=3600",
            "X-Content-Type-Options": "nosniff",
          },
        });
      } catch {
        return new Response("Unable to load Kiwix thumbnail", {
          status: 502,
        });
      }
    },
  },
];

export default { slot, routes };
