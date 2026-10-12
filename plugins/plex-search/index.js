const PLEX_PLUGIN_ID = "plugin-plex";

let plexUrl = "";
let apiKey = "";
let urlMode = "server";
let machineId = "";
let template = "";
const PER_PAGE = 25;

const PLEX_LOGO =
  "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons@refs/heads/main/svg/plex.svg";

/**
 * @param {string} s
 * @returns {string}
 */
function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * @param {string} term
 * @returns {string[]}
 */
function searchVariants(term) {
  const variants = [term];
  if (term.includes("-")) variants.push(term.replace(/-/g, " "));
  else if (/\w\s+\w/.test(term)) variants.push(term.replace(/\s+/g, "-"));
  if (term.includes(".")) variants.push(term.replace(/\./g, " "));
  if (term.includes("'")) variants.push(term.replace(/'/g, ""));
  return [...new Set(variants)];
}

const EPISODE_PATTERNS = [
  /^(.+?)\s+s(\d+)\s*e(\d+)$/i,
  /^(.+?)\s+season\s+(\d+)\s+episode\s+(\d+)$/i,
  /^(.+?)\s+season\s+(\d+)\s+ep\.?\s+(\d+)$/i,
  /^(.+?)\s+(\d+)x(\d+)$/i,
];

const SEASON_PATTERNS = [/^(.+?)\s+season\s+(\d+)$/i, /^(.+?)\s+s(\d+)$/i];

/**
 * @param {string} term
 * @returns {{ series: string, season: number, episode: number|null }|null}
 */
function parseEpisodeQuery(term) {
  for (const re of EPISODE_PATTERNS) {
    const m = term.match(re);
    if (m) {
      return {
        series: m[1].trim(),
        season: parseInt(m[2], 10),
        episode: parseInt(m[3], 10),
      };
    }
  }
  for (const re of SEASON_PATTERNS) {
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
}

/**
 * @param {Record<string, string>} headers
 * @param {Function} doFetch
 * @param {object} context
 */
async function fetchMachineId(headers, doFetch, context) {
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
}

/**
 * @param {object} item
 * @returns {string}
 */
function buildItemUrl(item) {
  const key = item.key || `/library/metadata/${item.ratingKey}`;
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
}

/**
 * @param {string} path
 * @param {object} context
 * @returns {string}
 */
function buildThumbnailUrl(path, context) {
  if (!path) return "";
  const url = new URL(path, `${plexUrl}/`);
  url.searchParams.set("X-Plex-Token", apiKey);
  return context.signProxyUrl(url.toString());
}

/**
 * @param {unknown} duration
 * @returns {string}
 */
function formatDuration(duration) {
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
}

/**
 * @param {object} item
 * @returns {string}
 */
function buildEpisodeContext(item) {
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
}

/**
 * @param {object} item
 * @param {object} context
 * @returns {string}
 */
function renderItem(item, context) {
  const type = String(item.type || "");
  const title = String(item.title || "");
  const year = item.year ? ` (${item.year})` : "";
  const summary = String(item.summary || "");
  const episodeContext = buildEpisodeContext(item);
  const duration = formatDuration(item.duration);
  const subtitle = episodeContext
    ? `<div class="result-episode-context">${escHtml(episodeContext)}</div>`
    : "";
  const badges = [
    `<span class="result-engine-tag">${escHtml(type)}</span>`,
    `<span class="result-engine-tag">Plex</span>`,
    ...(duration
      ? [`<span class="result-engine-tag">${escHtml(duration)}</span>`]
      : []),
  ].join("");
  const thumbPath = item.thumb || item.art || "";
  const thumbSrc = thumbPath ? buildThumbnailUrl(thumbPath, context) : "";
  const thumbBlock = thumbSrc
    ? `<div class="result-thumbnail-wrap"><img class="result-thumbnail-img" src="${escHtml(thumbSrc)}" alt="" loading="lazy"></div>`
    : "";

  const data = {
    faviconSrc: PLEX_LOGO,
    cite: escHtml(plexUrl),
    itemUrl: escHtml(buildItemUrl(item)),
    title: escHtml(title) + escHtml(year),
    subtitle,
    overview: escHtml(summary),
    badges,
    thumbBlock,
  };

  data.duration = escHtml(duration);
  data.type = escHtml(type);
  data.year = escHtml(item.year || "");
  data.source = "Plex";

  return String(template || "").replace(
    /\{\{(\w+)\}\}/g,
    (_, key) => data[key] ?? "",
  );
}

/**
 * @param {object[][]} groups
 * @returns {object[]}
 */
function deduplicateItems(groups) {
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
}

/**
 * @param {{ series: string, season: number, episode: number|null }} episodeQuery
 * @param {Record<string, string>} headers
 * @param {Function} doFetch
 * @param {object} context
 * @returns {Promise<object[]>}
 */
async function findEpisode(episodeQuery, headers, doFetch, context) {
  const seriesVariants = searchVariants(episodeQuery.series);
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

  const shows = deduplicateItems(
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

  return deduplicateItems([matchingItems]);
}

/**
 * @param {string} term
 * @param {Record<string, string>} headers
 * @param {Function} doFetch
 * @param {object} context
 * @returns {Promise<object[]>}
 */
async function searchLibrary(term, headers, doFetch, context) {
  const variants = searchVariants(term);

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

  return deduplicateItems(groups);
}

function renderMessage(message) {
  return `<div class="command-result"><p>${message}</p></div>`;
}

export default {
  name: "Plex",
  description: "Search your Plex media library",
  trigger: "plex",
  isClientExposed: false,
  aliases: ["px"],
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
  ],

  /** @param {{ template?: string }} ctx */
  init(ctx) {
    template = ctx?.template || "";
  },

  /** @param {{ url?: string, apiKey?: string, urlMode?: string }} settings */
  configure(settings) {
    plexUrl = (settings.url || "").replace(/\/+$/, "");
    apiKey = settings.apiKey || "";
    urlMode = settings.urlMode || "server";
    machineId = "";
  },

  async isConfigured() {
    return Boolean(plexUrl && apiKey);
  },

  /**
   * @param {string} args
   * @param {object} context
   */
  async execute(args, context = {}) {
    if (!plexUrl || !apiKey) {
      return {
        title: "Plex Search",
        html: renderMessage(
          'Plex is not configured. Go to <a href="/settings">Settings → Plugins</a> to configure your Plex URL and token.',
        ),
      };
    }

    const term = String(args || "").trim();

    if (!term) {
      return {
        title: "Plex Search",
        html: renderMessage("Usage: <code>!plex &lt;search term&gt;</code>"),
      };
    }

    try {
      const page = Math.max(1, Math.floor(Number(context.page) || 1));
      const startIndex = (page - 1) * PER_PAGE;

      const doFetch = context?.fetch ?? fetch;
      const headers = {
        "X-Plex-Token": apiKey,
        Accept: "application/json",
      };

      if (!machineId) {
        await fetchMachineId(headers, doFetch, context);
      }

      const episodeQuery = parseEpisodeQuery(term);
      let items = [];
      if (episodeQuery) {
        items = await findEpisode(episodeQuery, headers, doFetch, context);
      }

      // Fall back to normal Plex search if no episode matches were found.
      if (!items.length) {
        items = await searchLibrary(term, headers, doFetch, context);
      }

      if (!items.length) {
        return {
          title: "Plex Search",
          html: renderMessage(`No results found for "${escHtml(term)}"`),
          totalPages: 1,
        };
      }

      const totalCount = items.length;
      const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
      const pageItems = items.slice(startIndex, startIndex + PER_PAGE);

      if (!pageItems.length) {
        return {
          title: `Plex: ${term} - ${totalCount} results`,
          html: renderMessage("No results on this page."),
          totalPages,
        };
      }

      const results = pageItems
        .map((item) => renderItem(item, context))
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
        html: renderMessage(
          "Failed to connect to Plex. Check your server URL, token, and server availability.",
        ),
      };
    }
  },
};
