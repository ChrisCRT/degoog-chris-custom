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

export default class PlexEngine {
  name = "Plex";
  bangShortcut = "plex";
  isClientExposed = false;
  disabledByDefault = true;

  settingsSchema = [
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
        "Guide to learn your token: https://support.plex.tv/articles/204059436-finding-an-authentication-token-x-plex-token/",
    },
    {
      key: "bypassProxy",
      label: "Bypass proxy",
      type: "toggle",
      default: "true",
      description:
        "Connect directly to the Plex Media Server instance instead of routing through the proxy. Enable this when Plex is on your local network.",
    },
    {
      key: "urlMode",
      label: "Open results with",
      type: "select",
      options: ["server", "plexWeb"], //, "plexDesktop"
      default: "server",
      description: "Choose where results open, your server or plex.tv",
    },
  ];

  _bypassProxy = true;

  configure(settings) {
    this.plexUrl = (settings.url || "").replace(/\/$/, "");
    this.apiKey = settings.apiKey || "";
    this._bypassProxy = settings.bypassProxy !== "false";
    this.urlMode = settings.urlMode || "plex";
    this.machineId = "";
  }

  /**
   * @param {Record<string, string>} headers
   * @param {Function} doFetch
   */
  async fetchMachineId(headers, doFetch, context) {
    const response = await doFetch(`${this.plexUrl}/identity`, { headers });
    context?.sentinel?.(response, this.name);
    const data = await response.json();
    this.machineId = data?.MediaContainer?.machineIdentifier ?? "";
  }

  /**
   * @param {string} ratingKey
   * @returns {string}
   */
  buildItemUrl(ratingKey, type) {
    if (!this.machineId) return this.plexUrl;

    /** plex:// doesnt work for some reason
     if (this.urlMode === "plexDesktop") {
      let metadataType;
      switch (type) {
        case "movie":
          metadataType = 1;
          break;
        case "show":
          metadataType = 2;
          break;
        case "season":
          metadataType = 3;
          break;
        case "episode":
          metadataType = 4;
          break;
        default:
          metadataType = 1;
      }

      return `plex://preplay/?metadataKey=${encodeURIComponent(
        `/library/metadata/${ratingKey}`,
      )}&metadataType=${metadataType}&server=${encodeURIComponent(
        this.machineId,
      )}`;
    }
    */

    if (this.urlMode === "plexWeb") {
      return `https://app.plex.tv/desktop/#!/server/${encodeURIComponent(this.machineId)}/details?key=${encodeURIComponent(`/library/metadata/${ratingKey}`)}`;
    }

    return `${this.plexUrl}/web/index.html#!/server/${this.machineId}/details?key=${encodeURIComponent(`/library/metadata/${ratingKey}`)}`;
  }

  /**
   * @param {string} path
   * @param {object} context
   * @returns {string}
   */
  buildThumbnailUrl(path, context) {
    if (!path) return "";
    const url = new URL(path, `${this.plexUrl}/`);
    url.searchParams.set("X-Plex-Token", this.apiKey);

    if (!this._bypassProxy && context?.signProxyUrl) {
      return context.signProxyUrl(url.toString());
    }

    return url.toString();
  }

  /**
   * @param {object} item
   * @param {object} context
   * @returns {object}
   */
  normaliseResult(item, context) {
    const type = String(item.type || "");
    let snippet = item.summary || "";

    if (type === "episode") {
      const series = item.grandparentTitle || "";
      const season = item.parentIndex;
      const episode = item.index;
      const parts = [];

      if (series) parts.push(series);

      if (season != null && episode != null) {
        parts.push(
          `S${String(season).padStart(2, "0")}E${String(episode).padStart(2, "0")}`,
        );
      } else if (episode != null) {
        parts.push(`Episode ${episode}`);
      }

      if (parts.length > 0) {
        snippet = `${parts.join(" — ")}${snippet ? ` — ${snippet}` : ""}`;
      }
    } else if (type === "season") {
      const series = item.parentTitle || item.grandparentTitle || "";

      if (series) {
        snippet = `${series}${snippet ? ` — ${snippet}` : ""}`;
      }
    }

    const result = {
      title: String(item.title || ""),
      url: this.buildItemUrl(item.ratingKey, type),
      snippet,
      source: this.name,
    };

    const thumbPath = item.thumb || item.art;
    if (thumbPath) {
      result.thumbnail = this.buildThumbnailUrl(thumbPath, context);
    }

    const duration = item.duration;
    if (duration) {
      const dur = Math.floor(Number(duration) / 1000),
        h = Math.floor(dur / 3600),
        m = Math.floor((dur % 3600) / 60),
        s = dur % 60;

      result.duration = [
        h > 0 ? String(h).padStart(2, "0") : "",
        String(m).padStart(2, "0"),
        String(s).padStart(2, "0"),
      ]
        .filter(Boolean)
        .join(":");
    }

    return result;
  }

  /**
   * @param {{series: string, season: number, episode: number|null}} epQuery
   * @param {Record<string, string>} headers
   * @param {Function} doFetch
   * @param {number} limit
   * @param {number} startIndex
   * @param {object} context
   * @returns {Promise<object[]>}
   */
  async findEpisode(epQuery, headers, doFetch, limit, startIndex, context) {
    const seriesVariants = searchVariants(epQuery.series);
    const seriesFetches = seriesVariants.map(async (variant) => {
      const response = await doFetch(
        `${this.plexUrl}/search?query=${encodeURIComponent(variant)}&type=2&limit=5`,
        { headers },
      );
      context?.sentinel?.(response, this.name);
      if (!response.ok) return null;
      return response.json();
    });
    const seriesResults = await Promise.all(seriesFetches);

    const seen = new Set();
    const allShows = [];
    for (const data of seriesResults) {
      for (const item of data?.MediaContainer?.Metadata || []) {
        if (!seen.has(item.ratingKey)) {
          seen.add(item.ratingKey);
          allShows.push(item);
        }
      }
    }
    if (allShows.length === 0) return [];

    const episodeFetches = allShows.map(async (show) => {
      const response = await doFetch(
        `${this.plexUrl}/library/metadata/${show.ratingKey}/allLeaves?limit=${limit}&offset=${startIndex}`,
        { headers },
      );
      context?.sentinel?.(response, this.name);
      if (!response.ok) return null;
      return response.json();
    });
    const episodeResults = await Promise.all(episodeFetches);

    const items = [];
    for (const data of episodeResults) {
      for (const episode of data?.MediaContainer?.Metadata || []) {
        if (epQuery.season != null && episode.parentIndex !== epQuery.season) {
          continue;
        }
        if (epQuery.episode != null && episode.index !== epQuery.episode) {
          continue;
        }
        items.push(this.normaliseResult(episode, context));
      }
    }

    return items;
  }

  /**
   * @param {string} query
   * @param {number} page
   * @param {string} _timeFilter
   * @param {object} context
   * @returns {Promise<object[]>}
   */
  async executeSearch(query, page = 1, _timeFilter, context) {
    if (!this.plexUrl || !this.apiKey) return [];

    const term = query.trim();
    if (!term) return [];

    const doFetch = this._bypassProxy ? fetch : (context?.fetch ?? fetch);
    const headers = {
      "X-Plex-Token": this.apiKey,
      Accept: "application/json",
    };

    if (!this.machineId) {
      await this.fetchMachineId(headers, doFetch, context);
    }

    const perPage = 25;
    const startIndex = (page - 1) * perPage;

    const episodeQuery = parseEpisodeQuery(term);
    if (episodeQuery) {
      const episodeResults = await this.findEpisode(
        episodeQuery,
        headers,
        doFetch,
        perPage,
        startIndex,
        context,
      );

      if (episodeResults.length > 0) {
        return episodeResults;
      }
    }

    const variants = searchVariants(term);

    const fetches = variants.map(async (variant) => {
      const response = await doFetch(
        `${this.plexUrl}/hubs/search?query=${encodeURIComponent(variant)}&limit=${perPage}`,
        { headers },
      );
      context?.sentinel?.(response, this.name);
      if (!response.ok) return null;
      return response.json();
    });
    const responses = await Promise.all(fetches);

    const seen = new Set();
    const results = [];
    for (const data of responses) {
      for (const hub of data?.MediaContainer?.Hub || []) {
        for (const item of hub.Metadata || []) {
          if (!seen.has(item.ratingKey)) {
            seen.add(item.ratingKey);
            results.push(this.normaliseResult(item, context));
          }
        }
      }
    }

    const offset = startIndex;

    return results.slice(offset, offset + perPage);
  }
}
