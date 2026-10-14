export const type = "social media";

const DEFAULT_INSTANCE = "https://api.fxtwitter.com";
const SEARCH_LIMIT = 25;
const FALLBACK_UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36";

const _toResult = (item, sourceName) => {
  const author = item.author ?? {};
  const username =
    author.screen_name ?? author.username ?? author.user_name ?? "";
  const text = item.text ?? item.full_text ?? item.tweet_text ?? "";
  const id = item.id_str ?? item.id ?? item.rest_id;
  const url =
    item.url ??
    (username && id
      ? `https://x.com/${username}/status/${id}`
      : "https://x.com");
  const media = item.media ?? {};
  const thumbnail =
    media.photos?.[0]?.url ??
    media.photos?.[0]?.media_url_https ??
    media.videos?.[0]?.thumbnail_url ??
    "";
  const displayName = author.name ?? author.display_name ?? username;
  const title = displayName
    ? `${displayName}${username ? ` (@${username})` : ""}`
    : "X post";
  const snippet = text.length > 300 ? `${text.slice(0, 300)}...` : text;

  return {
    title,
    url,
    snippet,
    source: sourceName,
    thumbnail: context.signProxyUrl(thumbnail),
  };
};

export default class TwitterEngine {
  isClientExposed = false;
  name = "fxEmbed (Twitter)";
  bangShortcut = "twitter";

  settingsSchema = [
    {
      key: "instanceUrl",
      label: "Instance URL",
      type: "url",
      placeholder: DEFAULT_INSTANCE,
      description:
        "Custom fxEmbed instance to query. Leave blank to use fxtwitter.com",
      default: DEFAULT_INSTANCE,
    },
  ];

  configure(settings) {
    this.instanceUrl = settings.instanceUrl;
  }

  async executeSearch(query, page = 1, timeFilter, context) {
    const doFetch = context?.fetch ?? fetch;
    const params = new URLSearchParams({
      q: query,
      count: String(SEARCH_LIMIT),
      feed: "latest",
    });
    const lang = context?.lang;
    if (lang) params.set("lang", lang);
    const cursor = context?.cursor;
    if (cursor) params.set("cursor", cursor);

    const url = `${this.instanceUrl || DEFAULT_INSTANCE}/2/?${params.toString()}`;
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
      const results = data?.results ?? [];

      return results
        .filter((item) => item?.type === "status")
        .map((item) => _toResult(item, this.name))
        .filter((item) => item.title || item.snippet);
    } catch (err) {
      if (err?.name === "SentinelBreach") throw err;
      return [];
    }
  }
}
