export const type = "social media";

const DEFAULT_INSTANCE = "https://api.bsky.app";
const SEARCH_LIMIT = 25;
const FALLBACK_UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36";

const cursors = new Map();

const _toResult = (item, sourceName, context) => {
  const post = item?.post ?? item;
  const record = post?.record ?? {};
  const author = post?.author ?? {};
  const text = record?.text ?? "";

  const handle = author.handle ?? author.did;
  const postId = post?.uri?.split("/").pop();
  const url =
    handle && postId
      ? `https://bsky.app/profile/${handle}/post/${postId}`
      : undefined;

  const thumb = post?.embed?.images?.[0]?.thumb ?? post?.embed?.external?.thumb;
  let thumbnail = thumb;
  if (thumb && context?.signProxyUrl) thumbnail = context.signProxyUrl(thumb);

  const createdAt = record?.createdAt ?? post?.indexedAt;

  return {
    title: text.slice(0, 120).replace(/\s+/g, " ").trim(),
    url,
    snippet: text,
    source: sourceName,
    author: author.displayName ?? handle,
    publishedAt: createdAt,
    thumbnail,
  };
};

export default class bskyEngine {
  isClientExposed = false;
  name = "Bluesky";
  bangShortcut = "bsky";

  settingsSchema = [
    {
      key: "instanceUrl",
      label: "Instance URL",
      type: "url",
      placeholder: DEFAULT_INSTANCE,
      description:
        "Custom Bluesky instance to query. Leave blank to use bsky.app",
      default: DEFAULT_INSTANCE,
    },
  ];

  configure(settings) {
    this.instanceUrl = settings.instanceUrl;
  }

  async executeSearch(query, page = 1, timeFilter, context) {
    const doFetch = context?.fetch ?? fetch;
    const baseUrl = this.instanceUrl || DEFAULT_INSTANCE;
    const params = new URLSearchParams({
      q: query,
      limit: String(SEARCH_LIMIT),
      sort: "latest",
    });
    const lang = context?.lang;
    if (lang) params.set("lang", lang);

    if (timeFilter === "custom") {
      const dateFrom = context?.dateFrom;
      if (dateFrom) params.set("since", dateFrom);
      const dateTo = context?.dateTo;
      if (dateTo) params.set("until", dateTo);
    }

    const key = `${baseUrl}_${query}_${context?.lang ?? ""}_${context?.dateFrom ?? ""}_${context?.dateTo ?? ""}`;
    const requestedPage = Math.max(1, Number(page) || 1);
    if (requestedPage === 1) {
      cursors.delete(key);
    } else {
      const previous = cursors.get(key);
      if (!previous || previous.page !== requestedPage - 1) return [];
      params.set("cursor", previous.cursor);
    }

    const url = `${baseUrl}/xrpc/app.bsky.feed.searchPosts?${params.toString()}`;
    try {
      const response = await doFetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": context?.userAgent?.() ?? FALLBACK_UA,
        },
        method: "GET",
      });
      context?.sentinel?.(response, this.name);
      if (!response.ok) return [];

      const data = await response.json();
      const results = data?.posts ?? [];

      if (data?.cursor) {
        cursors.set(key, {
          page: requestedPage,
          cursor: data.cursor,
        });
      } else {
        cursors.delete(key);
      }

      return results
        .map((item) => _toResult(item, this.name, context))
        .filter((item) => item.url && (item.title || item.snippet));
    } catch (err) {
      throw err;
    }
  }
}
