let template = "";
let doFetch = null;

let plexUrl = "";
let apiKey = "";
let urlMode = "server";
let bypassImageProxy = false;
let machineId = "";
const PER_PAGE = 25;

const PLEX_LOGO =
  "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons@refs/heads/main/svg/plex.svg";

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

const _searchVariants = (term) => {
  const variants = [term];
  if (term.includes("-")) variants.push(term.replace(/-/g, " "));
  else if (/\w\s+\w/.test(term)) variants.push(term.replace(/\s+/g, "-"));
  if (term.includes(".")) variants.push(term.replace(/\./g, " "));
  if (term.includes("'")) variants.push(term.replace(/'/g, ""));
  return [...new Set(variants)];
};

const PATTERNS = {
  SEASON: [/^(.+?)\s+season\s+(\d+)$/i, /^(.+?)\s+s(\d+)$/i],
  EPISODE: [
    /^(.+?)\s+s(\d+)\s*e(\d+)$/i,
    /^(.+?)\s+season\s+(\d+)\s+episode\s+(\d+)$/i,
    /^(.+?)\s+season\s+(\d+)\s+ep\.?\s+(\d+)$/i,
    /^(.+?)\s+(\d+)x(\d+)$/i,
  ],
};

const _parseEpisodeQuery = (term) => {
  for (const re of PATTERNS.EPISODE) {
    const m = term.match(re);
    if (m) {
      return {
        series: m[1].trim(),
        season: parseInt(m[2], 10),
        episode: parseInt(m[3], 10),
      };
    }
  }
  for (const re of PATTERNS.SEASON) {
    const m = term.match(re);
    if (m) {
      return {
        series: m[1].trim(),
        season: parseInt(m[2], 10),
        episode: null,
      };
    }
  }

  return null;
};

const _fetchMachineId = async (headers, doFetch, context) => {
  const response = await doFetch(`${plexUrl}/identity`, { headers });
  context?.sentinel?.(response, "Plex");
  if (!response.ok) {
    throw new Error(`Plex identity request failed: ${response.status}`);
  }
  const data = await response.json();
  const id = data?.MediaContainer?.machineIdentifier;
  if (!id) {
    throw new Error("Plex identity response did not contain machineIdentifier");
  }
  machineId = id;
};

const _buildItemUrl = (item) => {
  const key = `/library/metadata/${item.ratingKey}`;
  const encodedKey = encodeURIComponent(key);
  if (!machineId) return plexUrl;

  switch (urlMode) {
    case "plexWeb":
      return `https://app.plex.tv/desktop/#!/server/${machineId}/details?key=${encodedKey}`;

    case "plexDesktop":
      return `plex://server/${machineId}/details?key=${encodedKey}`;

    case "server":
    default:
      return `${plexUrl}/web/index.html#!/server/${machineId}/details?key=${encodedKey}`;
  }
};

const _buildThumbnailUrl = (path, context) => {
  if (!path) return "";
  const url = new URL(path, `${plexUrl}/`);
  url.searchParams.set("X-Plex-Token", apiKey);

  if (bypassImageProxy) return url.toString();
  return context.signProxyUrl(url.toString());
};

const _formatDuration = (duration) => {
  const milliseconds = Number(duration);
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) return "";
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    ...(hours > 0 ? [String(hours).padStart(2, "0")] : []),
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0"),
  ].join(":");
};

const _buildEpisodeContext = (item) => {
  const type = String(item.type || "");
  const parts = [];
  if (type === "episode") {
    const series = item.grandparentTitle || "";
    if (series) parts.push(series);
    if (item.parentIndex != null && item.index != null) {
      parts.push(
        `S${String(item.parentIndex).padStart(2, "0")}E${String(item.index).padStart(2, "0")}`,
      );
    } else if (item.index != null) {
      parts.push(`Episode ${item.index}`);
    }
  } else if (type === "season") {
    const series = item.parentTitle || item.grandparentTitle || "";
    if (series) parts.push(series);
  }

  return parts.join(" - ");
};

const _renderItem = (item, context) => {
  const type = String(item.type || "");
  const title = String(item.title || "");
  const year = item.year ? ` (${item.year})` : "";
  const summary = String(item.summary || "");
  const isVideo = type === "movie" || type === "episode";
  const duration = isVideo ? _formatDuration(item.duration) : "";
  const thumbPath = item.thumb || item.art || "";
  const thumbSrc = thumbPath ? _buildThumbnailUrl(thumbPath, context) : "";
  const thumbnailBlock = thumbSrc
    ? `<a class="result-thumbnail-wrap ${isVideo ? "plex--thumb-video" : "plex--thumb"}" href="${_esc(_buildItemUrl(item))}">
         <img class="result-thumbnail-img" src="${_esc(thumbSrc)}" alt="" loading="lazy"
           onerror="this.parentElement.style.display='none'">
         ${duration ? `<span class="plex--video-duration">${_esc(duration)}</span>` : ""}
       </a>`
    : "";
  const episodeContext = _buildEpisodeContext(item);
  const subtitleBlock = episodeContext
    ? `<div class="result-episode-context">${_esc(episodeContext)}</div>`
    : "";
  const badgesBlock = [type, "Plex"]
    .map((badge) => `<span class="result-engine-tag">${_esc(badge)}</span>`)
    .join();

  const data = {
    favicon_url: PLEX_LOGO,
    cite_url: _esc(plexUrl),
    url: _esc(_buildItemUrl(item)),
    title: _esc(title) + _esc(year),
    overview: _esc(summary),
    badgesBlock,
    subtitleBlock,
    thumbnailBlock,
  };

  data.duration = _esc(duration);
  data.type = _esc(type);
  data.year = _esc(item.year || "");
  data.source = "Plex";

  return _render(data);
};

const _deduplicateItems = (groups) => {
  const seen = new Set();
  const results = [];
  for (const group of groups) {
    for (const item of group || []) {
      const key =
        item.ratingKey != null
          ? `ratingKey:${item.ratingKey}`
          : `${item.type || ""}:${item.key || ""}:${item.title || ""}`;
      if (seen.has(key)) continue;
      seen.add(key);
      results.push(item);
    }
  }

  return results;
};

const _findEpisode = async (episodeQuery, headers, doFetch, context) => {
  const seriesVariants = _searchVariants(episodeQuery.series);
  const seriesResults = await Promise.all(
    seriesVariants.map(async (variant) => {
      const response = await doFetch(
        `${plexUrl}/search?query=${encodeURIComponent(variant)}&type=2&limit=25`,
        { headers },
      );
      context?.sentinel?.(response, "Plex");
      if (!response.ok) return null;

      return response.json();
    }),
  );

  const shows = _deduplicateItems(
    seriesResults.map((data) => data?.MediaContainer?.Metadata || []),
  );
  if (!shows.length) return [];

  const episodeResults = await Promise.all(
    shows.map(async (show) => {
      const response = await doFetch(
        `${plexUrl}/library/metadata/${encodeURIComponent(show.ratingKey)}/allLeaves`,
        { headers },
      );

      context?.sentinel?.(response, "Plex");

      if (!response.ok) return null;
      return response.json();
    }),
  );

  const matchingItems = [];

  for (const data of episodeResults) {
    for (const item of data?.MediaContainer?.Metadata || []) {
      if (
        episodeQuery.season != null &&
        Number(item.parentIndex) !== episodeQuery.season
      ) {
        continue;
      }

      if (
        episodeQuery.episode != null &&
        Number(item.index) !== episodeQuery.episode
      ) {
        continue;
      }

      matchingItems.push(item);
    }
  }

  return _deduplicateItems([matchingItems]);
};

const _searchLibrary = async (term, headers, doFetch, context) => {
  const variants = _searchVariants(term);

  const responses = await Promise.all(
    variants.map(async (variant) => {
      const response = await doFetch(
        `${plexUrl}/hubs/search?query=${encodeURIComponent(variant)}&limit=25`,
        { headers },
      );
      context?.sentinel?.(response, "Plex");
      if (!response.ok) return null;

      return response.json();
    }),
  );

  const groups = [];

  for (const data of responses) {
    for (const hub of data?.MediaContainer?.Hub || []) {
      groups.push(hub.Metadata || []);
    }
  }

  return _deduplicateItems(groups);
};

const _renderMessage = (message) => {
  return `<div class="command-result"><p>${message}</p></div>`;
};

export const plugin = {
  id: "plugin-plex",
  name: "Plex",
  description: "Search your Plex media library",

  settingsSchema: [
    {
      key: "url",
      label: "Plex URL",
      type: "url",
      required: true,
      placeholder: "http://127.0.0.1:32400",
      description: "Base URL of your Plex Media Server",
    },
    {
      key: "apiKey",
      label: "API Token",
      type: "password",
      secret: true,
      required: true,
      placeholder: "Enter your Plex token",
      description:
        "Find your token: https://support.plex.tv/articles/204059436-finding-an-authentication-token-x-plex-token/",
    },
    {
      key: "urlMode",
      label: "Open results with",
      type: "select",
      options: ["server", "plexWeb", "plexDesktop"],
      default: "server",
      description:
        "Choose where results open: your server (URL above), Plex Web (plex.tv), or Plex Desktop (app)",
    },
    {
      key: "bypassImageProxy",
      label: "Bypass image proxy",
      type: "toggle",
      default: "false",
      description:
        "When enabled, images are loaded directly from plex instead of degoog's image proxy. This is helpful when using a proxy service that cant see plex, like a VPN.",
    },
  ],
};

const _init = (ctx) => {
  template = ctx?.template || "";
  doFetch = ctx.fetch ?? fetch;
};

const _configure = (settings) => {
  plexUrl = (settings.url || "").replace(/\/+$/, "");
  apiKey = settings.apiKey || "";
  urlMode = settings.urlMode || "server";
  bypassImageProxy = settings.bypassImageProxy !== "false";
  slot.isClientExposed = bypassImageProxy;
  command.isClientExposed = bypassImageProxy;
  machineId = "";
};

const _isConfigured = () => {
  if (!plexUrl || !apiKey) return false;
  return true;
};

const _execute = async (query, context = {}) => {
  const headers = {
    "X-Plex-Token": apiKey,
    Accept: "application/json",
  };
  if (!machineId) {
    await _fetchMachineId(headers, doFetch, context);
  }

  const episodeQuery = _parseEpisodeQuery(query);
  let items = [];
  if (episodeQuery) {
    items = await _findEpisode(episodeQuery, headers, doFetch, context);
  }
  if (!items.length) {
    items = await _searchLibrary(query, headers, doFetch, context);
  }

  return items;
};

export const slot = {
  isClientExposed: bypassImageProxy,
  name: "Plex",
  description: "Search your Plex media library",
  position: "knowledge-panel",

  settingsSchema: [],

  init: _init,
  configure: _configure,

  async trigger(query) {
    if (!_isConfigured() || !query?.trim()) return false;
    return true;
  },

  async execute(query, context = {}) {
    try {
      if (!_isConfigured()) {
        return { title: "Plex", html: "" };
      }

      const term = String(query).trim();
      if (!term) return { title: "Plex", html: "" };

      const items = await _execute(term, context);
      if (!items.length) return { title: "Plex", html: "" };

      const slotMaxResults = 3;
      const displayItems = items.slice(0, slotMaxResults);
      const resultsHtml = displayItems
        .map((item) => _renderItem(item, context))
        .join("");

      const itemCount =
        items.length > slotMaxResults
          ? `${slotMaxResults} of ${items.length} results`
          : `${items.length} result${items.length !== 1 ? "s" : ""}`;

      const result = {
        title: `Plex: ${term}`,
        html: `
          <div class="plex-slot-container">
            <div class="plex-slot-count">${itemCount}</div>
            <div class="plex-slot-results">
              ${resultsHtml}
            </div>
          </div>
        `,
      };

      return result;
    } catch (error) {
      context?.logger?.warn?.("Plex slot execute failed", error);
      return { title: "Plex", html: "" };
    }
  },
};

export const command = {
  isClientExposed: bypassImageProxy,
  name: "Plex",
  description: "Search your Plex media library",
  trigger: "plex",
  aliases: ["px"],

  settingsSchema: [],

  init: _init,
  configure: _configure,

  async execute(args, context = {}) {
    if (!_isConfigured()) {
      return {
        title: "Plex Search",
        html: _renderMessage(
          'Plex is not configured. Go to <a href="/settings">Settings → Plugins</a> to configure your Plex URL and token.',
        ),
      };
    }

    const term = String(args || "").trim();
    if (!term) {
      return {
        title: "Plex Search",
        html: _renderMessage("Usage: <code>!plex &lt;search term&gt;</code>"),
      };
    }

    try {
      const page = Math.max(1, Math.floor(Number(context.page) || 1));
      const startIndex = (page - 1) * PER_PAGE;

      const items = await _execute(term, context);
      if (!items.length) {
        return {
          title: "Plex Search",
          html: _renderMessage(`No results found for "${_esc(term)}"`),
          totalPages: 1,
        };
      }

      const totalCount = items.length;
      const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
      const pageItems = items.slice(startIndex, startIndex + PER_PAGE);

      if (!pageItems.length) {
        return {
          title: `Plex: ${term} - ${totalCount} results`,
          html: _renderMessage("No results on this page."),
          totalPages,
        };
      }

      const results = pageItems
        .map((item) => _renderItem(item, context))
        .join("");

      const pageInfo = totalPages > 1 ? ` - Page ${page} of ${totalPages}` : "";

      return {
        title: `Plex: ${term} - ${totalCount} results${pageInfo}`,
        html: `<div class="command-result">${results}</div>`,
        totalPages,
      };
    } catch (error) {
      context?.logger?.error?.("Plex search failed", error);

      return {
        title: "Plex Search",
        html: _renderMessage(
          "Failed to connect to Plex. Check your server URL, token, and server availability.",
        ),
      };
    }
  },
};
